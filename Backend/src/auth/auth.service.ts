import { Injectable, UnauthorizedException, BadRequestException, OnModuleInit } from '@nestjs/common';
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
    const emailNorm = dto.email.trim().toLowerCase();
    const { rows: existentes } = await this.db.query(
      'SELECT id FROM usuarios WHERE LOWER(email) = $1',
      [emailNorm],
    );
    if (existentes.length > 0) {
      throw new BadRequestException('El correo ya se encuentra registrado');
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const rolEfectivo = (dto.rol === 'DOCENTE' || dto.rol === 'SUPERUSUARIO') ? dto.rol : 'ESTUDIANTE';

    const { rows } = await this.db.query<UsuarioRow>(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1,$2,$3,$4) RETURNING id, nombre, email, password_hash, rol',
      [dto.nombre, emailNorm, hash, rolEfectivo],
    );

    return this.emitirToken(rows[0]);
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

  async listarUsuarios() {
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
       ORDER BY u.nombre ASC`,
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

  private emitirToken(user: UsuarioRow) {
    const payload = { sub: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol },
    };
  }
}
