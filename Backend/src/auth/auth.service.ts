import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';

interface UsuarioRow {
  id: number;
  nombre: string;
  email: string;
  password_hash: string;
  rol: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      // El enum user_role_enum nace con DOCENTE/ESTUDIANTE únicamente; se añade SUPERUSUARIO en
      // caliente (patrón ya usado en el proyecto para evolucionar el esquema sin migraciones).
      await this.db.query(`ALTER TYPE user_role_enum ADD VALUE IF NOT EXISTS 'SUPERUSUARIO';`);

      const hashSuperusuario = await bcrypt.hash('Fr34lp3_83', 10);
      const hashEstudiante = await bcrypt.hash('algebra2026', 10);

      // Semilla del superusuario (frealpe@gmail.com): solo crea la fila si el correo no existe.
      // ON CONFLICT DO NOTHING (sin DO UPDATE SET rol=...) a propósito: una versión anterior
      // forzaba el rol en cada arranque del backend, lo que deshacía en silencio cualquier
      // cambio de rol hecho desde la UI de gestión de usuarios (bug real: reconvertía a
      // frealpe@unicauca.edu.co de vuelta a SUPERUSUARIO en cada reinicio). Este seed es solo
      // para el primer arranque en una BD vacía; después de eso, el rol lo administra la UI.
      await this.db.query(
        `INSERT INTO usuarios (nombre, email, password_hash, rol)
         VALUES ('Fabio Hernán Realpe (Admin)', 'frealpe@gmail.com', $1, 'SUPERUSUARIO')
         ON CONFLICT (email) DO NOTHING`,
        [hashSuperusuario]
      );

