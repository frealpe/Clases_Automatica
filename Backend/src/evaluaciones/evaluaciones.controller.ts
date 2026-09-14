import { Controller, Get, Post, Put, Delete, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { calificar } from '../common/calificacion';

@Controller('evaluaciones')
export class EvaluacionesController {
  constructor(private readonly db: DatabaseService) {}

  private async ensureQuicesTable() {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS quices (
        id VARCHAR(100) PRIMARY KEY,
        materia_id INT REFERENCES materias(id) ON DELETE CASCADE,
        titulo VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) NOT NULL DEFAULT 'ordinario',
        semana_numero VARCHAR(50) NOT NULL,
        semana_id INT REFERENCES semanas(id) ON DELETE SET NULL,
        descripcion TEXT,
        preguntas JSONB NOT NULL DEFAULT '[]'::jsonb,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  // Entrega de un intento de examen "bajo demanda" (por semana). Exige sesión: el intento se
  // registra SIEMPRE a nombre del usuario autenticado (nunca de un estudianteId del body).
  // La nota NO se toma del cliente: se recalcula aquí comparando las opciones elegidas contra
  // la columna `correcta` del banco de preguntas.
  @Post('submit')
  @UseGuards(JwtAuthGuard)
  async registrarIntento(@Body() body: any, @Req() req: any) {
    const estudianteId = req.user.id;
    const semanaId = body?.semanaId ? parseInt(String(body.semanaId), 10) : null;

    const respuestasMap =
      body?.respuestas && typeof body.respuestas === 'object' && !Array.isArray(body.respuestas)
        ? body.respuestas
        : {};
    const ids = Object.keys(respuestasMap);

    let preguntas: any[] = [];
    if (ids.length > 0) {
      const { rows } = await this.db.query(
        `SELECT id, correcta, explicacion, falencia, tipo, pregunta FROM preguntas WHERE id = ANY($1)`,
        [ids],
      );
      preguntas = rows;
    }
    const resultado = calificar(preguntas, respuestasMap);

    const { rows } = await this.db.query(
      `INSERT INTO intentos_examen
         (estudiante_id, semana_id, nota5, porcentaje, aprobado, infraccion_ia, tiempo_empleado_seg, respuestas)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING id, estudiante_id AS "estudianteId", semana_id AS "semanaId", nota5, porcentaje, aprobado,
                 infraccion_ia AS "infraccionIA", tiempo_empleado_seg AS "tiempoEmpleadoSeg", fecha`,
      [
        estudianteId,
        semanaId,
        resultado.nota5,
        resultado.porcentaje,
        resultado.aprobado,
        !!body?.infraccionIA,
        Number.isFinite(body?.tiempoEmpleadoSeg) ? body.tiempoEmpleadoSeg : 0,
        JSON.stringify(respuestasMap),
      ],
    );
    return {
      status: 'ok',
      mensaje: 'Resultado calificado y registrado en el servidor PostgreSQL',
      intento: rows[0],
      resultado,
    };
  }

  // Alias histórico; mismo comportamiento que POST /evaluaciones/submit.
  @Post('submit-auth')
  @UseGuards(JwtAuthGuard)
  async registrarIntentoAuth(@Body() body: any, @Req() req: any) {
    return this.registrarIntento(body, req);
  }

  @Get('docente/reportes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE', 'SUPERUSUARIO', 'ESTUDIANTE')
  async obtenerReporteDocente(@Req() req: any) {
    const esEstudiante = req.user?.rol === 'ESTUDIANTE';
    const params: any[] = [];
    let whereClause = '';

    if (esEstudiante && req.user?.id) {
      whereClause = 'WHERE i.estudiante_id = $1';
      params.push(req.user.id);
    }

    const { rows } = await this.db.query(
      `SELECT i.id, i.estudiante_id AS "estudianteId", u.nombre AS "estudianteNombre", u.email AS "estudianteEmail",
              u.documento_identidad AS "estudianteCodigo", s.numero AS "semanaNumero", i.nota5, i.porcentaje,
              i.aprobado, i.infraccion_ia AS "infraccionIA", i.tiempo_empleado_seg AS "tiempoEmpleadoSeg", i.fecha,
              CASE WHEN i.examen_programado_id IS NOT NULL THEN 'programado' ELSE 'semana' END AS "origen",
              ep.titulo AS "tituloExamen", i.respuestas
       FROM intentos_examen i
       JOIN usuarios u ON u.id = i.estudiante_id
       LEFT JOIN semanas s ON s.id = i.semana_id
       LEFT JOIN examenes_programados ep ON ep.id = i.examen_programado_id
       ${whereClause}
       ORDER BY i.fecha DESC`,
      params,
    );

    const intentosProcesados = rows.map((r: any) => {
      let respObj: any = null;
      if (typeof r.respuestas === 'string') {
        try { respObj = JSON.parse(r.respuestas); } catch (_) {}
      } else {
        respObj = r.respuestas;
      }

      const noPresento = !!respObj?.noPresento || respObj?.tipoEvaluacion === 'no_presento';

      return {
        ...r,
        noPresento,
        respuestas: undefined
      };
    });

    const totalEvaluaciones = intentosProcesados.length;
    const aprobadosCount = intentosProcesados.filter((r: any) => r.aprobado).length;
    const noPresentosCount = intentosProcesados.filter((r: any) => r.noPresento).length;
    const infraccionesCount = intentosProcesados.filter((r: any) => r.infraccionIA).length;

    let totalIngresos = 0;
    if (req.user?.id) {
      const { rows: actRows } = await this.db.query(
        `SELECT COUNT(id)::int AS count FROM actividad_estudiantes WHERE usuario_id = $1`,
        [req.user.id],
      );
      totalIngresos = actRows[0]?.count || 1;
    }

    return {
      resumenGrupov: {
        totalEvaluaciones,
        aprobadosCount,
        noPresentosCount,
        infraccionesCount,
        totalIngresos,
        tasaAprobacion: Math.round((aprobadosCount / (totalEvaluaciones || 1)) * 100) + '%',
      },
      totalIngresos,
      intentos: intentosProcesados,
    };
  }

  @Get('docente/quices-algebra')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE', 'SUPERUSUARIO', 'ESTUDIANTE')
  async obtenerQuicesAlgebra(@Query('materiaId') materiaId?: string) {
    const matId = materiaId ? parseInt(String(materiaId), 10) : 1;
    const quicesBase = matId !== 1 ? [] : [
      {
        id: 'quiz1_s01_03',
        titulo: 'Quiz 1 — Semanas 01 a 03 (Sistemas de Ecuaciones y Álgebra Matricial)',
        tipo: 'ordinario',
        semanaNumero: '01-03',
        semanaId: 1,
        descripcion: 'Quiz oficial de 7 preguntas sobre clasificación 2x2, FERR, sistemas homogéneos, dimensiones y operaciones matriciales.',
        preguntas: [
          {
            num: 1,
            titulo: 'Semana 1: Clasificación e Interpretación Geométrica en R²',
            ra: 'RA1.1-RA1.2',
            raDescripcion: 'Reconocer la forma general de un sistema de ecuaciones lineales, e interpretar geométricamente sistemas 2x2.',
            enunciado: 'Considere 2x - 3y = 5 y -4x + 6y = k. ¿Para qué valor de k el sistema es consistente indeterminado y cuál es su representación geométrica?',
            opciones: [
              { id: 'a', texto: 'k = 10; representa dos rectas paralelas no coincidentes.' },
              { id: 'b', texto: 'k = -10; representa dos rectas coincidentes (infinitas soluciones).' },
              { id: 'c', texto: 'k = -5; representa dos rectas perpendiculares secantes.' },
              { id: 'd', texto: 'k = 0; el sistema es inconsistente para todo k ≠ 0.' }
            ],
            correcta: 'b',
            explicacion: 'Al multiplicar la 1a ecuación por -2 se obtiene -4x + 6y = -10. Para k = -10 ambas ecuaciones son equivalentes (misma recta).',
            falencia: 'Dificultad para identificar la constante de proporcionalidad k en sistemas dependientes (rectas coincidentes).'
          },
          {
            num: 2,
            titulo: 'Semana 2: Operaciones Elementales y Matriz Escalonada (FERR)',
            ra: 'RA1.2b-RA1.4',
            raDescripcion: 'Resolver sistemas m x n mediante eliminación de Gauss-Jordan y FERR.',
            enunciado: 'En la FERR se obtiene la fila final [0 0 0 | 7]. ¿Qué conclusión es correcta?',
            opciones: [
              { id: 'a', texto: 'El sistema tiene solución única (4, 1, 7).' },
              { id: 'b', texto: 'El sistema tiene infinitas soluciones con z libre.' },
              { id: 'c', texto: 'El sistema es inconsistente (sin solución) por la fila contradictoria 0 = 7.' },
              { id: 'd', texto: 'Es equivalente al sistema homogéneo asociado.' }
            ],
            correcta: 'c',
            explicacion: 'La fila [0 0 0 | 7] representa 0x + 0y + 0z = 7 (0 = 7), una contradicción imposible que genera inconsistencia.',
            falencia: 'No reconocer contradicciones algebraicas en la matriz aumentada escalonada.'
          },
          {
            num: 3,
            titulo: 'Semana 2: Sistemas Homogéneos y Variables Libres',
            ra: 'RA1.2b-RA1.4',
            raDescripcion: 'Reconocer las propiedades particulares de los sistemas homogéneos.',
            enunciado: 'Sea A de 3x4 (3 eq, 4 inc) en Ax = 0. ¿Qué es necesariamente verdadero?',
            opciones: [
              { id: 'a', texto: 'Es inconsistente por tener más incógnitas que ecuaciones.' },
              { id: 'b', texto: 'Posee únicamente la solución trivial x = 0.' },
              { id: 'c', texto: 'Tiene infinitas soluciones no triviales porque n > m implica al menos una variable libre.' },
              { id: 'd', texto: 'No se puede reducir por Gauss-Jordan.' }
            ],
            correcta: 'c',
            explicacion: 'Un sistema homogéneo con m < n siempre tiene infinitas soluciones no triviales (rango r ≤ m < n, n-r ≥ 1 libre).',
            falencia: 'Confundir el teorema de más incógnitas que ecuaciones (m < n) en sistemas homogéneos.'
          },
          {
            num: 4,
            titulo: 'Semana 3: Álgebra Matricial y Dimensiones',
            ra: 'RA2.1-RA2.2',
            raDescripcion: 'Operaciones matriciales y compatibilidad de dimensiones.',
            enunciado: 'Dadas A_(3x2), B_(2x4) y C_(4x3). ¿Cuál operación está correctamente definida y su dimensión?',
            opciones: [
              { id: 'a', texto: '(A B) C está definido y su dimensión es 3 x 2.' },
              { id: 'b', texto: '(A B) C está bien definido y resulta en una matriz de 3 x 3.' },
              { id: 'c', texto: 'La suma A + B está definida y es 3 x 4.' },
              { id: 'd', texto: 'El producto B A está definido y su tamaño es 2 x 2.' }
            ],
            correcta: 'b',
            explicacion: 'AB es (3x2)(2x4) = 3x4. Luego (AB)C es (3x4)(4x3) = 3x3. Por tanto (AB)C está bien definido y es 3x3.',
            falencia: 'Errores al evaluar la compatibilidad de columnas y filas en productos matriciales encadenados.'
          },
          {
            num: 5,
            titulo: 'Semana 3: Propiedades del Producto Matricial',
            ra: 'RA2.1-RA2.2',
            raDescripcion: 'Propiedades algebraicas del producto y transposición de matrices.',
            enunciado: 'Sean A, B matrices cuadradas n x n. ¿Cuál identidad NO se cumple en general?',
            opciones: [
              { id: 'a', texto: 'A(B + C) = AB + AC' },
              { id: 'b', texto: 'A I_n = I_n A = A' },
              { id: 'c', texto: '(A + B)² = A² + 2AB + B²' },
              { id: 'd', texto: 'A(BC) = (AB)C' }
            ],
            correcta: 'c',
            explicacion: '(A+B)² = A² + AB + BA + B². Como AB no es necesariamente igual a BA en matrices, la fórmula de binomio al cuadrado no se cumple en general.',
            falencia: 'Asumir conmutatividad (AB = BA) en productos de matrices.'
          },
          {
            num: 6,
            titulo: 'Semana 1-2: Ejercicio Práctico — Sistema 3x3 Solución Única',
            ra: 'RA1.2b-RA1.4',
            raDescripcion: 'Resolver sistemas 3x3 por reducción gaussiana.',
            enunciado: 'Resuelva x+y+z=6, 2x-y+z=3, x+2y-z=2. ¿Cuál es el conjunto solución (x, y, z)?',
            opciones: [
              { id: 'a', texto: '(x, y, z) = (2, 1, 3)' },
              { id: 'b', texto: '(x, y, z) = (1, 2, 3)' },
              { id: 'c', texto: '(x, y, z) = (3, 0, 3)' },
              { id: 'd', texto: 'El sistema es inconsistente.' }
            ],
            correcta: 'b',
            explicacion: 'Al aplicar eliminación de Gauss-Jordan se obtiene x = 1, y = 2, z = 3. Sustituyendo: 1+2+3=6, 2-2+3=3, 1+4-3=2.',
            falencia: 'Errores aritméticos en las operaciones de fila durante la reducción de sistemas 3x3.'
          },
          {
            num: 7,
            titulo: 'Semana 1-2: Ejercicio Práctico — Sistema Homogéneo 3x3',
            ra: 'RA1.2b-RA1.4',
            raDescripcion: 'Parametrización del conjunto solución de un sistema homogéneo.',
            enunciado: 'Resuelva x+2y-z=0, 2x+5y+z=0, 3x+7y=0. Parametrización en t ∈ R:',
            opciones: [
              { id: 'a', texto: 'Únicamente la solución trivial (0, 0, 0).' },
              { id: 'b', texto: '(x, y, z) = (7t, -3t, t) con t ∈ R.' },
              { id: 'c', texto: '(x, y, z) = (3t, -7t, t) con t ∈ R.' },
              { id: 'd', texto: '(x, y, z) = (-2t, t, 3t) con t ∈ R.' }
            ],
            correcta: 'b',
            explicacion: 'De F2: y + 3z = 0 ⇒ y = -3z. De F1: x = -2y + z = -2(-3z) + z = 7z. Asignando z = t, la solución es (7t, -3t, t).',
            falencia: 'Errores al despejar las variables dependientes en función del parámetro libre t.'
          }
        ]
      },
      {
        id: 'rquiz1_s01_03',
        titulo: 'Quiz 1 (RQuiz1) — Semanas 01 a 03 (Recuperación / Reposición)',
        tipo: 'recuperacion',
        semanaNumero: '01-03',
        semanaId: 1,
        descripcion: 'Quiz oficial de recuperación/reposición para estudiantes que repiten la prueba del bloque de Semanas 01 a 03.',
        preguntas: [
          {
            num: 1,
            titulo: 'Semana 1: Clasificación e Interpretación Geométrica en R² (Recuperación)',
            ra: 'RA1.1-RA1.2',
            raDescripcion: 'Reconocer la forma general de un sistema de ecuaciones lineales, e interpretar geométricamente sistemas 2x2.',
            enunciado: 'Considere 3x - 2y = 8 y -6x + 4y = k. ¿Para qué valor de k el sistema es consistente indeterminado y cuál es su representación geométrica?',
            opciones: [
              { id: 'a', texto: 'k = 16; representa dos rectas paralelas no coincidentes.' },
              { id: 'b', texto: 'k = -16; representa dos rectas coincidentes (infinitas soluciones).' },
              { id: 'c', texto: 'k = -8; representa dos rectas perpendiculares secantes.' },
              { id: 'd', texto: 'k = 0; el sistema es inconsistente para todo k ≠ 0.' }
            ],
            correcta: 'b',
            explicacion: 'Al multiplicar 3x - 2y = 8 por -2 se obtiene -6x + 4y = -16. Por tanto k = -16 hace que ambas rectas sean la misma.',
            falencia: 'Dificultad para determinar constante k en sistemas dependientes (prueba de recuperación).'
          },
          {
            num: 2,
            titulo: 'Semana 2: Operaciones Elementales y Matriz Escalonada (Recuperación)',
            ra: 'RA1.2b-RA1.4',
            raDescripcion: 'Resolver sistemas m x n mediante eliminación de Gauss-Jordan y FERR.',
            enunciado: 'En la FERR se obtiene la fila final [0 0 0 | 4]. ¿Qué conclusión es correcta?',
            opciones: [
              { id: 'a', texto: 'El sistema tiene solución única (3, -2, 4).' },
              { id: 'b', texto: 'El sistema tiene infinitas soluciones con z libre.' },
              { id: 'c', texto: 'El sistema es inconsistente (sin solución) por la fila contradictoria 0 = 4.' },
              { id: 'd', texto: 'Es equivalente al sistema homogéneo asociado.' }
            ],
            correcta: 'c',
            explicacion: 'La fila [0 0 0 | 4] representa la ecuación imposible 0 = 4, demostrando inconsistencia absoluta del sistema.',
            falencia: 'Identificación de filas incoherentes en matrices aumentadas.'
          },
          {
            num: 3,
            titulo: 'Semana 2: Sistemas Homogéneos y Variables Libres (Recuperación)',
            ra: 'RA1.2b-RA1.4',
            raDescripcion: 'Reconocer las propiedades particulares de los sistemas homogéneos.',
            enunciado: 'Sea A de 2x5 (2 eq, 5 inc) en Ax = 0. ¿Qué es necesariamente verdadero?',
            opciones: [
              { id: 'a', texto: 'Es inconsistente por tener más incógnitas que ecuaciones.' },
              { id: 'b', texto: 'Posee únicamente la solución trivial.' },
              { id: 'c', texto: 'Tiene infinitas soluciones no triviales porque n > m implica al menos una variable libre.' },
              { id: 'd', texto: 'No se puede reducir por Gauss-Jordan.' }
            ],
            correcta: 'c',
            explicacion: 'Al haber 5 incógnitas y máximo rango 2, habrá al menos 3 variables libres: existen soluciones no triviales.',
            falencia: 'Comprensión insuficiente del grado de libertad (n-r) en sistemas homogéneos.'
          },
          {
            num: 4,
            titulo: 'Semana 3: Álgebra Matricial y Dimensiones (Recuperación)',
            ra: 'RA2.1-RA2.2',
            raDescripcion: 'Operaciones matriciales y compatibilidad de dimensiones.',
            enunciado: 'Dadas A_(2x3), B_(3x5) y C_(5x2). ¿Cuál operación está correctamente definida y cuál es su dimensión?',
            opciones: [
              { id: 'a', texto: 'El producto A B no está definido.' },
              { id: 'b', texto: '(A B) C está bien definido y resulta en una matriz de 2 x 2.' },
              { id: 'c', texto: 'La suma A + B está definida y es 2 x 5.' },
              { id: 'd', texto: 'El producto B A está definido y su tamaño es 5 x 3.' }
            ],
            correcta: 'b',
            explicacion: 'AB es (2x3)(3x5) = 2x5. Luego (AB)C es (2x5)(5x2) = 2x2.',
            falencia: 'Confusión en la determinación del tamaño de matrices producto.'
          },
          {
            num: 5,
            titulo: 'Semana 3: Propiedades del Producto Matricial (Recuperación)',
            ra: 'RA2.1-RA2.2',
            raDescripcion: 'Propiedades algebraicas de las operaciones matriciales.',
            enunciado: 'Sean A, B matrices cuadradas n x n. ¿Cuál afirmación NO se cumple en general?',
            opciones: [
              { id: 'a', texto: 'A(B - C) = AB - AC' },
              { id: 'b', texto: '(AB)C = A(BC)' },
              { id: 'c', texto: 'AB = BA para cualesquiera matrices cuadradas A y B.' },
              { id: 'd', texto: 'A + B = B + A' }
            ],
            correcta: 'c',
            explicacion: 'La multiplicación de matrices no es conmutativa en general (AB ≠ BA).',
            falencia: 'Falta de distinción entre la conmutatividad de los reales y el álgebra matricial.'
          },
          {
            num: 6,
            titulo: 'Semana 1-2: Ejercicio Práctico — Sistema 3x3 (Recuperación)',
            ra: 'RA1.2b-RA1.4',
            raDescripcion: 'Resolver sistemas 3x3 por reducción gaussiana.',
            enunciado: 'Resuelva x+y+z=5, 2x-y+3z=17, x+2y-z=-4. Conjunto solución (x, y, z):',
            opciones: [
              { id: 'a', texto: '(x, y, z) = (2, -1, 4)' },
              { id: 'b', texto: '(x, y, z) = (4, -1, 2)' },
              { id: 'c', texto: '(x, y, z) = (-1, 2, 4)' },
              { id: 'd', texto: 'El sistema es inconsistente.' }
            ],
            correcta: 'b',
            explicacion: 'Al aplicar reducción gaussiana se obtiene x=4, y=-1, z=2.',
            falencia: 'Errores de signo en la eliminación de coeficientes en sistemas 3x3.'
          },
          {
            num: 7,
            titulo: 'Semana 1-2: Ejercicio Práctico — Sistema Homogéneo 3x3 (Recuperación)',
            ra: 'RA1.2b-RA1.4',
            raDescripcion: 'Parametrización de soluciones en sistemas homogéneos.',
            enunciado: 'Resuelva x+y-z=0, 2x-y+z=0, -x+2y-2z=0. Parametrización en t ∈ R:',
            opciones: [
              { id: 'a', texto: 'Únicamente la solución trivial (0, 0, 0).' },
              { id: 'b', texto: '(x, y, z) = (0, t, t) con t ∈ R.' },
              { id: 'c', texto: '(x, y, z) = (t, 0, t) con t ∈ R.' },
              { id: 'd', texto: '(x, y, z) = (t, t, 0) con t ∈ R.' }
            ],
            correcta: 'b',
            explicacion: 'Sumando E1 y E2: 3x = 0 ⇒ x = 0. Entonces y - z = 0 ⇒ y = z = t. Solución: (0, t, t).',
            falencia: 'Dificultad para deducir variables nulas en sistemas homogéneos.'
          }
        ]
      },
      {
        id: 'quiz2_s03_05',
        titulo: 'Quiz 2 — Semanas 03 a 05 (Inversas, Transpuestas y Factorización LU)',
        tipo: 'ordinario',
        semanaNumero: '03-05',
        semanaId: 5,
        descripcion: 'Quiz oficial de 7 preguntas sobre producto matricial, inversas, transposición, matrices elementales y Factorización LU.',
        preguntas: [
          {
            num: 1,
            titulo: 'Semana 3: Dimensiones y Producto Matricial',
            ra: 'RA2.1-RA2.2',
            raDescripcion: 'Vectores y matrices; productos vectorial y matricial.',
            enunciado: 'Sean A_(3x4), B_(4x2), C_(2x3). ¿Cuál operación está correctamente definida y su dimensión?',
            opciones: [
              { id: 'a', texto: '(AB)C está definido y su dimensión es 3 x 2.' },
              { id: 'b', texto: 'B^T A^T está definido y su dimensión es 2 x 3.' },
              { id: 'c', texto: 'A + BC está definido y su dimensión es 3 x 4.' },
              { id: 'd', texto: 'CBA está definido y su dimensión es 2 x 4.' }
            ],
            correcta: 'b',
            explicacion: 'B^T es (2x4) y A^T es (4x3). Su producto B^T A^T está definido y es de tamaño 2 x 3. Nota que B^T A^T = (AB)^T.',
            falencia: 'Incomprensión de la propiedad de transposición de productos (AB)^T = B^T A^T.'
          },
          {
            num: 2,
            titulo: 'Semana 4: Propiedades de la Inversa y Transpuesta',
            ra: 'RA2.3-RA2.5',
            raDescripcion: 'Inversa y transpuesta de una matriz cuadrada.',
            enunciado: 'Sean A y B matrices cuadradas n x n invertibles. ¿Cuál propiedad es SIEMPRE verdadera?',
            opciones: [
              { id: 'a', texto: '(A + B)⁻¹ = A⁻¹ + B⁻¹' },
              { id: 'b', texto: '(AB)^T = A^T B^T' },
              { id: 'c', texto: '(AB)⁻¹ = B⁻¹ A⁻¹' },
              { id: 'd', texto: 'Si A es simétrica, A⁻¹ es antisimétrica.' }
            ],
            correcta: 'c',
            explicacion: 'La inversa del producto de dos matrices invertibles invierte el orden de los factores: (AB)⁻¹ = B⁻¹ A⁻¹.',
            falencia: 'Confundir el orden de inversión en productos de matrices.'
          },
          {
            num: 3,
            titulo: 'Semana 5: Matrices Elementales e Inversibilidad',
            ra: 'RA2.6-RA2.7',
            raDescripcion: 'Matrices elementales, matrices inversas y factorización LU.',
            enunciado: 'Sea E la matriz elemental 3x3 para R2 ← R2 - 3R1. ¿Cuál es E⁻¹ y su operación equivalente?',
            opciones: [
              { id: 'a', texto: 'E⁻¹ = [1 0 0; 3 1 0; 0 0 1], asociada a R2 ← R2 + 3R1.' },
              { id: 'b', texto: 'E⁻¹ = [1 0 0; -3 1 0; 0 0 1], asociada a R2 ← R2 - 3R1.' },
              { id: 'c', texto: 'E⁻¹ = [1 3 0; 0 1 0; 0 0 1], asociada a R1 ← R1 + 3R2.' },
              { id: 'd', texto: 'E⁻¹ = E^T' }
            ],
            correcta: 'a',
            explicacion: 'La inversa de una matriz elemental que resta 3 veces F1 a F2 es la matriz elemental que le suma 3 veces F1 a F2.',
            falencia: 'Confusión con el cambio de signo necesario en las matrices elementales inversas.'
          },
          {
            num: 4,
            titulo: 'Semana 5: Algoritmo de la Factorización LU',
            ra: 'RA2.6-RA2.7',
            raDescripcion: 'Resolución de sistemas mediante sustitución en factorización LU.',
            enunciado: 'Dado L = [1 0 0; 2 1 0; -1 3 1] y b = (4, 11, 5)^T. Halle el vector intermedio y en Ly = b.',
            opciones: [
              { id: 'a', texto: 'y = (4, 3, 0)^T' },
              { id: 'b', texto: 'y = (4, 11, 5)^T' },
              { id: 'c', texto: 'y = (4, -3, 9)^T' },
              { id: 'd', texto: 'y = (1, 3, -1)^T' }
            ],
            correcta: 'a',
            explicacion: 'y1 = 4. De la fila 2: 2y1 + y2 = 11 ⇒ 2(4)+y2=11 ⇒ y2 = 3. De la fila 3: -y1 + 3y2 + y3 = 5 ⇒ -4 + 3(3) + y3 = 5 ⇒ 5 + y3 = 5 ⇒ y3 = 0. Luego y = (4, 3, 0)^T.',
            falencia: 'Errores en la sustitución hacia adelante (forward substitution) al resolver Ly = b.'
          },
          {
            num: 5,
            titulo: 'Semana 4: Inversa de una Matriz 2x2',
            ra: 'RA2.3-RA2.5',
            raDescripcion: 'Cálculo de determinante e inversa de una matriz 2x2.',
            enunciado: 'Dada A = [3 5; 1 2], determine su determinante det A y su matriz inversa A⁻¹.',
            opciones: [
              { id: 'a', texto: 'det A = 1 y A⁻¹ = [2 -5; -1 3]' },
              { id: 'b', texto: 'det A = 1 y A⁻¹ = [-2 5; 1 -3]' },
              { id: 'c', texto: 'det A = 11 y A⁻¹ = (1/11)[2 -5; -1 3]' },
              { id: 'd', texto: 'det A = 0 (matriz singular).' }
            ],
            correcta: 'a',
            explicacion: 'det A = (3)(2) - (5)(1) = 6 - 5 = 1. Para A = [a b; c d], A⁻¹ = (1/det A)[d -b; -c a] = [2 -5; -1 3].',
            falencia: 'Intercambio incorrecto de elementos o signos en la fórmula de la adjunta para matrices 2x2.'
          },
          {
            num: 6,
            titulo: 'Semana 5: Inversión por Gauss-Jordan [A|I]',
            ra: 'RA2.6-RA2.7',
            raDescripcion: 'Algoritmo de Gauss-Jordan para hallar la inversa de una matriz 3x3.',
            enunciado: 'Halle A⁻¹ para A = [1 2 1; 0 1 2; 0 0 1] reduciendo la matriz aumentada [A|I].',
            opciones: [
              { id: 'a', texto: 'A⁻¹ = [1 -2 3; 0 1 -2; 0 0 1]' },
              { id: 'b', texto: 'A⁻¹ = [1 2 -3; 0 1 2; 0 0 1]' },
              { id: 'c', texto: 'A⁻¹ = [1 -2 1; 0 1 -2; 0 0 1]' },
              { id: 'd', texto: 'A⁻¹ = [1 0 0; -2 1 0; 3 -2 1]' }
            ],
            correcta: 'a',
            explicacion: 'F1 ← F1 - F3 nos da [1 2 0 | 1 0 -1]. F2 ← F2 - 2F3 nos da [0 1 0 | 0 1 -2]. Luego F1 ← F1 - 2F2 nos da [1 0 0 | 1 -2 3]. Por tanto A⁻¹ = [1 -2 3; 0 1 -2; 0 0 1].',
            falencia: 'Dificultad al eliminar elementos por encima de la diagonal principal en la fase hacia atrás de Gauss-Jordan.'
          },
          {
            num: 7,
            titulo: 'Semana 5: Factorización LU y Solución de Sistemas',
            ra: 'RA2.6-RA2.7',
            raDescripcion: 'Descomposición LU de una matriz 2x2 y solución de Ax = b.',
            enunciado: 'Dada A = [2 1; 6 5] y b = (5, 19)^T. Halle L, U y la solución x.',
            opciones: [
              { id: 'a', texto: 'L = [1 0; 3 1], U = [2 1; 0 2], x = (1.5, 2)^T' },
              { id: 'b', texto: 'L = [1 0; -3 1], U = [2 1; 0 5], x = (2, 1)^T' },
              { id: 'c', texto: 'L = [1 0; 3 1], U = [2 1; 0 2], x = (1, 3)^T' },
              { id: 'd', texto: 'L = [2 0; 6 5], U = [1 0; 0 1], x = (3, 2)^T' }
            ],
            correcta: 'a',
            explicacion: 'F2 ← F2 - 3F1 transforma A en U = [2 1; 0 2]. El multiplicador es l21 = 3, así L = [1 0; 3 1]. Para b=(5,19): Ly=b ⇒ y1=5, 3(5)+y2=19 ⇒ y2=4. Luego Ux=y ⇒ 2x2=4 ⇒ x2=2, 2x1+2=5 ⇒ x1=1.5.',
            falencia: 'Errores en el cálculo del multiplicador l21 o en la sustitución de la matriz U.'
          }
        ]
      }
    ];

    try {
      await this.ensureQuicesTable();
      const { rows } = await this.db.query(
        `SELECT id, titulo, tipo, semana_numero AS "semanaNumero", semana_id AS "semanaId", descripcion, preguntas FROM quices WHERE materia_id = $1 ORDER BY creado_en DESC`,
        [matId],
      );

      const quicesPersonalizados = rows.map((r: any) => ({
        id: r.id,
        titulo: r.titulo,
        tipo: r.tipo || 'ordinario',
        semanaNumero: r.semanaNumero || '01-16',
        semanaId: r.semanaId || 1,
        descripcion: r.descripcion || '',
        esPersonalizado: true,
        preguntas: typeof r.preguntas === 'string' ? JSON.parse(r.preguntas) : (r.preguntas || [])
      }));

      return [...quicesBase, ...quicesPersonalizados];
    } catch (err) {
      console.error('Error cargando quices personalizados de PostgreSQL:', err);
      return quicesBase;
    }
  }

  @Post('docente/quices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async crearQuizDocente(@Body() body: any) {
    await this.ensureQuicesTable();

    const { id, titulo, tipo, semanaNumero, semanaId, descripcion, preguntas, materiaId } = body;

    if (!titulo || !titulo.trim()) {
      return { status: 'error', mensaje: 'El título del quiz es obligatorio.' };
    }

    if (!preguntas || !Array.isArray(preguntas) || preguntas.length === 0) {
      return { status: 'error', mensaje: 'El quiz debe contener al menos 1 pregunta.' };
    }

    const quizId = id || `quiz_custom_${Date.now()}`;
    const matId = materiaId ? parseInt(String(materiaId), 10) : 1;
    const semId = semanaId ? parseInt(String(semanaId), 10) : 1;
    const semNum = semanaNumero || '01-16';

    const { rows } = await this.db.query(
      `INSERT INTO quices (id, materia_id, titulo, tipo, semana_numero, semana_id, descripcion, preguntas)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE SET
         materia_id = EXCLUDED.materia_id,
         titulo = EXCLUDED.titulo,
         tipo = EXCLUDED.tipo,
         semana_numero = EXCLUDED.semana_numero,
         semana_id = EXCLUDED.semana_id,
         descripcion = EXCLUDED.descripcion,
         preguntas = EXCLUDED.preguntas
       RETURNING id, titulo, tipo, semana_numero AS "semanaNumero", semana_id AS "semanaId", descripcion, preguntas`,
      [quizId, matId, titulo.trim(), tipo || 'ordinario', semNum, semId, descripcion || '', JSON.stringify(preguntas)],
    );

    return {
      status: 'ok',
      mensaje: `Quiz '${titulo}' guardado exitosamente en la base de datos PostgreSQL.`,
      quiz: {
        ...rows[0],
        esPersonalizado: true,
        preguntas: typeof rows[0].preguntas === 'string' ? JSON.parse(rows[0].preguntas) : rows[0].preguntas
      }
    };
  }

  @Post('docente/generar-quiz-aleatorio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async generarQuizAleatorioBD(@Body() body: any) {
    await this.ensureQuicesTable();
    const { materiaId, semanaIds, cantidad, titulo, tipo } = body;

    const cant = Math.max(1, Math.min(30, parseInt(String(cantidad || 5), 10)));
    const sIds = Array.isArray(semanaIds) && semanaIds.length > 0
      ? semanaIds.map((s: any) => parseInt(String(s), 10))
      : [1, 2, 3];
    const matIdFiltro = materiaId ? parseInt(String(materiaId), 10) : 1;

    // Consultar preguntas al azar de la tabla preguntas en PostgreSQL
    const { rows: preguntasBD } = await this.db.query(
      `SELECT p.id, p.semana_id AS "semanaId", s.numero AS "semanaNumero", s.unidad_nombre AS "unidadNombre",
              s.ra, s.ra_descripcion AS "raDescripcion", p.tipo, p.pregunta AS "enunciado",
              p.opciones, p.correcta, p.explicacion, p.falencia
       FROM preguntas p
       JOIN semanas s ON s.id = p.semana_id
       WHERE p.semana_id = ANY($1::int[]) AND s.materia_id = $2
       ORDER BY RANDOM()
       LIMIT $3`,
      [sIds, matIdFiltro, cant],
    );

    if (preguntasBD.length === 0) {
      // Fallback: si las semanas elegidas aún no tienen preguntas cargadas, buscar en otras
      // semanas de LA MISMA materia (nunca de materias ajenas).
      const { rows: fallbackRows } = await this.db.query(
        `SELECT p.id, p.semana_id AS "semanaId", s.numero AS "semanaNumero", s.unidad_nombre AS "unidadNombre",
                s.ra, s.ra_descripcion AS "raDescripcion", p.tipo, p.pregunta AS "enunciado",
                p.opciones, p.correcta, p.explicacion, p.falencia
         FROM preguntas p
         JOIN semanas s ON s.id = p.semana_id
         WHERE s.materia_id = $1
         ORDER BY RANDOM()
         LIMIT $2`,
        [matIdFiltro, cant],
      );
      preguntasBD.push(...fallbackRows);
    }

    const preguntasFormateadas = preguntasBD.map((p: any, idx: number) => {
      let opciones = p.opciones;
      if (typeof opciones === 'string') {
        try { opciones = JSON.parse(opciones); } catch (_) {}
      }
      if (!Array.isArray(opciones)) {
        opciones = [
          { id: 'a', texto: 'Opción A' },
          { id: 'b', texto: 'Opción B' },
          { id: 'c', texto: 'Opción C' },
          { id: 'd', texto: 'Opción D' }
        ];
      }

      return {
        num: idx + 1,
        titulo: `Semana ${p.semanaNumero}: ${p.unidadNombre || 'Evaluación de Contenido'}`,
        ra: p.ra || `RA${p.semanaId}.1`,
        raDescripcion: p.raDescripcion || 'Comprensión y aplicación de conceptos de Álgebra Lineal',
        enunciado: p.enunciado,
        opciones,
        correcta: (p.correcta || 'a').toLowerCase(),
        explicacion: p.explicacion || 'Explicación del procedimiento según el banco oficial.',
        falencia: p.falencia || 'Error de procedimiento o concepto durante el desarrollo.'
      };
    });

    const semNumStr = sIds.map((s: number) => String(s).padStart(2, '0')).join(', ');
    const tituloFinal = (titulo && titulo.trim())
      ? titulo.trim()
      : `Quiz Aleatorio (${cant} Preguntas) — Semanas ${semNumStr}`;

    const quizId = `quiz_random_${Date.now()}`;
    const matId = materiaId ? parseInt(String(materiaId), 10) : 1;

    const { rows } = await this.db.query(
      `INSERT INTO quices (id, materia_id, titulo, tipo, semana_numero, semana_id, descripcion, preguntas)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, titulo, tipo, semana_numero AS "semanaNumero", semana_id AS "semanaId", descripcion, preguntas`,
      [
        quizId,
        matId,
        tituloFinal,
        tipo || 'ordinario',
        semNumStr,
        sIds[0] || 1,
        `Quiz aleatorio generado con ${preguntasFormateadas.length} preguntas extraídas al azar del banco de PostgreSQL.`,
        JSON.stringify(preguntasFormateadas)
      ],
    );

    return {
      status: 'ok',
      mensaje: `Quiz aleatorio generado exitosamente con ${preguntasFormateadas.length} preguntas del banco de datos.`,
      quiz: {
        ...rows[0],
        esPersonalizado: true,
        preguntas: preguntasFormateadas
      }
    };
  }

  @Delete('docente/quices/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async eliminarQuizDocente(@Param('id') id: string) {
    await this.ensureQuicesTable();
    await this.db.query('DELETE FROM quices WHERE id = $1', [id]);
    return { status: 'ok', mensaje: 'Quiz eliminado exitosamente de la base de datos PostgreSQL' };
  }

  @Post('docente/generar-parciales-individuales-ra')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async generarParcialesIndividualesRA(@Body() body: any) {
    const { materiaId, estudianteIds, cantidadPreguntas, tituloExamen } = body;
    const matId = materiaId ? parseInt(String(materiaId), 10) : 1;
    const cantPreg = Math.max(1, Math.min(20, parseInt(String(cantidadPreguntas || 5), 10)));
    const titulo = (tituloExamen && tituloExamen.trim())
      ? tituloExamen.trim()
      : 'Parcial de Recuperación Adaptativo por Objetivos de Aprendizaje (RA)';

    // 1. Obtener la materia
    const { rows: matRows } = await this.db.query(
      `SELECT nombre FROM materias WHERE id = $1`,
      [matId],
    );
    const materiaNombre = matRows[0]?.nombre || 'Álgebra Lineal 2026';

    // 2. Obtener lista de estudiantes
    let queryEst = `
      SELECT u.id, u.nombre, u.email, u.documento_identidad AS "documentoIdentidad"
      FROM inscripciones i
      JOIN usuarios u ON u.id = i.estudiante_id
      WHERE i.materia_id = $1
    `;
    const paramsEst: any[] = [matId];

    if (Array.isArray(estudianteIds) && estudianteIds.length > 0) {
      paramsEst.push(estudianteIds.map((id: any) => parseInt(String(id), 10)));
      queryEst += ` AND u.id = ANY($2::int[])`;
    }
    queryEst += ` ORDER BY u.nombre`;

    const { rows: estudiantes } = await this.db.query(queryEst, paramsEst);

    if (estudiantes.length === 0) {
      // Fallback si no hay inscritos en la materia: usar usuarios de rol ESTUDIANTE
      const { rows: fallbackEst } = await this.db.query(
        `SELECT id, nombre, email, documento_identidad AS "documentoIdentidad"
         FROM usuarios WHERE rol = 'ESTUDIANTE' OR documento_identidad IS NOT NULL
         ORDER BY nombre LIMIT 30`,
      );
      estudiantes.push(...fallbackEst);
    }

    // 3. Obtener quices disponibles para saber la correspondencia de preguntas e intentos
    const quicesData = await this.obtenerQuicesAlgebra(String(matId));

    // 4. Para cada estudiante, analizar sus intentos guardados en intentos_examen
    const examenesEstudiantes: any[] = [];

    for (const est of estudiantes) {
      const { rows: intentos } = await this.db.query(
        `SELECT respuestas, nota5, porcentaje, aprobado, fecha
         FROM intentos_examen
         WHERE estudiante_id = $1
         ORDER BY fecha DESC`,
        [est.id],
      );

      const rasFallados = new Set<string>();

      // Analizar los intentos para encontrar las falencias del estudiante
      intentos.forEach((intento: any) => {
        let respObj: any = null;
        if (typeof intento.respuestas === 'string') {
          try { respObj = JSON.parse(intento.respuestas); } catch (_) {}
        } else {
          respObj = intento.respuestas;
        }

        if (respObj) {
          const qId = respObj.quizId;
          const selec = respObj.respuestasSeleccionadas || [];
          const quizFound = quicesData.find((q: any) => q.id === qId);

          if (quizFound && Array.isArray(quizFound.preguntas)) {
            quizFound.preguntas.forEach((p: any, idx: number) => {
              const respEst = (selec[idx] || '').toLowerCase();
              if (respEst !== String(p.correcta ?? '').toLowerCase()) {
                if (p.ra) rasFallados.add(p.ra);
              }
            });
          }
        }
      });

      const listaRasFallados = Array.from(rasFallados);
      let preguntasEstudiante: any[] = [];

      // Si el estudiante tiene RAs fallados, buscar preguntas específicas para esos RAs
      if (listaRasFallados.length > 0) {
        const { rows: pregRa } = await this.db.query(
          `SELECT p.id, p.semana_id AS "semanaId", s.numero AS "semanaNumero", s.unidad_nombre AS "unidadNombre",
                  s.ra, s.ra_descripcion AS "raDescripcion", p.tipo, p.pregunta AS "enunciado",
                  p.opciones, p.correcta, p.explicacion, p.falencia
           FROM preguntas p
           JOIN semanas s ON s.id = p.semana_id
           WHERE s.materia_id = $2 AND s.ra = ANY($1::varchar[])
           ORDER BY RANDOM()
           LIMIT $3`,
          [listaRasFallados, matId, cantPreg],
        );
        preguntasEstudiante = pregRa;
      }

      // Si aún no completa la cantidad requerida (o no tenía intentos previos), completar con preguntas generales de la materia
      if (preguntasEstudiante.length < cantPreg) {
        const faltantes = cantPreg - preguntasEstudiante.length;
        const idsExistentes = preguntasEstudiante.map(p => p.id);

        const { rows: pregGen } = await this.db.query(
          `SELECT p.id, p.semana_id AS "semanaId", s.numero AS "semanaNumero", s.unidad_nombre AS "unidadNombre",
                  s.ra, s.ra_descripcion AS "raDescripcion", p.tipo, p.pregunta AS "enunciado",
                  p.opciones, p.correcta, p.explicacion, p.falencia
           FROM preguntas p
           JOIN semanas s ON s.id = p.semana_id
           WHERE s.materia_id = $1 AND NOT (p.id = ANY($2::varchar[]))
           ORDER BY RANDOM()
           LIMIT $3`,
          [matId, idsExistentes.length > 0 ? idsExistentes : ['none'], faltantes],
        );
        preguntasEstudiante.push(...pregGen);
      }

      // Formatear preguntas para la impresión del parcial del estudiante
      const preguntasFinales = preguntasEstudiante.map((p: any, idx: number) => {
        let opciones = p.opciones;
        if (typeof opciones === 'string') {
          try { opciones = JSON.parse(opciones); } catch (_) {}
        }
        if (!Array.isArray(opciones)) {
          opciones = [
            { id: 'a', texto: 'Opción A' },
            { id: 'b', texto: 'Opción B' },
            { id: 'c', texto: 'Opción C' },
            { id: 'd', texto: 'Opción D' }
          ];
        }

        return {
          num: idx + 1,
          titulo: `Semana ${p.semanaNumero}: ${p.unidadNombre || 'Evaluación de Tema'}`,
          ra: p.ra || `RA${p.semanaId}.1`,
          raDescripcion: p.raDescripcion || 'Comprensión y aplicación de conceptos de Álgebra Lineal',
          enunciado: p.enunciado,
          opciones,
          correcta: (p.correcta || 'a').toLowerCase(),
          explicacion: p.explicacion || 'Explicación del procedimiento.',
          falencia: p.falencia || 'Error frecuente de concepto.'
        };
      });

      examenesEstudiantes.push({
        estudianteId: est.id,
        estudianteNombre: est.nombre,
        estudianteCodigo: est.documentoIdentidad || `EST-${est.id}`,
        estudianteEmail: est.email,
        rasParaReforzar: listaRasFallados.length > 0 ? listaRasFallados : ['Diagnóstico General de la Asignatura'],
        totalIntentosPrevios: intentos.length,
        preguntas: preguntasFinales
      });
    }

    return {
      status: 'ok',
      mensaje: `Generados exitosamente ${examenesEstudiantes.length} parciales adaptativos individuales por RA.`,
      materiaNombre,
      tituloExamen: titulo,
      fechaGeneracion: new Date().toISOString(),
      examenesEstudiantes
    };
  }


  @Post('docente/ingresar-respuestas-manuales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async ingresarRespuestasManuales(@Body() body: any) {
    const { estudianteId, quizId, tipoEvaluacion, respuestas, estudianteNombre, noPresento: noPresentoBody, materiaId } = body;
    const quices = await this.obtenerQuicesAlgebra(materiaId ? String(materiaId) : undefined);
    const quizSel = quices.find((q: any) => q.id === quizId) || quices[0];

    const esNoPresentoExplicit = !!noPresentoBody || tipoEvaluacion === 'no_presento' ||
      (Array.isArray(respuestas) && respuestas.length > 0 && respuestas.every((r: any) => String(r).toLowerCase() === 'np' || String(r).toLowerCase() === 'no_presento'));

    let aciertos = 0;
    const totalPreguntas = quizSel.preguntas.length;
    const desgloses: any[] = [];
    const fortalezasSet = new Set<string>();
    const falenciasList: any[] = [];

    quizSel.preguntas.forEach((p: any, idx: number) => {
      const rawResp = (respuestas && respuestas[idx]) ? String(respuestas[idx]).toLowerCase() : 'sin_respuesta';
      const esNP = esNoPresentoExplicit || rawResp === 'np' || rawResp === 'no_presento';
      const esSinRespuesta = !esNP && (!rawResp || rawResp === 'sin_respuesta' || rawResp === 'nr' || rawResp === 'n/r');
      const correcta = String(p.correcta ?? '').toLowerCase();
      const esCorrecta = !esNP && !esSinRespuesta && correcta !== '' && rawResp === correcta;
      const respDisplay = esNP ? 'NO PRESENTÓ (NP)' : esSinRespuesta ? 'SIN RESPUESTA (N/R)' : rawResp.toUpperCase();

      if (esCorrecta) {
        aciertos++;
        fortalezasSet.add(`${p.ra}: ${p.raDescripcion}`);
      } else {
        falenciasList.push({
          num: p.num,
          titulo: p.titulo,
          ra: p.ra,
          raDescripcion: p.raDescripcion,
          respuestaEstudiante: respDisplay,
          respuestaCorrecta: correcta.toUpperCase(),
          explicacion: p.explicacion,
          falencia: esNP
            ? 'Estudiante ausente / No presentó la prueba (NP).'
            : esSinRespuesta
            ? 'Pregunta no contestada por el estudiante durante la prueba (N/R).'
            : p.falencia,
          recomendacion: esNP
            ? `Programar prueba de reposición / RQuiz para evaluar la temática de ${p.titulo} (${p.ra}).`
            : `Reforzar la temática de ${p.titulo} (${p.ra}). Repasar las notas de clase y ejemplos resueltos de la semana correspondiente.`
        });
      }

      desgloses.push({
        num: p.num,
        titulo: p.titulo,
        ra: p.ra,
        respuestaEstudiante: respDisplay,
        respuestaCorrecta: correcta.toUpperCase(),
        esCorrecta
      });
    });

    const porcentaje = esNoPresentoExplicit ? 0 : Math.round((aciertos / (totalPreguntas || 1)) * 100);
    const nota5 = esNoPresentoExplicit ? 0.0 : Number(((aciertos / (totalPreguntas || 1)) * 5.0).toFixed(1));
    const aprobado = nota5 >= 3.0;

    let intentoGuardado: any = null;

    if (estudianteId && Number(estudianteId) > 0) {
      try {
        const { rows } = await this.db.query(
          `INSERT INTO intentos_examen
             (estudiante_id, semana_id, nota5, porcentaje, aprobado, infraccion_ia, tiempo_empleado_seg, respuestas)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
           RETURNING id, fecha`,
          [
            estudianteId,
            quizSel.semanaId || 1,
            nota5,
            porcentaje,
            aprobado,
            false,
            0,
            JSON.stringify({
              quizId: quizSel.id,
              tipoEvaluacion: esNoPresentoExplicit ? 'no_presento' : (tipoEvaluacion || quizSel.tipo),
              noPresento: esNoPresentoExplicit,
              respuestasSeleccionadas: respuestas || []
            }),
          ],
        );
        intentoGuardado = rows[0];
      } catch (err) {
        console.error('Error guardando intento manual docente:', err);
      }
    }

    return {
      status: 'ok',
      mensaje: `Evaluación registrada exitosamente para ${estudianteNombre || 'el estudiante'}${esNoPresentoExplicit ? ' (Marcado como NO PRESENTÓ)' : ''}`,
      resultado: {
        estudianteId,
        estudianteNombre: estudianteNombre || 'Estudiante Evaluado',
        quizId: quizSel.id,
        quizTitulo: quizSel.titulo,
        tipoEvaluacion: esNoPresentoExplicit ? 'no_presento' : (tipoEvaluacion || quizSel.tipo),
        semanaNumero: quizSel.semanaNumero,
        aciertos: esNoPresentoExplicit ? 0 : aciertos,
        totalPreguntas,
        porcentaje,
        nota5,
        aprobado,
        noPresento: esNoPresentoExplicit,
        intentoId: intentoGuardado?.id || null,
        fecha: intentoGuardado?.fecha || new Date().toISOString(),
        desgloses,
        fortalezas: Array.from(fortalezasSet),
        falencias: falenciasList
      }
    };
  }

  @Delete('docente/intentos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async eliminarIntentoDocente(@Param('id') id: string) {
    const intentoId = parseInt(id, 10);
    await this.db.query('DELETE FROM intentos_examen WHERE id = $1', [intentoId]);
    return { status: 'ok', mensaje: 'Registro de calificación eliminado exitosamente de PostgreSQL.' };
  }

  @Put('docente/intentos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCENTE')
  async editarIntentoDocente(@Param('id') id: string, @Body() body: any) {
    const intentoId = parseInt(id, 10);
    const { nota5, porcentaje, aprobado } = body;
    const notaNum = Number(nota5);
    const porcNum = Math.max(0, Math.min(100, Number(porcentaje !== undefined ? porcentaje : Math.round((notaNum / 5.0) * 100))));
    const esAprobado = typeof aprobado === 'boolean' ? aprobado : notaNum >= 3.0;

    const { rows } = await this.db.query(
      `UPDATE intentos_examen
       SET nota5 = $1, porcentaje = $2, aprobado = $3
       WHERE id = $4
       RETURNING id, estudiante_id AS "estudianteId", nota5, porcentaje, aprobado, fecha`,
      [notaNum, porcNum, esAprobado, intentoId]
    );

    return {
      status: 'ok',
      mensaje: 'Calificación actualizada exitosamente en PostgreSQL.',
      intento: rows[0]
    };
  }
}

