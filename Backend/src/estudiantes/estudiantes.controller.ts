import {
  Controller, Get, Post, Delete, Body, Query, Param, Req, UseGuards, UseInterceptors,
  UploadedFile, ForbiddenException, BadRequestException, OnModuleInit, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

const REGEX_DOCUMENTO = /^\d{6,15}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BYTES_LISTA = 2 * 1024 * 1024; // 2MB

interface FilaLista {
  linea: number;
  documento: string;
  nombre: string;
  email: string;
}

function parsearLista(texto: string): { filas: FilaLista[]; errores: string[] } {
  const filas: FilaLista[] = [];
  const errores: string[] = [];

  const lineas = texto.split(/\r?\n/);
  lineas.forEach((raw, idx) => {
    let linea = raw.trim();
    if (!linea) return;

    // Ignorar encabezados de markdown o guías de formato
    if (
      linea.startsWith('#') ||
      linea.startsWith('<!--') ||
      linea.toLowerCase().includes('cédula') ||
      linea.toLowerCase().includes('cedula') ||
      linea.toLowerCase().includes('documento')
    ) {
      return;
    }

    // Quitar prefijos numéricos de listas (ej. "1.", "1)", "- ")
    linea = linea.replace(/^(\d+[\.\)]|\-|\*)\s*/, '');

    // Intentar split por tabulación primero
    let campos = linea.split('\t').map((c) => c.trim().replace(/^["']|["']$/g, '')).filter(Boolean);

    if (campos.length < 3) {
      // Regex flexible: Busca cédula (secuencia de dígitos), correo (x@y.z) y lo que esté entre ambos es el nombre
      const match = linea.match(/(\d{5,15})\s+([^\n@]+?)\s+([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (match) {
        campos = [match[1].trim(), match[2].trim(), match[3].trim()];
      } else {
        // Intentar split por comas o punto y coma
        const subCampos = linea.split(/[,;]/).map((c) => c.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
        if (subCampos.length >= 3) {
          campos = subCampos;
        }
      }
    }

    if (campos.length < 3) {
      errores.push(`Línea ${idx + 1}: No se identificaron 3 campos (cédula, nombre, correo)`);
      return;
    }

    const documento = campos[0];
    const nombre = campos[1];
    const email = campos[2];

    if (!REGEX_EMAIL.test(email)) {
      errores.push(`Línea ${idx + 1}: correo electrónico inválido ("${email}")`);
      return;
    }

    filas.push({
      linea: idx + 1,
      documento: documento || '12345678',
      nombre: nombre || 'Estudiante',
      email: email.toLowerCase(),
    });
  });

  return { filas, errores };
}

@Controller('estudiantes')
export class EstudiantesController implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      await this.db.query(
        `ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS documento_identidad VARCHAR(20);`,
      );
      await this.db.query(
        `CREATE UNIQUE INDEX IF NOT EXISTS usuarios_documento_identidad_key
         ON usuarios (documento_identidad) WHERE documento_identidad IS NOT NULL;`,
      );
      await this.db.query(
        `CREATE TABLE IF NOT EXISTS inscripciones (
          id SERIAL PRIMARY KEY,
          materia_id INT NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
          estudiante_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (materia_id, estudiante_id)
        );`,
      );
    } catch (err) {
      console.error('Error al inicializar tabla inscripciones en PostgreSQL:', err);
    }
  }

  private async verificarPropiedadMateria(materiaId: number, req: any) {
    if (req.user.rol === 'SUPERUSUARIO') return;
    const { rows } = await this.db.query(
      `SELECT docente_id AS "docenteId" FROM materias WHERE id = $1`,
      [materiaId],
    );
    if (!rows[0] || rows[0].docenteId !== req.user.id) {
      throw new ForbiddenException('No administras esta materia');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE', 'SUPERUSUARIO')
  async listar(@Query('materiaId') materiaId: string, @Req() req: any) {
    const mid = parseInt(materiaId, 10);
    if (!mid) throw new BadRequestException('materiaId requerido');
    await this.verificarPropiedadMateria(mid, req);

    const { rows } = await this.db.query(
      `SELECT u.id, u.nombre, u.email, u.documento_identidad AS "documentoIdentidad", i.creada_en AS "inscritoEn"
       FROM inscripciones i
       JOIN usuarios u ON u.id = i.estudiante_id
       WHERE i.materia_id = $1
       ORDER BY u.nombre`,
      [mid],
    );
    return rows;
  }

  @Post('inscribir')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE', 'SUPERUSUARIO')
  async inscribir(
    @Body() body: { materiaId: number; estudianteId?: number; email?: string },
    @Req() req: any,
  ) {
    const mid = Number(body?.materiaId);
    if (!mid) throw new BadRequestException('materiaId es requerido');
    await this.verificarPropiedadMateria(mid, req);

    let estId = body?.estudianteId ? Number(body.estudianteId) : null;
    if (!estId && body?.email) {
      const emailNorm = body.email.trim().toLowerCase();
      const { rows } = await this.db.query('SELECT id FROM usuarios WHERE LOWER(email) = $1', [emailNorm]);
      if (!rows[0]) throw new BadRequestException(`No existe usuario registrado con el correo ${body.email}`);
      estId = rows[0].id;
    }

    if (!estId) throw new BadRequestException('Se requiere estudianteId o correo registrado');

    await this.db.query(
      `INSERT INTO inscripciones (materia_id, estudiante_id)
       VALUES ($1, $2)
       ON CONFLICT (materia_id, estudiante_id) DO NOTHING`,
      [mid, estId],
    );

    return { ok: true, mensaje: 'Estudiante matriculado exitosamente' };
  }

  @Delete('inscripciones/:materiaId/:estudianteId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE', 'SUPERUSUARIO')
  async eliminarInscripcion(
    @Param('materiaId', ParseIntPipe) materiaId: number,
    @Param('estudianteId', ParseIntPipe) estudianteId: number,
    @Req() req: any,
  ) {
    await this.verificarPropiedadMateria(materiaId, req);
    const { rowCount } = await this.db.query(
      'DELETE FROM inscripciones WHERE materia_id = $1 AND estudiante_id = $2',
      [materiaId, estudianteId],
    );
    if (rowCount === 0) throw new BadRequestException('Inscripción no encontrada');
    return { ok: true, mensaje: 'Matrícula eliminada' };
  }

  @Post('carga-masiva')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE', 'SUPERUSUARIO')
  @UseInterceptors(FileInterceptor('archivo', {
    storage: memoryStorage(),
    limits: { fileSize: MAX_BYTES_LISTA },
  }))
  async cargaMasiva(
    @Body() body: { materiaId?: string; texto?: string },
    @UploadedFile() archivo: Express.Multer.File,
    @Req() req: any,
  ) {
    const materiaId = parseInt(String(body?.materiaId), 10);
    if (!materiaId) throw new BadRequestException('materiaId requerido');
    await this.verificarPropiedadMateria(materiaId, req);

    const textoFuente = archivo ? archivo.buffer.toString('utf8') : (body?.texto || '');
    if (!textoFuente.trim()) {
      throw new BadRequestException('No se recibió archivo ni texto con la lista de estudiantes');
    }

    const { filas, errores } = parsearLista(textoFuente);

    let creados = 0;
    let yaExistian = 0;
    let inscritos = 0;

    for (const fila of filas) {
      try {
        const { rows: nuevos } = await this.db.query(
          `INSERT INTO usuarios (nombre, email, password_hash, rol, documento_identidad)
           VALUES ($1, $2, $3, 'ESTUDIANTE', $4)
           ON CONFLICT (email) DO NOTHING
           RETURNING id`,
          [fila.nombre, fila.email, await bcrypt.hash(fila.documento, 10), fila.documento],
        );

        let estudianteId: number;
        if (nuevos[0]) {
          estudianteId = nuevos[0].id;
          creados += 1;
        } else {
          const { rows: existentes } = await this.db.query(
            `SELECT id FROM usuarios WHERE email = $1`,
            [fila.email],
          );
          estudianteId = existentes[0].id;
          yaExistian += 1;
        }

        await this.db.query(
          `INSERT INTO inscripciones (materia_id, estudiante_id)
           VALUES ($1, $2)
           ON CONFLICT (materia_id, estudiante_id) DO NOTHING`,
          [materiaId, estudianteId],
        );
        // La inscripción queda garantizada tanto si se insertó ahora como si ya existía
        // (idempotencia): "inscritos" cuenta el total con matrícula confirmada, no solo lo nuevo.
        inscritos += 1;
      } catch (err: any) {
        errores.push(`Línea ${fila.linea}: error al procesar "${fila.email}" (${err.message || err})`);
      }
    }

    return {
      ok: true,
      total: filas.length,
      creados,
      yaExistian,
      inscritos,
      errores,
    };
  }
}