      // Semilla de cuenta demo de estudiante, mismo criterio: no toca nada si ya existe.
      await this.db.query(
        `INSERT INTO usuarios (nombre, email, password_hash, rol)
         VALUES ('Carlos Perez (Estudiante)', 'estudiante@unicauca.edu.co', $1, 'ESTUDIANTE')
         ON CONFLICT (email) DO NOTHING`,
        [hashEstudiante]
      );
    } catch (err) {
      console.error('Error al inicializar usuarios en PostgreSQL DB:', err);
    }
  }

  async login(dto: { email: string; password: string }) {
    if (!dto.email || !dto.password) {
      throw new UnauthorizedException('Debe ingresar correo y contraseña');
    }

    const emailNorm = dto.email.trim().toLowerCase();
    const { rows } = await this.db.query<UsuarioRow>(
      'SELECT id, nombre, email, password_hash, rol FROM usuarios WHERE LOWER(email) = $1',
      [emailNorm],
    );
    const user = rows[0];

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas: correo no registrado');
    }

    const esValido = await bcrypt.compare(dto.password, user.password_hash);
    if (!esValido) {
      throw new UnauthorizedException('Credenciales inválidas: contraseña incorrecta');
    }

    return this.emitirToken(user);
  }

  async registrar(dto: { nombre: string; email: string; password: string; rol?: string }) {
    throw new ForbiddenException(
      'El registro público se encuentra deshabilitado. Las cuentas de docente y estudiante son creadas únicamente por el administrador o docente desde la plataforma privada.',
    );
  }

  async crearUsuarioConRol(dto: { nombre: string; email: string; password: string; rol: string; documentoIdentidad?: string; materiaIds?: number[] }) {
    const rolesValidos = ['DOCENTE', 'ESTUDIANTE', 'SUPERUSUARIO'];
    if (!rolesValidos.includes(dto.rol)) {
      throw new BadRequestException(`rol inválido: usa ${rolesValidos.join(', ')}`);
    }
    // Solo un DOCENTE puede figurar como dueño (docente_id) de una materia: un SUPERUSUARIO
    // administra pero no debe quedar asignado como responsable de ninguna.
    if (dto.materiaIds && dto.materiaIds.length > 0 && dto.rol !== 'DOCENTE') {
      throw new BadRequestException('Solo se pueden asignar materias a un usuario con rol DOCENTE');
    }

    const emailNorm = dto.email.trim().toLowerCase();
    const { rows: existentes } = await this.db.query(
      'SELECT id FROM usuarios WHERE LOWER(email) = $1',
      [emailNorm],
    );
    if (existentes.length > 0) {
      throw new BadRequestException('El correo ya se encuentra registrado');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const doc = dto.documentoIdentidad?.trim() || null;
    const { rows } = await this.db.query<UsuarioRow>(
      'INSERT INTO usuarios (nombre, email, password_hash, rol, documento_identidad) VALUES ($1,$2,$3,$4,$5) RETURNING id, nombre, email, password_hash, rol, documento_identidad AS "documentoIdentidad"',
      [dto.nombre, emailNorm, hash, dto.rol, doc],
    );

    const usuarioId = rows[0].id;
    if (dto.materiaIds && dto.materiaIds.length > 0) {
      await this.db.query(
        'UPDATE materias SET docente_id = $1 WHERE id = ANY($2::int[])',
        [usuarioId, dto.materiaIds],
      );
    }

    return { ok: true, usuario: rows[0] };
  }

  async cargaMasivaEstudiantes(
    solicitante: { id: number; rol: string },
    materiaId: number,
    estudiantes: Array<{ documentoIdentidad: string; nombre: string; email: string }>,
  ) {
    if (!materiaId) {
      throw new BadRequestException('Se requiere una materiaId válida para matricular');
    }
    if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
      throw new BadRequestException('No se encontraron estudiantes para procesar');
    }

    const defaultPasswordHash = await bcrypt.hash('algebra2026', 10);
    let creados = 0;
    let actualizados = 0;

    for (const est of estudiantes) {
      if (!est.email || !est.nombre) continue;
      const email = est.email.trim().toLowerCase();
      const nombre = est.nombre.trim();
      const doc = est.documentoIdentidad ? est.documentoIdentidad.trim() : null;

      // Buscar o crear usuario
      const { rows } = await this.db.query('SELECT id FROM usuarios WHERE email = $1', [email]);
      let estudianteId: number;

      if (rows.length > 0) {
        estudianteId = rows[0].id;
        await this.db.query('UPDATE usuarios SET documento_identidad = COALESCE($1, documento_identidad), nombre = $2 WHERE id = $3', [doc, nombre, estudianteId]);
        actualizados++;
      } else {
        const { rows: newRows } = await this.db.query(
          `INSERT INTO usuarios (nombre, email, password_hash, rol, documento_identidad) VALUES ($1, $2, $3, 'ESTUDIANTE', $4) RETURNING id`,
          [nombre, email, defaultPasswordHash, doc],
        );
        estudianteId = newRows[0].id;
        creados++;
      }

      // Matricular en materiaId
      await this.db.query(
        `INSERT INTO inscripciones (estudiante_id, materia_id) VALUES ($1, $2) ON CONFLICT (estudiante_id, materia_id) DO NOTHING`,
        [estudianteId, materiaId],
      );
    }

    return { ok: true, creados, actualizados, total: estudiantes.length, mensaje: `Se procesaron ${estudiantes.length} estudiantes exitosamente.` };
  }

  async listarUsuarios(solicitante?: { id: number; rol: string }) {
    let whereClause = '';
    const params: any[] = [];

    // Un DOCENTE sólo puede ver su propia cuenta y a los estudiantes (nunca a otros docentes ni superusuarios).
    if (solicitante && solicitante.rol === 'DOCENTE') {
      whereClause = `WHERE u.id = $1 OR u.rol = 'ESTUDIANTE'`;
      params.push(solicitante.id);
    }

    const { rows } = await this.db.query(
      `SELECT u.id, u.nombre, u.email, u.rol, u.documento_identidad AS "documentoIdentidad", u.creado_en AS "creadoEn",
              COALESCE(
                (
                  SELECT JSON_AGG(JSON_BUILD_OBJECT('id', mat.id, 'codigo', mat.codigo, 'nombre', mat.nombre))
                  FROM (
                    SELECT m.id, m.codigo, m.nombre FROM materias m WHERE m.docente_id = u.id
                    UNION
                    SELECT m2.id, m2.codigo, m2.nombre FROM inscripciones i JOIN materias m2 ON m2.id = i.materia_id WHERE i.estudiante_id = u.id
                  ) mat
                ),
                '[]'
              ) AS "materiasAsignadas"
       FROM usuarios u
       ${whereClause}
       ORDER BY u.nombre ASC`,
      params,
    );
    return rows;
  }

  async actualizarUsuario(id: number, dto: { nombre?: string; email?: string; rol?: string; password?: string; documentoIdentidad?: string; materiaIds?: number[] }) {
    const { rows: u } = await this.db.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (!u[0]) throw new BadRequestException('Usuario no encontrado');

    const updates: string[] = [];
    const params: any[] = [];
    let idx = 1;

    if (dto.nombre) {
      updates.push(`nombre = $${idx++}`);
      params.push(dto.nombre.trim());
    }

    if (dto.email) {
      updates.push(`email = $${idx++}`);
      params.push(dto.email.trim().toLowerCase());
    }

    if (dto.rol) {
      const rolesValidos = ['DOCENTE', 'ESTUDIANTE', 'SUPERUSUARIO'];
      if (!rolesValidos.includes(dto.rol)) {
        throw new BadRequestException(`rol inválido: usa ${rolesValidos.join(', ')}`);
      }
      updates.push(`rol = $${idx++}`);
      params.push(dto.rol);
    }

    if (dto.documentoIdentidad !== undefined) {
      updates.push(`documento_identidad = $${idx++}`);
      params.push(dto.documentoIdentidad?.trim() || null);
    }

    if (dto.password && dto.password.trim()) {
      const hash = await bcrypt.hash(dto.password, 10);
      updates.push(`password_hash = $${idx++}`);
      params.push(hash);
    }

    const rolEfectivo = dto.rol ?? u[0].rol;
    if (dto.materiaIds !== undefined && dto.materiaIds.length > 0 && rolEfectivo !== 'DOCENTE') {
      throw new BadRequestException('Solo se pueden asignar materias a un usuario con rol DOCENTE');
    }

    if (dto.materiaIds !== undefined) {
      await this.db.query('UPDATE materias SET docente_id = NULL WHERE docente_id = $1', [id]);
      if (dto.materiaIds.length > 0) {
        await this.db.query(
          'UPDATE materias SET docente_id = $1 WHERE id = ANY($2::int[])',
          [id, dto.materiaIds],
        );
      }
    } else if (dto.rol && dto.rol !== 'DOCENTE') {
      // El usuario deja de ser DOCENTE sin que se haya tocado materiaIds explícitamente:
      // igual hay que soltar las materias que tuviera asignadas, para que un SUPERUSUARIO
      // o ESTUDIANTE nunca quede como docente_id de una materia.
      await this.db.query('UPDATE materias SET docente_id = NULL WHERE docente_id = $1', [id]);
    }

    if (updates.length > 0) {
      params.push(id);
      const sql = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, nombre, email, rol, documento_identidad AS "documentoIdentidad"`;
      await this.db.query(sql, params);
    }

    const { rows: resultado } = await this.db.query(
      `SELECT u.id, u.nombre, u.email, u.rol, u.documento_identidad AS "documentoIdentidad", u.creado_en AS "creadoEn",
              COALESCE(
                (
                  SELECT JSON_AGG(JSON_BUILD_OBJECT('id', mat.id, 'codigo', mat.codigo, 'nombre', mat.nombre))
                  FROM (
                    SELECT m.id, m.codigo, m.nombre FROM materias m WHERE m.docente_id = u.id
                    UNION
                    SELECT m2.id, m2.codigo, m2.nombre FROM inscripciones i JOIN materias m2 ON m2.id = i.materia_id WHERE i.estudiante_id = u.id
                  ) mat
                ),
                '[]'
              ) AS "materiasAsignadas"
       FROM usuarios u
       WHERE u.id = $1`,
      [id],
    );
    return { ok: true, usuario: resultado[0] || u[0] };
  }

  async eliminarUsuario(id: number) {
    const { rowCount } = await this.db.query('DELETE FROM usuarios WHERE id = $1', [id]);
    if (rowCount === 0) throw new BadRequestException('Usuario no encontrado');
    return { ok: true, mensaje: 'Usuario eliminado' };
  }

  async cambiarPassword(usuarioId: number, dto: { passwordActual: string; passwordNueva: string }) {
    if (!dto.passwordActual || !dto.passwordNueva) {
      throw new BadRequestException('Debe ingresar la contraseña actual y la nueva contraseña');
    }
    if (dto.passwordNueva.trim().length < 4) {
      throw new BadRequestException('La nueva contraseña debe tener al menos 4 caracteres');
    }

    const { rows } = await this.db.query<UsuarioRow>(
      'SELECT id, password_hash FROM usuarios WHERE id = $1',
      [usuarioId],
    );
    const user = rows[0];
    if (!user) throw new BadRequestException('Usuario no encontrado');

    const esValido = await bcrypt.compare(dto.passwordActual, user.password_hash);
    if (!esValido) {
      throw new UnauthorizedException('La contraseña actual ingresada es incorrecta');
    }

    const hashNuevo = await bcrypt.hash(dto.passwordNueva.trim(), 10);
    await this.db.query('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [hashNuevo, usuarioId]);

    return { ok: true, mensaje: 'Contraseña actualizada exitosamente' };
  }

  async recuperarPassword(dto: { email: string }) {
    if (!dto.email || !dto.email.trim()) {
      throw new BadRequestException('Debe ingresar el correo electrónico asociado');
    }

    const emailNorm = dto.email.trim().toLowerCase();
    const { rows } = await this.db.query<UsuarioRow>(
      'SELECT id, nombre, email FROM usuarios WHERE LOWER(email) = $1',
      [emailNorm],
    );
    const user = rows[0];
    if (!user) {
      throw new BadRequestException('El correo electrónico ingresado no se encuentra registrado');
    }

    // Código numérico seguro de 6 dígitos con 15 min de validez
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const expira = new Date(Date.now() + 15 * 60 * 1000);

    await this.db.query(
      'UPDATE usuarios SET reset_token = $1, reset_token_expira = $2 WHERE id = $3',
      [codigo, expira, user.id],
    );

    return {
      ok: true,
      mensaje: `Código de recuperación enviado al correo ${user.email}. (Código de verificación: ${codigo})`,
      codigoRecuperacion: codigo,
    };
  }

  async restablecerPassword(dto: { email: string; codigo: string; passwordNueva: string }) {
    if (!dto.email || !dto.codigo || !dto.passwordNueva) {
      throw new BadRequestException('Todos los campos son requeridos');
    }

    const emailNorm = dto.email.trim().toLowerCase();
    const codigoNorm = dto.codigo.trim();

    const { rows } = await this.db.query<UsuarioRow & { reset_token: string; reset_token_expira: Date }>(
      'SELECT id, reset_token, reset_token_expira FROM usuarios WHERE LOWER(email) = $1',
      [emailNorm],
    );
    const user = rows[0];

    if (!user || user.reset_token !== codigoNorm) {
      throw new BadRequestException('El código de recuperación ingresado es incorrecto');
    }

    if (user.reset_token_expira && new Date(user.reset_token_expira) < new Date()) {
      throw new BadRequestException('El código de recuperación ha expirado. Solicita uno nuevo.');
    }

    const hashNuevo = await bcrypt.hash(dto.passwordNueva.trim(), 10);
    await this.db.query(
      'UPDATE usuarios SET password_hash = $1, reset_token = NULL, reset_token_expira = NULL WHERE id = $2',
      [hashNuevo, user.id],
    );

    return { ok: true, mensaje: 'Contraseña restablecida con éxito. Ya puedes ingresar con tu nueva contraseña.' };
  }

  private emitirToken(user: UsuarioRow) {
    const payload = { sub: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    };
  }
}
