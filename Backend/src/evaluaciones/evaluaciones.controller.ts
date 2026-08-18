import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('evaluaciones')
export class EvaluacionesController {
  constructor(private readonly db: DatabaseService) {}

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  async registrarIntento(@Body() body: any, @Req() req: any) {
    const { rows } = await this.db.query(
      `INSERT INTO intentos_examen
         (estudiante_id, semana_id, nota5, porcentaje, aprobado, infraccion_ia, tiempo_empleado_seg, respuestas)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, estudiante_id AS "estudianteId", semana_id AS "semanaId", nota5, porcentaje, aprobado,
                 infraccion_ia AS "infraccionIA", tiempo_empleado_seg AS "tiempoEmpleadoSeg", fecha`,
      [
        req.user.id,
        body.semanaId,
        body.nota5,
        body.porcentaje,
        body.aprobado,
        body.infraccionIA || false,
        body.tiempoEmpleadoSeg,
        JSON.stringify(body.respuestas || []),
      ],
    );
    return { status: 'ok', mensaje: 'Resultado registrado en el servidor PostgreSQL', intento: rows[0] };
  }

  @Get('docente/reportes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async obtenerReporteDocente() {
    const { rows } = await this.db.query(
      `SELECT i.id, u.nombre AS "estudianteNombre", s.numero AS "semanaNumero", i.nota5, i.porcentaje,
              i.aprobado, i.infraccion_ia AS "infraccionIA", i.tiempo_empleado_seg AS "tiempoEmpleadoSeg", i.fecha,
              CASE WHEN i.examen_programado_id IS NOT NULL THEN 'programado' ELSE 'semana' END AS "origen",
              ep.titulo AS "tituloExamen"
       FROM intentos_examen i
       JOIN usuarios u ON u.id = i.estudiante_id
       LEFT JOIN semanas s ON s.id = i.semana_id
       LEFT JOIN examenes_programados ep ON ep.id = i.examen_programado_id
       ORDER BY i.fecha DESC`,
    );

    const totalEvaluaciones = rows.length;
    const aprobadosCount = rows.filter((r: any) => r.aprobado).length;
    const infraccionesCount = rows.filter((r: any) => r.infraccionIA).length;

    return {
      resumenGrupov: {
        totalEvaluaciones,
        aprobadosCount,
        infraccionesCount,
        tasaAprobacion: Math.round((aprobadosCount / (totalEvaluaciones || 1)) * 100) + '%',
      },
      intentos: rows,
    };
  }
}
