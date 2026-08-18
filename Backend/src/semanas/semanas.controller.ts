import {
  Controller, Get, Put, Post, Patch, Delete, Param, Query, Body,
  UploadedFile, UseInterceptors, BadRequestException, OnModuleInit,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DatabaseService } from '../database/database.service';
import * as fs from 'fs';
import * as path from 'path';
// El proyecto no tiene esModuleInterop: adm-zip se importa con import-equals.
import AdmZip = require('adm-zip');

const CARPETA_UPLOADS = path.join(__dirname, '..', '..', 'uploads');
const MAX_BYTES_PROYECTO = 50 * 1024 * 1024; // 50MB descomprimido
const MAX_ARCHIVOS_PROYECTO = 500;
const MAX_BYTES_PDF = 25 * 1024 * 1024; // 25MB

const COLUMNAS_SEMANA = `id, materia_id AS "materiaId", numero, unidad_nombre AS "unidadNombre",
  capitulo_grossman AS "capituloGrossman", ra, ra_descripcion AS "raDescripcion",
  objetivos_json AS "objetivosJson", duracion_examen_min AS "duracionExamenMin",
  preguntas_examen_count AS "preguntasExamenCount", contenido_json AS "contenidoJson",
  notas_pdf_url AS "notasPdfUrl", guia_pdf_url AS "guiaPdfUrl", diapositivas_pdf_url AS "diapositivasPdfUrl",
  clase_web_url AS "claseWebUrl", ejercicios_resueltos_url AS "ejerciciosResueltosUrl",
  banco_preguntas_url AS "bancoPreguntasUrl"`;

const TIPOS_PDF_COLUMNA: Record<string, string> = {
  notas: 'notas_pdf_url',
  guia: 'guia_pdf_url',
  diapositivas: 'diapositivas_pdf_url',
};

function parseIdOrThrow(id: string): number {
  if (!/^\d+$/.test(id)) throw new BadRequestException('id inválido');
  return parseInt(id, 10);
}

function fileFilterZip(_req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
  const mimetiposValidos = ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'];
  const esZip = mimetiposValidos.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.zip');
  if (!esZip) return callback(new BadRequestException('El archivo debe ser un .zip'), false);
  callback(null, true);
}

function fileFilterPdf(_req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
  const esPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
  if (!esPdf) return callback(new BadRequestException('El archivo debe ser un PDF'), false);
  callback(null, true);
}

// Extrae un .zip de proyecto web (Material Web / Ejercicios Resueltos / Banco de Preguntas) de forma
// segura: valida cantidad de archivos, tamaño total descomprimido y rutas (zip-slip), y localiza
// index.html en la raíz o en la única carpeta contenedora de nivel superior.
function extraerProyectoZip(buffer: Buffer, destino: string): string {
  const zip = new AdmZip(buffer);
  const entradas = zip.getEntries();
  if (entradas.length === 0) throw new BadRequestException('El .zip está vacío');
  if (entradas.length > MAX_ARCHIVOS_PROYECTO) {
    throw new BadRequestException(`El .zip supera el límite de ${MAX_ARCHIVOS_PROYECTO} archivos`);
  }

  let bytesTotales = 0;
  for (const entrada of entradas) {
    bytesTotales += entrada.header.size;
    const rutaDestino = path.resolve(destino, entrada.entryName);
    if (rutaDestino !== destino && !rutaDestino.startsWith(destino + path.sep)) {
      throw new BadRequestException('El .zip contiene rutas inválidas (path traversal)');
    }
  }
  if (bytesTotales > MAX_BYTES_PROYECTO) {
    throw new BadRequestException('El proyecto descomprimido supera el límite de 50MB');
  }

  fs.rmSync(destino, { recursive: true, force: true });
  fs.mkdirSync(destino, { recursive: true });
  zip.extractAllTo(destino, true);

  if (fs.existsSync(path.join(destino, 'index.html'))) {
    return '';
  }
  const items = fs.readdirSync(destino, { withFileTypes: true });
  const carpetas = items.filter((i) => i.isDirectory());
  if (carpetas.length === 1 && fs.existsSync(path.join(destino, carpetas[0].name, 'index.html'))) {
    return carpetas[0].name;
  }

  fs.rmSync(destino, { recursive: true, force: true });
  throw new BadRequestException('El .zip debe incluir index.html en la raíz (o en una única carpeta contenedora)');
}

