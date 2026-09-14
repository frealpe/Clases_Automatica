import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const PREGUNTA_COLUMNAS = `id, semana_id AS "semanaId", tipo, pregunta, opciones, correcta, explicacion, falencia`;
// Columnas SIN la respuesta correcta ni la explicación/falencia: es lo único que se le entrega
// al estudiante al presentar el examen. La calificación y la revisión se resuelven en el
// servidor al enviar el intento (POST /evaluaciones/submit).
const PREGUNTA_COLUMNAS_EXAMEN = `id, semana_id AS "semanaId", tipo, pregunta, opciones`;

@Controller('preguntas')
export class PreguntasController {
  constructor(private readonly db: DatabaseService) {}

  // Banco completo de una semana (incluye la respuesta correcta): solo para el DOCENTE que
  // administra las preguntas, nunca para el estudiante.
  @Get('semana/:semanaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async obtenerPorSemana(@Param('semanaId', ParseIntPipe) semanaId: number) {
    const { rows } = await this.db.query(
      `SELECT ${PREGUNTA_COLUMNAS} FROM preguntas WHERE semana_id = $1 ORDER BY id`,
      [semanaId],
    );
    return rows;
  }

  // API REST para que el estudiante presente el examen web: si la semana tiene configurado
  // un número de preguntas aleatorias (preguntas_examen_count), se sortea ese subconjunto del
  // banco en un orden distinto en cada intento; si no, se presentan todas las preguntas de la
  // semana (también en orden aleatorio).
  @Get('semana/:semanaId/examen')
  async obtenerExamenAleatorio(@Param('semanaId', ParseIntPipe) semanaId: number) {
    const { rows: semanaRows } = await this.db.query(
      `SELECT preguntas_examen_count AS "preguntasExamenCount", tipo_examen AS "tipoExamen" FROM semanas WHERE id = $1`,
      [semanaId],
    );
    const cantidad: number | null = semanaRows[0]?.preguntasExamenCount ?? null;
    const tipoExamen: string = semanaRows[0]?.tipoExamen ?? 'combinada';

    let query = `SELECT ${PREGUNTA_COLUMNAS_EXAMEN} FROM preguntas WHERE semana_id = $1`;
    const params: any[] = [semanaId];

    if (tipoExamen === 'teoria') {
      query += ` AND tipo = 'teoria'`;
    } else if (tipoExamen === 'ejercicio') {
      query += ` AND tipo = 'ejercicio'`;
    }

    query += ` ORDER BY RANDOM()`;

    if (cantidad) {
      params.push(cantidad);
      query += ` LIMIT $2`;
    }

    const { rows } = await this.db.query(query, params);
    return rows;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async crearPregunta(@Body() body: any) {
    const id = `s${String(body.semanaId).padStart(2, '0')}_p${Date.now()}`;
    const { rows } = await this.db.query(
      `INSERT INTO preguntas (id, semana_id, tipo, pregunta, opciones, correcta, explicacion, falencia)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${PREGUNTA_COLUMNAS}`,
      [id, body.semanaId, body.tipo, body.pregunta, JSON.stringify(body.opciones), body.correcta, body.explicacion, body.falencia],
    );
    return { status: 'ok', mensaje: 'Pregunta agregada exitosamente por el Docente', pregunta: rows[0] };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async actualizarPregunta(@Param('id') id: string, @Body() body: any) {
    const { rows } = await this.db.query(
      `UPDATE preguntas SET tipo=$2, pregunta=$3, opciones=$4, correcta=$5, explicacion=$6, falencia=$7
       WHERE id = $1 RETURNING ${PREGUNTA_COLUMNAS}`,
      [id, body.tipo, body.pregunta, JSON.stringify(body.opciones), body.correcta, body.explicacion, body.falencia],
    );
    return { status: 'ok', mensaje: 'Pregunta actualizada exitosamente', pregunta: rows[0] };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async eliminarPregunta(@Param('id') id: string) {
    await this.db.query('DELETE FROM preguntas WHERE id = $1', [id]);
    return { status: 'ok', mensaje: 'Pregunta eliminada exitosamente' };
  }
}
