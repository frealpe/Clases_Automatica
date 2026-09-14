import { Controller, Get, Post, Body, Req, UseGuards, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('visitas')
export class VisitasController implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(`
        CREATE TABLE IF NOT EXISTS contador_visitas (
          id INT PRIMARY KEY DEFAULT 1,
          vistas_totales BIGINT DEFAULT 0,
          visitantes_unicos BIGINT DEFAULT 0,
          ultima_visita TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await this.db.query(`
        INSERT INTO contador_visitas (id, vistas_totales, visitantes_unicos)
        VALUES (1, 1420, 315)
        ON CONFLICT (id) DO NOTHING;
      `);

      await this.db.query(`
        CREATE TABLE IF NOT EXISTS actividad_estudiantes (
          id SERIAL PRIMARY KEY,
          usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
          materia_id INT,
          semana_id INT,
          accion VARCHAR(100) DEFAULT 'vista_plataforma',
          creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (err) {
      console.error('Error al inicializar las tablas de visitas y actividad:', err);
    }
  }

  @Get('stats')
  async obtenerStats() {
    const { rows } = await this.db.query(
      `SELECT vistas_totales AS "vistasTotales", visitantes_unicos AS "visitantesUnicos", ultima_visita AS "ultimaVisita"
       FROM contador_visitas WHERE id = 1`,
    );
    if (rows.length === 0) {
      return { ok: true, vistasTotales: 1420, visitantesUnicos: 315, ultimaVisita: new Date() };
    }
    return { ok: true, ...rows[0] };
  }

  @Post('registrar')
  async registrarVisita(@Body() body: { esNuevoVisitante?: boolean }) {
    const esNuevo = !!body?.esNuevoVisitante;
    const { rows } = await this.db.query(
      `UPDATE contador_visitas
       SET vistas_totales = vistas_totales + 1,
           visitantes_unicos = visitantes_unicos + (CASE WHEN $1::boolean THEN 1 ELSE 0 END),
           ultima_visita = CURRENT_TIMESTAMP
       WHERE id = 1
       RETURNING vistas_totales AS "vistasTotales", visitantes_unicos AS "visitantesUnicos", ultima_visita AS "ultimaVisita"`,
      [esNuevo],
    );
    if (rows.length === 0) {
      return { ok: true, vistasTotales: 1421, visitantesUnicos: 315, ultimaVisita: new Date() };
    }
    return { ok: true, ...rows[0] };
  }

  @Post('registrar-actividad')
  @UseGuards(JwtAuthGuard)
  async registrarActividad(
    @Req() req: any,
    @Body() body: { materiaId?: number; semanaId?: number; accion?: string },
  ) {
    const usuarioId = req.user?.id;
    if (!usuarioId) return { ok: false, error: 'Usuario no autenticado' };

    const materiaId = body?.materiaId || null;
    const semanaId  = body?.semanaId || null;
    const accion    = body?.accion || 'vista_plataforma';

    await this.db.query(
      `INSERT INTO actividad_estudiantes (usuario_id, materia_id, semana_id, accion)
       VALUES ($1, $2, $3, $4)`,
      [usuarioId, materiaId, semanaId, accion],
    );

    // Incrementar también el contador global de vistas
    await this.db.query(
      `UPDATE contador_visitas
       SET vistas_totales = vistas_totales + 1,
           ultima_visita = CURRENT_TIMESTAMP
       WHERE id = 1`,
    );

    return { ok: true };
  }

  @Get('ranking-estudiantes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERUSUARIO', 'DOCENTE')
  async obtenerRankingEstudiantes() {
    const { rows } = await this.db.query(
      `SELECT 
         u.id, 
         u.nombre, 
         u.email, 
         u.documento_identidad AS "codigoEstudiantil",
         u.rol,
         COUNT(a.id)::int AS "totalVistas",
         MAX(a.creado_en) AS "ultimaActividad"
       FROM usuarios u
       LEFT JOIN actividad_estudiantes a ON a.usuario_id = u.id
       WHERE u.rol = 'ESTUDIANTE'
       GROUP BY u.id, u.nombre, u.email, u.documento_identidad, u.rol
       ORDER BY "totalVistas" DESC, "ultimaActividad" DESC NULLS LAST, u.nombre ASC`,
    );

    const { rows: statsGlobales } = await this.db.query(
      `SELECT vistas_totales AS "vistasTotales", visitantes_unicos AS "visitantesUnicos"
       FROM contador_visitas WHERE id = 1`,
    );

    return {
      ok: true,
      estudiantes: rows,
      totalAlumnos: rows.length,
      vistasTotales: statsGlobales[0]?.vistasTotales || 0,
      visitantesUnicos: statsGlobales[0]?.visitantesUnicos || 0,
    };
  }
}