@Controller('semanas')
export class SemanasController implements OnModuleInit {
  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    try {
      // 1. Asegurar columna contenido_json en PostgreSQL DB
      await this.db.query(`ALTER TABLE semanas ADD COLUMN IF NOT EXISTS contenido_json JSONB;`);

      // 2. Leer las semillas desde los archivos JSON externos (Semana 1, Semana 2, etc.)
      const semillas = [
        { id: 1, archivo: 'semana-01-contenido.json' },
        { id: 2, archivo: 'semana-02-contenido.json' },
      ];

      for (const sem of semillas) {
        const rutaSemilla = path.join(__dirname, '..', 'database', 'seeds', sem.archivo);
        if (fs.existsSync(rutaSemilla)) {
          const contenidoRaw = fs.readFileSync(rutaSemilla, 'utf8');
          await this.db.query(
            `UPDATE semanas SET contenido_json = $1 WHERE id = $2`,
            [contenidoRaw, sem.id]
          );
        }
      }
    } catch (err) {
      console.error('Error al inicializar las semillas JSON de semanas en PostgreSQL:', err);
    }
  }

  @Get()
  async obtenerTodas(@Query('materiaId') materiaId?: string) {
    const mid = materiaId ? parseInt(materiaId, 10) : 1;
    const { rows } = await this.db.query(
      `SELECT ${COLUMNAS_SEMANA} FROM semanas WHERE materia_id = $1 ORDER BY numero`,
      [mid],
    );
    return rows;
  }

  @Get(':id')
  async obtenerUna(@Param('id') id: string) {
    const { rows } = await this.db.query(
      `SELECT ${COLUMNAS_SEMANA} FROM semanas WHERE id = $1`,
      [parseIdOrThrow(id)],
    );
    return rows[0];
  }

  // API REST para guardar/actualizar cualquier JSON de clase en PostgreSQL
  @Put(':id/contenido')
  async guardarContenido(@Param('id') id: string, @Body() body: any) {
    const semanaId = parseIdOrThrow(id);
    const jsonStr = typeof body === 'string' ? body : JSON.stringify(body);
    const { rows } = await this.db.query(
      `UPDATE semanas SET contenido_json = $1 WHERE id = $2 RETURNING ${COLUMNAS_SEMANA}`,
      [jsonStr, semanaId],
    );
    return { ok: true, semana: rows[0] };
  }

  @Post(':id/contenido')
  async guardarContenidoPost(@Param('id') id: string, @Body() body: any) {
    return this.guardarContenido(id, body);
  }

  @Delete(':id/contenido')
  async eliminarContenido(@Param('id') id: string) {
    const semanaId = parseIdOrThrow(id);
    await this.db.query(`UPDATE semanas SET contenido_json = NULL WHERE id = $1`, [semanaId]);
    return { ok: true, mensaje: `Contenido de la semana ${semanaId} eliminado` };
  }

  @Patch(':id/objetivo')
  async actualizarObjetivo(@Param('id') id: string, @Body() body: { objetivos?: any[] }) {
    const semanaId = parseIdOrThrow(id);
    const { rows } = await this.db.query(
      `UPDATE semanas SET objetivos_json = $1 WHERE id = $2 RETURNING ${COLUMNAS_SEMANA}`,
      [JSON.stringify(body?.objetivos || []), semanaId],
    );
    return { ok: true, semana: rows[0] };
  }

  @Patch(':id/nombre')
  async actualizarNombre(@Param('id') id: string, @Body() body: { nombre?: string }) {
    const semanaId = parseIdOrThrow(id);
    const nombre = (body?.nombre || '').trim();
    if (!nombre) throw new BadRequestException('El nombre no puede estar vacío');
    const { rows } = await this.db.query(
      `UPDATE semanas SET unidad_nombre = $1 WHERE id = $2 RETURNING ${COLUMNAS_SEMANA}`,
      [nombre, semanaId],
    );
    return { ok: true, semana: rows[0] };
  }

  @Patch(':id/examen-config')
  async actualizarConfigExamen(
    @Param('id') id: string,
    @Body() body: { duracionExamenMin?: number; preguntasExamenCount?: number | null },
  ) {
    const semanaId = parseIdOrThrow(id);
    const duracion = Number.isFinite(body?.duracionExamenMin) ? body.duracionExamenMin : 15;
    const cantidad = body?.preguntasExamenCount ?? null;
    const { rows } = await this.db.query(
      `UPDATE semanas SET duracion_examen_min = $1, preguntas_examen_count = $2 WHERE id = $3 RETURNING ${COLUMNAS_SEMANA}`,
      [duracion, cantidad, semanaId],
    );
    return { ok: true, semana: rows[0] };
  }

  @Post()
  async crearSemana(@Body() body: { materiaId?: number; nombre?: string }) {
    const materiaId = parseInt(String(body?.materiaId), 10);
    if (!materiaId) throw new BadRequestException('materiaId requerido');
    const { rows: maxRows } = await this.db.query(
      `SELECT COALESCE(MAX(numero::integer), 0) + 1 AS siguiente FROM semanas WHERE materia_id = $1`,
      [materiaId],
    );
    const siguiente = maxRows[0].siguiente;
    const numero = String(siguiente).padStart(2, '0');
    const nombre = (body?.nombre || '').trim() || `Sesión ${numero}`;
    const { rows } = await this.db.query(
      `INSERT INTO semanas (materia_id, numero, unidad_nombre, capitulo_grossman, ra, ra_descripcion, duracion_examen_min)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${COLUMNAS_SEMANA}`,
      [materiaId, numero, nombre, 'Pendiente de definir', `RA${siguiente}`, 'Pendiente de definir', 15],
    );
    return { ok: true, semana: rows[0] };
  }

  @Delete(':id')
  async eliminarSemana(@Param('id') id: string) {
    const semanaId = parseIdOrThrow(id);
    for (const carpeta of ['semanas-html', 'semanas-ejercicios', 'semanas-banco-preguntas']) {
      fs.rmSync(path.join(CARPETA_UPLOADS, carpeta, String(semanaId)), { recursive: true, force: true });
    }
    for (const tipo of Object.keys(TIPOS_PDF_COLUMNA)) {
      fs.rmSync(path.join(CARPETA_UPLOADS, 'semanas', `${semanaId}-${tipo}.pdf`), { force: true });
    }
    await this.db.query(`DELETE FROM semanas WHERE id = $1`, [semanaId]);
    return { ok: true };
  }

  @Post(':id/pdf/:tipo')
  @UseInterceptors(FileInterceptor('archivo', {
    storage: memoryStorage(),
    fileFilter: fileFilterPdf,
    limits: { fileSize: MAX_BYTES_PDF },
  }))
  async subirPdf(
    @Param('id') id: string,
    @Param('tipo') tipo: string,
    @UploadedFile() archivo: Express.Multer.File,
  ) {
    const semanaId = parseIdOrThrow(id);
    const columna = TIPOS_PDF_COLUMNA[tipo];
    if (!columna) throw new BadRequestException('Tipo de PDF inválido (usa notas, guia o diapositivas)');
    if (!archivo) throw new BadRequestException('No se recibió el archivo PDF (campo "archivo")');

    const carpeta = path.join(CARPETA_UPLOADS, 'semanas');
    fs.mkdirSync(carpeta, { recursive: true });
    const nombreArchivo = `${semanaId}-${tipo}.pdf`;
    fs.writeFileSync(path.join(carpeta, nombreArchivo), archivo.buffer);

    const url = `/uploads/semanas/${nombreArchivo}`;
    const { rows } = await this.db.query(
      `UPDATE semanas SET ${columna} = $1 WHERE id = $2 RETURNING ${COLUMNAS_SEMANA}`,
      [url, semanaId],
    );
    return { ok: true, semana: rows[0] };
  }

  private async subirProyectoGenerico(id: string, archivo: Express.Multer.File, subcarpetaBase: string, columna: string) {
    const semanaId = parseIdOrThrow(id);
    if (!archivo) throw new BadRequestException('No se recibió el archivo .zip (campo "proyecto")');

    const destino = path.join(CARPETA_UPLOADS, subcarpetaBase, String(semanaId));
    const subcarpeta = extraerProyectoZip(archivo.buffer, destino);
    const url = `/uploads/${subcarpetaBase}/${semanaId}${subcarpeta ? '/' + subcarpeta : ''}/index.html`;

    const { rows } = await this.db.query(
      `UPDATE semanas SET ${columna} = $1 WHERE id = $2 RETURNING ${COLUMNAS_SEMANA}`,
      [url, semanaId],
    );
    return { ok: true, semana: rows[0] };
  }

  private async eliminarProyectoGenerico(id: string, subcarpetaBase: string, columna: string) {
    const semanaId = parseIdOrThrow(id);
    fs.rmSync(path.join(CARPETA_UPLOADS, subcarpetaBase, String(semanaId)), { recursive: true, force: true });
    await this.db.query(`UPDATE semanas SET ${columna} = NULL WHERE id = $1`, [semanaId]);
    return { ok: true };
  }

  @Post(':id/html')
  @UseInterceptors(FileInterceptor('proyecto', {
    storage: memoryStorage(),
    fileFilter: fileFilterZip,
    limits: { fileSize: MAX_BYTES_PROYECTO },
  }))
  async subirHtml(@Param('id') id: string, @UploadedFile() archivo: Express.Multer.File) {
    return this.subirProyectoGenerico(id, archivo, 'semanas-html', 'clase_web_url');
  }

  @Delete(':id/html')
  async eliminarHtml(@Param('id') id: string) {
    return this.eliminarProyectoGenerico(id, 'semanas-html', 'clase_web_url');
  }

  @Post(':id/ejercicios-resueltos')
  @UseInterceptors(FileInterceptor('proyecto', {
    storage: memoryStorage(),
    fileFilter: fileFilterZip,
    limits: { fileSize: MAX_BYTES_PROYECTO },
  }))
  async subirEjerciciosResueltos(@Param('id') id: string, @UploadedFile() archivo: Express.Multer.File) {
    return this.subirProyectoGenerico(id, archivo, 'semanas-ejercicios', 'ejercicios_resueltos_url');
  }

  @Delete(':id/ejercicios-resueltos')
  async eliminarEjerciciosResueltos(@Param('id') id: string) {
    return this.eliminarProyectoGenerico(id, 'semanas-ejercicios', 'ejercicios_resueltos_url');
  }

  @Post(':id/banco-preguntas')
  @UseInterceptors(FileInterceptor('proyecto', {
    storage: memoryStorage(),
    fileFilter: fileFilterZip,
    limits: { fileSize: MAX_BYTES_PROYECTO },
  }))
  async subirBancoPreguntas(@Param('id') id: string, @UploadedFile() archivo: Express.Multer.File) {
    return this.subirProyectoGenerico(id, archivo, 'semanas-banco-preguntas', 'banco_preguntas_url');
  }

  @Delete(':id/banco-preguntas')
  async eliminarBancoPreguntas(@Param('id') id: string) {
    return this.eliminarProyectoGenerico(id, 'semanas-banco-preguntas', 'banco_preguntas_url');
  }
}
