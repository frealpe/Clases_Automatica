import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const PREGUNTA_COLUMNAS = `id, semana_id AS "semanaId", tipo, pregunta, opciones, correcta, explicacion, falencia`;

@Controller('preguntas')
export class PreguntasController {
  constructor(private readonly db: DatabaseService) {}

  @Get('semana/:semanaId')
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
      `SELECT preguntas_examen_count AS "preguntasExamenCount" FROM semanas WHERE id = $1`,
      [semanaId],
    );
    const cantidad: number | null = semanaRows[0]?.preguntasExamenCount ?? null;

    const { rows } = await this.db.query(
      cantidad
        ? `SELECT ${PREGUNTA_COLUMNAS} FROM preguntas WHERE semana_id = $1 ORDER BY RANDOM() LIMIT $2`
        : `SELECT ${PREGUNTA_COLUMNAS} FROM preguntas WHERE semana_id = $1 ORDER BY RANDOM()`,
      cantidad ? [semanaId, cantidad] : [semanaId],
    );
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
