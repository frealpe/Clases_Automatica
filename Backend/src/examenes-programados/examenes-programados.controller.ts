import {
  Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards,
  BadRequestException, ForbiddenException, NotFoundException, ConflictException,
  OnModuleInit, ParseIntPipe,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Margen tras fecha_fin durante el cual todavía se acepta el submit (auto-envío del cliente por
// timeout puede llegar unos segundos tarde por latencia de red).
const MINUTOS_GRACIA_SUBMIT = 2;

// Para SELECT ... FROM examenes_programados e (con alias de tabla).
const COLUMNAS_EXAMEN = `e.id, e.materia_id AS "materiaId", e.docente_id AS "docenteId", e.titulo,
  e.fecha_inicio AS "fechaInicio", e.fecha_fin AS "fechaFin", e.duracion_min AS "duracionMin",
  e.cantidad_teoria AS "cantidadTeoria", e.cantidad_ejercicio AS "cantidadEjercicio", e.estado`;

// Para INSERT/UPDATE ... RETURNING (sin alias de tabla).
const COLUMNAS_EXAMEN_RETURNING = `id, materia_id AS "materiaId", docente_id AS "docenteId", titulo,
  fecha_inicio AS "fechaInicio", fecha_fin AS "fechaFin", duracion_min AS "duracionMin",
  cantidad_teoria AS "cantidadTeoria", cantidad_ejercicio AS "cantidadEjercicio", estado`;

const PREGUNTA_COLUMNAS = `id, semana_id AS "semanaId", tipo, pregunta, opciones, correcta, explicacion, falencia`;

function mezclar<T>(items: T[]): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function calcularEstado(examen: any): string {
  if (examen.estado === 'cancelado') return 'cancelado';
  const ahora = Date.now();
  const inicio = new Date(examen.fechaInicio).getTime();
  const fin = new Date(examen.fechaFin).getTime();
  if (ahora < inicio) return 'proximo';
  if (ahora > fin) return 'finalizado';
  return 'activo';
}

@Controller('examenes-programados')
export class ExamenesProgramadosController implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(
        `CREATE TABLE IF NOT EXISTS examenes_programados (
          id SERIAL PRIMARY KEY,
          materia_id INT NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
          docente_id INT NOT NULL REFERENCES usuarios(id),
          titulo VARCHAR(150) NOT NULL,
          fecha_inicio TIMESTAMP NOT NULL,
          fecha_fin TIMESTAMP NOT NULL,
          duracion_min INT NOT NULL DEFAULT 15,
          cantidad_teoria INT NOT NULL DEFAULT 0,
          cantidad_ejercicio INT NOT NULL DEFAULT 0,
          estado VARCHAR(20) NOT NULL DEFAULT 'programado',
          creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`,
      );
      await this.db.query(
        `CREATE TABLE IF NOT EXISTS examenes_programados_semanas (
          id SERIAL PRIMARY KEY,
          examen_id INT NOT NULL REFERENCES examenes_programados(id) ON DELETE CASCADE,
          semana_id INT NOT NULL REFERENCES semanas(id) ON DELETE CASCADE,
          UNIQUE (examen_id, semana_id)
        );`,
      );
      await this.db.query(
        `ALTER TABLE intentos_examen ADD COLUMN IF NOT EXISTS examen_programado_id INT REFERENCES examenes_programados(id) ON DELETE CASCADE;`,
      );
      await this.db.query(`ALTER TABLE intentos_examen ALTER COLUMN semana_id DROP NOT NULL;`);
      await this.db.query(
        `ALTER TABLE intentos_examen ADD COLUMN IF NOT EXISTS infracciones JSONB NOT NULL DEFAULT '[]';`,
      );
    } catch (err) {
      console.error('Error al inicializar tablas de examenes_programados en PostgreSQL:', err);
    }
  }

  // SUPERUSUARIO: acceso total. DOCENTE: solo materias propias. ESTUDIANTE: solo materias donde
  // tiene inscripción — mismo criterio de "quién puede ver qué" que ya usa MateriasController.
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

  private async obtenerExamenOFallar(examenId: number) {
    const { rows } = await this.db.query(
      `SELECT ${COLUMNAS_EXAMEN} FROM examenes_programados e WHERE e.id = $1`,
      [examenId],
    );
    if (!rows[0]) throw new NotFoundException('Examen programado no encontrado');
    return rows[0];
  }

  private async adjuntarSemanas<T extends { id: number }>(examenes: T[]): Promise<(T & { semanas: any[] })[]> {
    if (examenes.length === 0) return [];
    const ids = examenes.map((e) => e.id);
    const { rows } = await this.db.query(
      `SELECT eps.examen_id AS "examenId", s.id, s.numero, s.unidad_nombre AS "unidadNombre"
       FROM examenes_programados_semanas eps
       JOIN semanas s ON s.id = eps.semana_id
       WHERE eps.examen_id = ANY($1)
       ORDER BY s.numero`,
      [ids],
    );
    return examenes.map((examen) => ({
      ...examen,
      semanas: rows.filter((r: any) => r.examenId === examen.id).map(({ id, numero, unidadNombre }: any) => ({ id, numero, unidadNombre })),
    }));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async crear(@Body() body: any, @Req() req: any) {
    const materiaId = parseInt(body?.materiaId, 10);
    const titulo = (body?.titulo || '').trim();
    const semanaIds: number[] = Array.isArray(body?.semanaIds) ? body.semanaIds.map((n: any) => parseInt(n, 10)) : [];
    const fechaInicio = new Date(body?.fechaInicio);
    const fechaFin = new Date(body?.fechaFin);
    const duracionMin = Number.isFinite(body?.duracionMin) ? body.duracionMin : 15;
    const cantidadTeoria = Number.isFinite(body?.cantidadTeoria) ? body.cantidadTeoria : 0;
    const cantidadEjercicio = Number.isFinite(body?.cantidadEjercicio) ? body.cantidadEjercicio : 0;

    if (!materiaId) throw new BadRequestException('materiaId es requerido');
    if (!titulo) throw new BadRequestException('El título del examen es requerido');
    if (semanaIds.length === 0) throw new BadRequestException('Debes seleccionar al menos una semana/tema');
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime()) || fechaFin <= fechaInicio) {
      throw new BadRequestException('fechaInicio y fechaFin son requeridas, y fechaFin debe ser posterior a fechaInicio');
    }
    if (cantidadTeoria + cantidadEjercicio <= 0) {
      throw new BadRequestException('Debes configurar al menos una pregunta (teoría o ejercicio)');
    }

    await this.verificarAccesoMateria(materiaId, req);

    const { rows: semanasValidas } = await this.db.query(
      `SELECT id FROM semanas WHERE materia_id = $1 AND id = ANY($2)`,
      [materiaId, semanaIds],
    );
    if (semanasValidas.length !== semanaIds.length) {
      throw new BadRequestException('Alguna de las semanas seleccionadas no pertenece a la materia indicada');
    }

    const { rows: disponibles } = await this.db.query(
      `SELECT tipo, COUNT(*)::int AS cantidad FROM preguntas WHERE semana_id = ANY($1) GROUP BY tipo`,
      [semanaIds],
    );
    const disponibleTeoria = disponibles.find((r: any) => r.tipo === 'teoria')?.cantidad || 0;
    const disponibleEjercicio = disponibles.find((r: any) => r.tipo === 'ejercicio')?.cantidad || 0;
    if (disponibleTeoria < cantidadTeoria || disponibleEjercicio < cantidadEjercicio) {
      throw new BadRequestException({
        error: 'PREGUNTAS_INSUFICIENTES',
        mensaje: 'No hay suficientes preguntas del banco para la cantidad solicitada',
        disponibles: { teoria: disponibleTeoria, ejercicio: disponibleEjercicio },
      });
    }

    const { rows } = await this.db.query(
      `INSERT INTO examenes_programados
         (materia_id, docente_id, titulo, fecha_inicio, fecha_fin, duracion_min, cantidad_teoria, cantidad_ejercicio)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING ${COLUMNAS_EXAMEN_RETURNING}`,
      [materiaId, req.user.id, titulo, fechaInicio, fechaFin, duracionMin, cantidadTeoria, cantidadEjercicio],
    );
    const examen = rows[0];

    for (const semanaId of semanaIds) {
      await this.db.query(
        `INSERT INTO examenes_programados_semanas (examen_id, semana_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [examen.id, semanaId],
      );
    }

    const [conSemanas] = await this.adjuntarSemanas([examen]);
    return { status: 'ok', mensaje: 'Examen programado creado exitosamente', examen: { ...conSemanas, estadoCalculado: calcularEstado(examen) } };
  }

  @Get('materia/:materiaId')
  @UseGuards(JwtAuthGuard)
  async listarPorMateria(@Param('materiaId', ParseIntPipe) materiaId: number, @Req() req: any) {
    await this.verificarAccesoMateria(materiaId, req);
    const { rows } = await this.db.query(
      `SELECT ${COLUMNAS_EXAMEN} FROM examenes_programados e WHERE e.materia_id = $1 ORDER BY e.fecha_inicio`,
      [materiaId],
    );
    const conSemanas = await this.adjuntarSemanas(rows);
    return conSemanas.map((examen) => ({ ...examen, estadoCalculado: calcularEstado(examen) }));
  }

  @Get('estudiante/mis-examenes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ESTUDIANTE')
  async listarParaEstudiante(@Req() req: any) {
    const { rows } = await this.db.query(
      `SELECT ${COLUMNAS_EXAMEN}, m.nombre AS "materiaNombre"
       FROM examenes_programados e
       JOIN inscripciones i ON i.materia_id = e.materia_id AND i.estudiante_id = $1
       JOIN materias m ON m.id = e.materia_id
       WHERE e.estado != 'cancelado'
       ORDER BY e.fecha_inicio`,
      [req.user.id],
    );
    const conSemanas = await this.adjuntarSemanas(rows);
    return conSemanas.map((examen) => ({ ...examen, estadoCalculado: calcularEstado(examen) }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async obtenerUno(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const examen = await this.obtenerExamenOFallar(id);
    await this.verificarAccesoMateria(examen.materiaId, req);
    const [conSemanas] = await this.adjuntarSemanas([examen]);
    return { ...conSemanas, estadoCalculado: calcularEstado(examen) };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async editar(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    const examen = await this.obtenerExamenOFallar(id);
    await this.verificarAccesoMateria(examen.materiaId, req);

    const { rows: intentos } = await this.db.query(
      `SELECT 1 FROM intentos_examen WHERE examen_programado_id = $1 LIMIT 1`,
      [id],
    );
    if (intentos.length > 0) {
      throw new ConflictException('No se puede editar: ya hay estudiantes que presentaron este examen');
    }

    const titulo = body?.titulo !== undefined ? String(body.titulo).trim() : examen.titulo;
    const fechaInicio = body?.fechaInicio !== undefined ? new Date(body.fechaInicio) : new Date(examen.fechaInicio);
    const fechaFin = body?.fechaFin !== undefined ? new Date(body.fechaFin) : new Date(examen.fechaFin);
    const duracionMin = Number.isFinite(body?.duracionMin) ? body.duracionMin : examen.duracionMin;
    const cantidadTeoria = Number.isFinite(body?.cantidadTeoria) ? body.cantidadTeoria : examen.cantidadTeoria;
    const cantidadEjercicio = Number.isFinite(body?.cantidadEjercicio) ? body.cantidadEjercicio : examen.cantidadEjercicio;
    if (!titulo) throw new BadRequestException('El título del examen es requerido');
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime()) || fechaFin <= fechaInicio) {
      throw new BadRequestException('fechaFin debe ser posterior a fechaInicio');
    }

    const { rows } = await this.db.query(
      `UPDATE examenes_programados
       SET titulo=$2, fecha_inicio=$3, fecha_fin=$4, duracion_min=$5, cantidad_teoria=$6, cantidad_ejercicio=$7
       WHERE id=$1 RETURNING ${COLUMNAS_EXAMEN_RETURNING}`,
      [id, titulo, fechaInicio, fechaFin, duracionMin, cantidadTeoria, cantidadEjercicio],
    );

    if (Array.isArray(body?.semanaIds) && body.semanaIds.length > 0) {
      const semanaIds = body.semanaIds.map((n: any) => parseInt(n, 10));
      const { rows: semanasValidas } = await this.db.query(
        `SELECT id FROM semanas WHERE materia_id = $1 AND id = ANY($2)`,
        [examen.materiaId, semanaIds],
      );
      if (semanasValidas.length !== semanaIds.length) {
        throw new BadRequestException('Alguna de las semanas seleccionadas no pertenece a la materia indicada');
      }
      await this.db.query(`DELETE FROM examenes_programados_semanas WHERE examen_id = $1`, [id]);
      for (const semanaId of semanaIds) {
        await this.db.query(
          `INSERT INTO examenes_programados_semanas (examen_id, semana_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [id, semanaId],
        );
      }
    }

    const [conSemanas] = await this.adjuntarSemanas([rows[0]]);
    return { status: 'ok', mensaje: 'Examen programado actualizado', examen: { ...conSemanas, estadoCalculado: calcularEstado(rows[0]) } };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async eliminar(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const examen = await this.obtenerExamenOFallar(id);
    await this.verificarAccesoMateria(examen.materiaId, req);

    const { rows: intentos } = await this.db.query(
      `SELECT 1 FROM intentos_examen WHERE examen_programado_id = $1 LIMIT 1`,
      [id],
    );
    if (intentos.length === 0) {
      await this.db.query(`DELETE FROM examenes_programados WHERE id = $1`, [id]);
      return { ok: true, mensaje: 'Examen programado eliminado' };
    }
    await this.db.query(`UPDATE examenes_programados SET estado = 'cancelado' WHERE id = $1`, [id]);
    return { ok: true, mensaje: 'El examen ya tiene intentos registrados: se marcó como cancelado en vez de borrarlo' };
  }

  @Get(':id/preguntas')
  @UseGuards(JwtAuthGuard)
  async obtenerPreguntas(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const examen = await this.obtenerExamenOFallar(id);
    await this.verificarAccesoMateria(examen.materiaId, req);

    const estadoCalculado = calcularEstado(examen);
    if (estadoCalculado !== 'activo') {
      throw new ForbiddenException({
        error: 'FUERA_DE_VENTANA',
        mensaje: 'Este examen no está disponible en este momento',
        fechaInicio: examen.fechaInicio,
        fechaFin: examen.fechaFin,
      });
    }

    const { rows: semanaRows } = await this.db.query(
      `SELECT semana_id AS "semanaId" FROM examenes_programados_semanas WHERE examen_id = $1`,
      [id],
    );
    const semanaIds = semanaRows.map((r: any) => r.semanaId);

    const { rows: teoria } = await this.db.query(
      `SELECT ${PREGUNTA_COLUMNAS} FROM preguntas WHERE semana_id = ANY($1) AND tipo = 'teoria' ORDER BY RANDOM() LIMIT $2`,
      [semanaIds, examen.cantidadTeoria],
    );
    const { rows: ejercicio } = await this.db.query(
      `SELECT ${PREGUNTA_COLUMNAS} FROM preguntas WHERE semana_id = ANY($1) AND tipo = 'ejercicio' ORDER BY RANDOM() LIMIT $2`,
      [semanaIds, examen.cantidadEjercicio],
    );

    return {
      examenId: examen.id,
      titulo: examen.titulo,
      duracionMin: examen.duracionMin,
      fechaFin: examen.fechaFin,
      preguntas: mezclar([...teoria, ...ejercicio]),
    };
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  async submit(@Param('id', ParseIntPipe) id: number, @Body() body: any, @Req() req: any) {
    const examen = await this.obtenerExamenOFallar(id);
    await this.verificarAccesoMateria(examen.materiaId, req);

    const ahora = Date.now();
    const inicio = new Date(examen.fechaInicio).getTime();
    const finConGracia = new Date(examen.fechaFin).getTime() + MINUTOS_GRACIA_SUBMIT * 60 * 1000;
    if (ahora < inicio || ahora > finConGracia) {
      throw new ForbiddenException({ error: 'FUERA_DE_VENTANA', mensaje: 'La ventana de este examen ya no está disponible' });
    }

    const infracciones = Array.isArray(body?.infracciones) ? body.infracciones : [];
    const { rows } = await this.db.query(
      `INSERT INTO intentos_examen
         (estudiante_id, semana_id, examen_programado_id, nota5, porcentaje, aprobado, infraccion_ia, infracciones, tiempo_empleado_seg, respuestas)
       VALUES ($1,NULL,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, examen_programado_id AS "examenProgramadoId", nota5, porcentaje, aprobado,
                 infraccion_ia AS "infraccionIA", infracciones, tiempo_empleado_seg AS "tiempoEmpleadoSeg", fecha`,
      [
        req.user.id,
        id,
        body.nota5,
        body.porcentaje,
        body.aprobado,
        infracciones.length > 0 || !!body.infraccionIA,
        JSON.stringify(infracciones),
        body.tiempoEmpleadoSeg,
        JSON.stringify(body.respuestas || {}),
      ],
    );
    return { status: 'ok', mensaje: 'Resultado del examen programado registrado en el servidor', intento: rows[0] };
  }
}
