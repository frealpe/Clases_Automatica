import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, Query, UseGuards,
  BadRequestException, ForbiddenException, NotFoundException,
  OnModuleInit, ParseIntPipe,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { DatabaseService } from '../database/database.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { enviarCorreo } from '../common/mail.service';

// Vida del token que codifica el QR: el frontend lo rota antes de que expire (cada 20-30s).
const SEGUNDOS_VIDA_TOKEN = 40;
// Umbral de faltas no justificadas que dispara el correo de alerta.
const UMBRAL_FALTAS_NOTIFICACION = 2;

@Controller('asistencia')
export class AsistenciaController implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(
        `CREATE TABLE IF NOT EXISTS horarios_materia (
          id SERIAL PRIMARY KEY,
          materia_id INT NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
          dia_semana SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
          hora_inicio TIME NOT NULL,
          hora_fin TIME NOT NULL,
          creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CHECK (hora_fin > hora_inicio)
        );`,
      );
      await this.db.query(
        `CREATE TABLE IF NOT EXISTS sesiones_asistencia (
          id SERIAL PRIMARY KEY,
          materia_id INT NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
          horario_id INT REFERENCES horarios_materia(id) ON DELETE SET NULL,
          docente_id INT NOT NULL REFERENCES usuarios(id),
          fecha_clase DATE NOT NULL,
          ventana_inicio TIMESTAMP NOT NULL,
          ventana_fin TIMESTAMP NOT NULL,
          token_actual VARCHAR(64) NOT NULL,
          token_expira_en TIMESTAMP NOT NULL,
          cerrada BOOLEAN NOT NULL DEFAULT FALSE,
          creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (materia_id, fecha_clase, ventana_inicio)
        );`,
      );
      await this.db.query(`CREATE INDEX IF NOT EXISTS idx_sesiones_asistencia_token ON sesiones_asistencia (token_actual);`);
      await this.db.query(
        `CREATE TABLE IF NOT EXISTS registros_asistencia (
          id SERIAL PRIMARY KEY,
          sesion_id INT NOT NULL REFERENCES sesiones_asistencia(id) ON DELETE CASCADE,
          estudiante_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          estado VARCHAR(20) NOT NULL DEFAULT 'PRESENTE' CHECK (estado IN ('PRESENTE', 'FALTA')),
          justificada BOOLEAN NOT NULL DEFAULT FALSE,
          justificacion_comentario TEXT,
          escaneado_en TIMESTAMP,
          notificacion_enviada BOOLEAN NOT NULL DEFAULT FALSE,
          creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (sesion_id, estudiante_id)
        );`,
      );
      await this.db.query(`CREATE INDEX IF NOT EXISTS idx_registros_asistencia_estudiante ON registros_asistencia (estudiante_id, estado, justificada);`);
    } catch (err) {
      console.error('Error al inicializar tablas de asistencia en PostgreSQL:', err);
    }
  }

  // Mismo criterio de acceso que ExamenesProgramadosController/MateriasController: SUPERUSUARIO
  // ve todo, DOCENTE solo sus materias, ESTUDIANTE solo materias donde está inscrito.
  private async verificarAccesoMateria(materiaId: number, req: any) {
    if (req.user.rol === 'SUPERUSUARIO') return;
    if (req.user.rol === 'DOCENTE') {
      const { rows } = await this.db.query(`SELECT docente_id AS "docenteId" FROM materias WHERE id = $1`, [materiaId]);
      if (!rows[0] || rows[0].docenteId !== req.user.id) {
        throw new ForbiddenException('No administras esta materia');
      }
      return;
    }
    const { rows } = await this.db.query(
      `SELECT 1 FROM inscripciones WHERE materia_id = $1 AND estudiante_id = $2`,
      [materiaId, req.user.id],
    );
    if (rows.length === 0) throw new ForbiddenException('No estás inscrito en esta materia');
  }

  private generarToken(): string {
    return crypto.randomBytes(24).toString('hex');
  }

  private async obtenerSesionOFallar(id: number) {
    const { rows } = await this.db.query(
      `SELECT id, materia_id AS "materiaId", docente_id AS "docenteId",
              ventana_fin AS "ventanaFin", token_expira_en AS "tokenExpiraEn"
       FROM sesiones_asistencia WHERE id = $1`,
      [id],
    );
    if (!rows[0]) throw new NotFoundException('Sesión de asistencia no encontrada');
    return rows[0];
  }

  // Reúne las faltas no justificadas de un estudiante en una materia; si son >= al umbral y hay
  // alguna aún no notificada, envía el correo y marca esas filas como notificadas. Idempotente:
  // llamarlo de más no reenvía correos ya disparados para el mismo conteo.
  private async evaluarNotificacionFaltas(materiaId: number, estudianteId: number) {
    const { rows } = await this.db.query(
      `SELECT r.id, r.notificacion_enviada AS "notificacionEnviada"
       FROM registros_asistencia r
       JOIN sesiones_asistencia s ON s.id = r.sesion_id
       WHERE s.materia_id = $1 AND r.estudiante_id = $2 AND r.estado = 'FALTA' AND r.justificada = false`,
      [materiaId, estudianteId],
    );
    if (rows.length < UMBRAL_FALTAS_NOTIFICACION) return;
    const pendientes = rows.filter((r: any) => !r.notificacionEnviada);
    if (pendientes.length === 0) return;

    const { rows: usuarioRows } = await this.db.query(`SELECT nombre, email FROM usuarios WHERE id = $1`, [estudianteId]);
    const estudiante = usuarioRows[0];
    if (!estudiante) return;
    const { rows: materiaRows } = await this.db.query(`SELECT nombre FROM materias WHERE id = $1`, [materiaId]);
    const materiaNombre = materiaRows[0]?.nombre || 'la materia';

    await enviarCorreo(
      estudiante.email,
      `Alerta de inasistencias — ${materiaNombre}`,
      `<p>Hola ${estudiante.nombre},</p>
       <p>Has acumulado <strong>${rows.length}</strong> falta(s) no justificada(s) en <strong>${materiaNombre}</strong>.</p>
       <p>Si alguna de estas faltas debe justificarse, contacta a tu docente.</p>`,
    );
    await this.db.query(
      `UPDATE registros_asistencia SET notificacion_enviada = true WHERE id = ANY($1)`,
      [rows.map((r: any) => r.id)],
    );
  }

  // Cierra las sesiones cuya ventana ya pasó: materializa FALTA para quien no escaneó y evalúa
  // notificación por correo. Se llama de forma perezosa (sin cron) al leer resumen/registros.
  private async sincronizarFaltasVencidas(materiaId: number) {
    const { rows: vencidas } = await this.db.query(
      `SELECT id FROM sesiones_asistencia WHERE materia_id = $1 AND cerrada = false AND ventana_fin < NOW()`,
      [materiaId],
    );
    for (const sesion of vencidas) {
      const { rows: faltantes } = await this.db.query(
        `INSERT INTO registros_asistencia (sesion_id, estudiante_id, estado)
         SELECT $1, i.estudiante_id, 'FALTA' FROM inscripciones i WHERE i.materia_id = $2
         ON CONFLICT (sesion_id, estudiante_id) DO NOTHING
         RETURNING estudiante_id AS "estudianteId"`,
        [sesion.id, materiaId],
      );
      await this.db.query(`UPDATE sesiones_asistencia SET cerrada = true WHERE id = $1`, [sesion.id]);
      for (const f of faltantes) {
        await this.evaluarNotificacionFaltas(materiaId, f.estudianteId);
      }
    }
  }

  @Get('horarios/:materiaId')
  @UseGuards(JwtAuthGuard)
  async listarHorarios(@Param('materiaId', ParseIntPipe) materiaId: number, @Req() req: any) {
    await this.verificarAccesoMateria(materiaId, req);
    const { rows } = await this.db.query(
      `SELECT id, materia_id AS "materiaId", dia_semana AS "diaSemana",
              hora_inicio AS "horaInicio", hora_fin AS "horaFin"
       FROM horarios_materia WHERE materia_id = $1 ORDER BY dia_semana, hora_inicio`,
      [materiaId],
    );
    return rows;
  }

  @Post('horarios')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async crearHorario(@Body() body: any, @Req() req: any) {
    const materiaId = parseInt(body?.materiaId, 10);
    const diaSemana = parseInt(body?.diaSemana, 10);
    const horaInicio = body?.horaInicio;
    const horaFin = body?.horaFin;
    if (!materiaId) throw new BadRequestException('materiaId es requerido');
    if (isNaN(diaSemana) || diaSemana < 0 || diaSemana > 6) {
      throw new BadRequestException('diaSemana debe estar entre 0 (domingo) y 6 (sábado)');
    }
    if (!horaInicio || !horaFin) throw new BadRequestException('horaInicio y horaFin son requeridas');
    if (horaFin <= horaInicio) throw new BadRequestException('horaFin debe ser posterior a horaInicio');

    await this.verificarAccesoMateria(materiaId, req);

    const { rows } = await this.db.query(
      `INSERT INTO horarios_materia (materia_id, dia_semana, hora_inicio, hora_fin)
       VALUES ($1,$2,$3,$4)
       RETURNING id, materia_id AS "materiaId", dia_semana AS "diaSemana", hora_inicio AS "horaInicio", hora_fin AS "horaFin"`,
      [materiaId, diaSemana, horaInicio, horaFin],
    );
    return { status: 'ok', mensaje: 'Horario creado', horario: rows[0] };
  }

  @Delete('horarios/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async eliminarHorario(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const { rows } = await this.db.query(`SELECT materia_id AS "materiaId" FROM horarios_materia WHERE id = $1`, [id]);
    if (!rows[0]) throw new NotFoundException('Horario no encontrado');
    await this.verificarAccesoMateria(rows[0].materiaId, req);
    await this.db.query(`DELETE FROM horarios_materia WHERE id = $1`, [id]);
    return { ok: true, mensaje: 'Horario eliminado' };
  }

  @Post('sesiones/abrir')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async abrirSesion(@Body() body: any, @Req() req: any) {
    const materiaId = parseInt(body?.materiaId, 10);
    const horarioId = parseInt(body?.horarioId, 10);
    if (!materiaId || !horarioId) throw new BadRequestException('materiaId y horarioId son requeridos');
    await this.verificarAccesoMateria(materiaId, req);

    const { rows: horarioRows } = await this.db.query(
      `SELECT id, materia_id AS "materiaId", hora_inicio AS "horaInicio", hora_fin AS "horaFin"
       FROM horarios_materia WHERE id = $1`,
      [horarioId],
    );
    const horario = horarioRows[0];
    if (!horario || horario.materiaId !== materiaId) {
      throw new BadRequestException('El horario indicado no pertenece a esta materia');
    }

    const fechaClase = new Date().toISOString().slice(0, 10);
    const ventanaInicio = new Date(`${fechaClase}T${horario.horaInicio}`);
    const ventanaFin = new Date(`${fechaClase}T${horario.horaFin}`);
    if (Date.now() > ventanaFin.getTime()) {
      throw new BadRequestException('La ventana de este horario ya pasó por hoy');
    }

    const token = this.generarToken();
    const tokenExpiraEn = new Date(Date.now() + SEGUNDOS_VIDA_TOKEN * 1000);

    const { rows } = await this.db.query(
      `INSERT INTO sesiones_asistencia
         (materia_id, horario_id, docente_id, fecha_clase, ventana_inicio, ventana_fin, token_actual, token_expira_en)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (materia_id, fecha_clase, ventana_inicio)
       DO UPDATE SET token_actual = EXCLUDED.token_actual, token_expira_en = EXCLUDED.token_expira_en, cerrada = false
       RETURNING id AS "sesionId", token_actual AS "token", token_expira_en AS "tokenExpiraEn", ventana_fin AS "ventanaFin"`,
      [materiaId, horarioId, req.user.id, fechaClase, ventanaInicio, ventanaFin, token, tokenExpiraEn],
    );
    return { status: 'ok', sesion: rows[0] };
  }

  @Post('sesiones/:id/rotar-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async rotarToken(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const sesion = await this.obtenerSesionOFallar(id);
    await this.verificarAccesoMateria(sesion.materiaId, req);
    if (Date.now() > new Date(sesion.ventanaFin).getTime()) {
      throw new ForbiddenException({ error: 'VENTANA_CERRADA', mensaje: 'La ventana de esta clase ya cerró' });
    }

    const token = this.generarToken();
    const tokenExpiraEn = new Date(Date.now() + SEGUNDOS_VIDA_TOKEN * 1000);
    const { rows } = await this.db.query(
      `UPDATE sesiones_asistencia SET token_actual = $2, token_expira_en = $3
       WHERE id = $1
       RETURNING id AS "sesionId", token_actual AS "token", token_expira_en AS "tokenExpiraEn", ventana_fin AS "ventanaFin"`,
      [id, token, tokenExpiraEn],
    );
    return { status: 'ok', sesion: rows[0] };
  }

  @Get('sesiones/:id/estado')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async estadoSesion(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const sesion = await this.obtenerSesionOFallar(id);
    await this.verificarAccesoMateria(sesion.materiaId, req);
    const { rows: presentesRows } = await this.db.query(
      `SELECT COUNT(*)::int AS presentes FROM registros_asistencia WHERE sesion_id = $1 AND estado = 'PRESENTE'`,
      [id],
    );
    const { rows: totalRows } = await this.db.query(
      `SELECT COUNT(*)::int AS total FROM inscripciones WHERE materia_id = $1`,
      [sesion.materiaId],
    );
    return { presentes: presentesRows[0].presentes, total: totalRows[0].total, ventanaFin: sesion.ventanaFin };
  }

  @Post('escanear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ESTUDIANTE')
  async escanear(@Body() body: any, @Req() req: any) {
    const token = (body?.token || '').trim();
    if (!token) throw new BadRequestException('token es requerido');

    const { rows } = await this.db.query(
      `SELECT id, materia_id AS "materiaId", token_expira_en AS "tokenExpiraEn", ventana_fin AS "ventanaFin"
       FROM sesiones_asistencia WHERE token_actual = $1`,
      [token],
    );
    const sesion = rows[0];
    if (!sesion) throw new NotFoundException('Código QR no reconocido');

    const ahora = Date.now();
    if (ahora > new Date(sesion.ventanaFin).getTime()) {
      throw new ForbiddenException({ error: 'VENTANA_CERRADA', mensaje: 'La ventana de esta clase ya cerró' });
    }
    if (ahora > new Date(sesion.tokenExpiraEn).getTime()) {
      throw new ForbiddenException({ error: 'TOKEN_EXPIRADO', mensaje: 'Este código QR ya expiró, escanea el código vigente' });
    }

    const { rows: inscrito } = await this.db.query(
      `SELECT 1 FROM inscripciones WHERE materia_id = $1 AND estudiante_id = $2`,
      [sesion.materiaId, req.user.id],
    );
    if (inscrito.length === 0) throw new ForbiddenException('No estás inscrito en esta materia');

    const { rows: insertado } = await this.db.query(
      `INSERT INTO registros_asistencia (sesion_id, estudiante_id, estado, escaneado_en)
       VALUES ($1, $2, 'PRESENTE', NOW())
       ON CONFLICT (sesion_id, estudiante_id) DO NOTHING
       RETURNING id`,
      [sesion.id, req.user.id],
    );
    if (insertado.length === 0) {
      return { ok: true, mensaje: 'Ya tenías asistencia registrada en esta sesión' };
    }
    return { ok: true, mensaje: 'Asistencia registrada correctamente' };
  }

  @Get('materia/:materiaId/resumen')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async resumenMateria(@Param('materiaId', ParseIntPipe) materiaId: number, @Req() req: any) {
    await this.verificarAccesoMateria(materiaId, req);
    await this.sincronizarFaltasVencidas(materiaId);

    const { rows } = await this.db.query(
      `SELECT u.id AS "estudianteId", u.nombre, u.email,
              COUNT(*) FILTER (WHERE r.estado = 'PRESENTE')::int AS "totalPresentes",
              COUNT(*) FILTER (WHERE r.estado = 'FALTA' AND r.justificada = false)::int AS "totalFaltasNoJustificadas",
              COUNT(*) FILTER (WHERE r.estado = 'FALTA' AND r.justificada = true)::int AS "totalFaltasJustificadas"
       FROM inscripciones i
       JOIN usuarios u ON u.id = i.estudiante_id
       LEFT JOIN registros_asistencia r
         ON r.estudiante_id = u.id
         AND r.sesion_id IN (SELECT id FROM sesiones_asistencia WHERE materia_id = $1)
       WHERE i.materia_id = $1
       GROUP BY u.id, u.nombre, u.email
       ORDER BY u.nombre`,
      [materiaId],
    );
    return rows;
  }

  @Get('materia/:materiaId/registros')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async registrosMateria(@Param('materiaId', ParseIntPipe) materiaId: number, @Req() req: any) {
    await this.verificarAccesoMateria(materiaId, req);
    await this.sincronizarFaltasVencidas(materiaId);

    const { rows } = await this.db.query(
      `SELECT r.id, r.estudiante_id AS "estudianteId", u.nombre AS "estudianteNombre",
              r.estado, r.justificada, r.justificacion_comentario AS "justificacionComentario",
              r.escaneado_en AS "escaneadoEn", s.id AS "sesionId", s.fecha_clase AS "fechaClase",
              s.ventana_inicio AS "ventanaInicio", s.ventana_fin AS "ventanaFin"
       FROM registros_asistencia r
       JOIN sesiones_asistencia s ON s.id = r.sesion_id
       JOIN usuarios u ON u.id = r.estudiante_id
       WHERE s.materia_id = $1
       ORDER BY s.fecha_clase DESC, u.nombre`,
      [materiaId],
    );
    return rows;
  }

  @Patch('registros/:id/justificar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async justificarRegistro(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    const { rows } = await this.db.query(
      `SELECT r.id, r.estudiante_id AS "estudianteId", s.materia_id AS "materiaId"
       FROM registros_asistencia r JOIN sesiones_asistencia s ON s.id = r.sesion_id
       WHERE r.id = $1`,
      [id],
    );
    const registro = rows[0];
    if (!registro) throw new NotFoundException('Registro de asistencia no encontrado');
    await this.verificarAccesoMateria(registro.materiaId, req);

    const justificada = !!body?.justificada;
    const comentario = body?.comentario !== undefined ? String(body.comentario).trim() : null;
    await this.db.query(
      `UPDATE registros_asistencia SET justificada = $2, justificacion_comentario = $3 WHERE id = $1`,
      [id, justificada, comentario],
    );

    // Al desjustificar, la falta vuelve a contar; si eso cruza el umbral otra vez, se reabre la
    // notificación de esas filas para que evaluarNotificacionFaltas pueda re-disparar el correo.
    if (!justificada) {
      await this.db.query(
        `UPDATE registros_asistencia SET notificacion_enviada = false
         WHERE estudiante_id = $2 AND estado = 'FALTA' AND justificada = false
           AND sesion_id IN (SELECT id FROM sesiones_asistencia WHERE materia_id = $1)`,
        [registro.materiaId, registro.estudianteId],
      );
    }
    await this.evaluarNotificacionFaltas(registro.materiaId, registro.estudianteId);

    return { ok: true, mensaje: 'Registro de asistencia actualizado' };
  }

  @Get('estudiante/mis-registros')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ESTUDIANTE')
  async misRegistros(@Req() req: any, @Query('materiaId') materiaIdParam: string) {
    const materiaId = parseInt(materiaIdParam, 10);
    if (!materiaId) throw new BadRequestException('materiaId es requerido');
    await this.verificarAccesoMateria(materiaId, req);

    const { rows } = await this.db.query(
      `SELECT r.id, r.estado, r.justificada, r.escaneado_en AS "escaneadoEn",
              s.fecha_clase AS "fechaClase", s.ventana_inicio AS "ventanaInicio", s.ventana_fin AS "ventanaFin"
       FROM registros_asistencia r
       JOIN sesiones_asistencia s ON s.id = r.sesion_id
       WHERE s.materia_id = $1 AND r.estudiante_id = $2
       ORDER BY s.fecha_clase DESC`,
      [materiaId, req.user.id],
    );
    return rows;
  }
}
