import { BadRequestException, Controller, Get, Post, Body, Req, UseGuards, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const MAX_SEMANAS_NUEVA_MATERIA = 32;

@Controller('materias')
export class MateriasController implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(
        `ALTER TABLE materias ADD COLUMN IF NOT EXISTS numero_semanas INT NOT NULL DEFAULT 16;`,
      );
    } catch (err) {
      console.error('Error al inicializar la columna numero_semanas en PostgreSQL:', err);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async obtenerTodas(@Req() req: any) {
    const COLUMNAS = `id, codigo, nombre, descripcion, semestre, docente_id AS "docenteId",
      numero_semanas AS "numeroSemanas"`;

    if (req.user.rol === 'SUPERUSUARIO') {
      const { rows } = await this.db.query(`SELECT ${COLUMNAS} FROM materias ORDER BY id`);
      return rows;
    }

    if (req.user.rol === 'DOCENTE') {
      const { rows } = await this.db.query(
        `SELECT ${COLUMNAS} FROM materias WHERE docente_id = $1 ORDER BY id`,
        [req.user.id],
      );
      return rows;
    }

    // ESTUDIANTE: solo materias donde tiene una inscripción registrada.
    const { rows } = await this.db.query(
      `SELECT m.id, m.codigo, m.nombre, m.descripcion, m.semestre, m.docente_id AS "docenteId",
              m.numero_semanas AS "numeroSemanas"
       FROM materias m
       JOIN inscripciones i ON i.materia_id = m.id
       WHERE i.estudiante_id = $1
       ORDER BY m.id`,
      [req.user.id],
    );
    return rows;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async crearMateria(@Body() body: any, @Req() req: any) {
    const codigo = body.codigo || `MAT-${Date.now()}`;
    const numeroSemanas = Math.min(
      Math.max(parseInt(body.numeroSemanas, 10) || 16, 1),
      MAX_SEMANAS_NUEVA_MATERIA,
    );

    // Un SUPERUSUARIO administra y crea materias, pero no debe quedar como su dueño/docente:
    // tiene que indicar explícitamente a qué DOCENTE se le asigna.
    let docenteId = req.user.id;
    if (req.user.rol === 'SUPERUSUARIO') {
      const docenteIdBody = parseInt(body.docenteId, 10);
      if (!docenteIdBody) {
        throw new BadRequestException('Debes indicar el docente responsable de la materia');
      }
      const { rows: docenteRows } = await this.db.query(
        `SELECT id FROM usuarios WHERE id = $1 AND rol = 'DOCENTE'`,
        [docenteIdBody],
      );
      if (docenteRows.length === 0) {
        throw new BadRequestException('El responsable de la materia debe ser un usuario con rol DOCENTE');
      }
      docenteId = docenteIdBody;
    }

    const { rows } = await this.db.query(
      `INSERT INTO materias (codigo, nombre, descripcion, semestre, docente_id, numero_semanas)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id, codigo, nombre, descripcion, semestre, numero_semanas AS "numeroSemanas"`,
      [codigo, body.nombre, body.descripcion || 'Materia de Ingeniería', body.semestre || '2026-1', docenteId, numeroSemanas],
    );
    const materia = rows[0];

    // Generar automáticamente las N semanas/sesiones de la materia recién creada
    for (let n = 1; n <= numeroSemanas; n++) {
      const numero = String(n).padStart(2, '0');
      await this.db.query(
        `INSERT INTO semanas (materia_id, numero, unidad_nombre, capitulo_grossman, ra, ra_descripcion, objetivos_json, duracion_examen_min)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          materia.id,
          numero,
          `Sesión ${numero} — Tema pendiente de definir`,
          '',
          `RA${n}`,
          'Objetivo de aprendizaje pendiente de definir.',
          JSON.stringify([{ ra: `RA${n}`, descripcion: 'Objetivo de aprendizaje pendiente de definir.' }]),
          15,
        ],
      );
    }

    return { status: 'ok', mensaje: 'Materia registrada exitosamente en PostgreSQL', materia };
  }
}
