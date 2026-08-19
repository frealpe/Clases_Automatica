import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { materiasService } from '../services/materias.service';
import { preguntasService } from '../services/preguntas.service';
import { semanasService } from '../services/semanas.service';
import { evaluacionesService } from '../services/evaluaciones.service';
import { examenesProgramadosService } from '../services/examenesProgramados.service';

// Diccionario Completo de Planes Semanales Docentes Unicauca por Materia
const PLANES_SEMANALES_MATERIAS = {
  1: [ // Álgebra Lineal (Grossman 7a/8a ed.)
    { id: 1, materiaId: 1, numero: '01', unidad: '1. Sistemas de ecuaciones lineales', ra: 'RA1.1-RA1.2', min: 15, raDescripcion: 'Reconocer la forma general de un sistema de ecuaciones lineales, y resolver e interpretar geométricamente sistemas de dos ecuaciones con dos incógnitas.' },
    { id: 2, materiaId: 1, numero: '02', unidad: '1. Sistemas de ecuaciones lineales', ra: 'RA1.2b-RA1.4', min: 20, raDescripcion: 'Resolver sistemas de m ecuaciones con n incógnitas mediante eliminación de Gauss-Jordan, y reconocer las propiedades particulares de los sistemas homogéneos.' },
    { id: 3, materiaId: 1, numero: '03', unidad: '2. Vectores y matrices', ra: 'RA2.1-RA2.2', min: 20, raDescripcion: 'Vectores y matrices; productos vectorial y matricial.' },
    { id: 4, materiaId: 1, numero: '04', unidad: '2. Vectores y matrices', ra: 'RA2.3-RA2.5', min: 20, raDescripcion: 'Matrices y sistemas de ecuaciones lineales; inversa y transpuesta de una matriz cuadrada.' },
    { id: 5, materiaId: 1, numero: '05', unidad: '2. Vectores y matrices', ra: 'RA2.6-RA2.7', min: 25, raDescripcion: 'Matrices elementales, matrices inversas y factorización LU.' },
    { id: 6, materiaId: 1, numero: '06', unidad: '3. Determinantes', ra: 'RA3.1-RA3.3', min: 25, raDescripcion: 'Definiciones y propiedades de los determinantes, regla de Cramer, determinantes e inversas.' },
    { id: 7, materiaId: 1, numero: '07', unidad: '4. Vectores en R2 y R3', ra: 'RA4.1-RA4.3', min: 20, raDescripcion: 'Vectores en el plano, producto escalar y proyecciones en R2, vectores en el espacio.' },
    { id: 8, materiaId: 1, numero: '08', unidad: '4. Vectores en R2 y R3', ra: 'RA4.4-RA4.5', min: 20, raDescripcion: 'Producto cruz de dos vectores; rectas y planos en el espacio.' },
    { id: 9, materiaId: 1, numero: '09', unidad: '5. Espacios vectoriales', ra: 'RA5.1-RA5.3', min: 25, raDescripcion: 'Definición y propiedades básicas de espacio vectorial, subespacios, combinación lineal y espacio generado.' },
    { id: 10, materiaId: 1, numero: '10', unidad: '5. Espacios vectoriales', ra: 'RA5.4-RA5.5', min: 25, raDescripcion: 'Independencia lineal, bases y dimensión.' },
    { id: 11, materiaId: 1, numero: '11', unidad: '5. Espacios vectoriales', ra: 'RA5.6-RA5.7', min: 25, raDescripcion: 'Rango, nulidad, espacio renglón/columna de una matriz, y cambio de base.' },
    { id: 12, materiaId: 1, numero: '12', unidad: '6. Espacios vectoriales con producto interno', ra: 'RA6.1-RA6.3', min: 25, raDescripcion: 'Bases ortonormales y proyecciones en Rn, aproximación por mínimos cuadrados, espacios con producto interno.' },
    { id: 13, materiaId: 1, numero: '13', unidad: '7. Transformaciones lineales', ra: 'RA7.1-RA7.2', min: 20, raDescripcion: 'Definición y ejemplos de transformaciones lineales; imagen y núcleo.' },
    { id: 14, materiaId: 1, numero: '14', unidad: '7. Transformaciones lineales', ra: 'RA7.3-RA7.4', min: 20, raDescripcion: 'Representación matricial de una transformación lineal; isomorfismos e isometrías.' },
    { id: 15, materiaId: 1, numero: '15', unidad: '8. Valores característicos, vectores característicos y formas canónicas', ra: 'RA8.1-RA8.3', min: 25, raDescripcion: 'Eigenvalores y eigenvectores; matrices semejantes y diagonalización; matrices simétricas y diagonalización ortogonal.' },
    { id: 16, materiaId: 1, numero: '16', unidad: '8. Valores característicos, vectores característicos y formas canónicas', ra: 'RA8.4-RA8.6', min: 30, raDescripcion: 'Formas cuadráticas y secciones cónicas, forma canónica de Jordan, aplicaciones (ecuaciones diferenciales, modelos de población) y cierre del curso.' }
  ],
  2: [ // Programación
    { id: 201, materiaId: 2, numero: '01', unidad: '1. Fundamentos de Algoritmos', ra: 'RA1.1-RA1.2', min: 15, raDescripcion: 'Análisis de problemas, pseudocódigo y diagramas de flujo.' },
    { id: 202, materiaId: 2, numero: '02', unidad: '1. Variables y Tipos de Datos', ra: 'RA1.3-RA1.4', min: 15, raDescripcion: 'Expresiones aritméticas, lógicas y asignación de memoria.' },
    { id: 203, materiaId: 2, numero: '03', unidad: '2. Estructuras Condicionales', ra: 'RA2.1-RA2.2', min: 20, raDescripcion: 'Bifurcaciones if-else, expresiones booleanas y switch-case.' },
    { id: 204, materiaId: 2, numero: '04', unidad: '2. Estructuras Repetitivas', ra: 'RA2.3-RA2.4', min: 20, raDescripcion: 'Bucles while, do-while y for para control iterativo.' },
    { id: 205, materiaId: 2, numero: '05', unidad: '3. Funciones y Modularidad', ra: 'RA3.1-RA3.2', min: 20, raDescripcion: 'Diseño descendente, modularización y paso de parámetros.' },
    { id: 206, materiaId: 2, numero: '06', unidad: '3. Ámbito y Recursión', ra: 'RA3.3-RA3.4', min: 20, raDescripcion: 'Variables locales/globales y funciones recursivas básicas.' },
    { id: 207, materiaId: 2, numero: '07', unidad: '4. Arreglos Unidimensionales', ra: 'RA4.1-RA4.2', min: 25, raDescripcion: 'Vectores, indexación y recorrido con ciclos.' },
    { id: 208, materiaId: 2, numero: '08', unidad: '4. Matrices y Tablas', ra: 'RA4.3-RA4.4', min: 25, raDescripcion: 'Arreglos multidimensionales y álgebra computacional.' },
    { id: 209, materiaId: 2, numero: '09', unidad: '5. Cadenas de Caracteres', ra: 'RA5.1-RA5.2', min: 20, raDescripcion: 'Manipulación de texto, subcadenas y comparación.' },
    { id: 210, materiaId: 2, numero: '10', unidad: '5. Estructuras y Registros', ra: 'RA5.3-RA5.4', min: 20, raDescripcion: 'Modelado de entidades compuestas mediante structs.' },
    { id: 211, materiaId: 2, numero: '11', unidad: '6. Algoritmos de Búsqueda', ra: 'RA6.1-RA6.2', min: 20, raDescripcion: 'Búsqueda lineal y búsqueda binaria eficiente.' },
    { id: 212, materiaId: 2, numero: '12', unidad: '6. Algoritmos de Ordenamiento', ra: 'RA6.3-RA6.4', min: 25, raDescripcion: 'Burbuja, Selección e Inserción directa.' },
    { id: 213, materiaId: 2, numero: '13', unidad: '7. Persistencia y Archivos', ra: 'RA7.1-RA7.2', min: 25, raDescripcion: 'Lectura y escritura de archivos de texto y binarios.' },
    { id: 214, materiaId: 2, numero: '14', unidad: '7. Punteros y Memoria Dinámica', ra: 'RA7.3-RA7.4', min: 25, raDescripcion: 'Direcciones de memoria, punteros y asignación dinámica.' },
    { id: 215, materiaId: 2, numero: '15', unidad: '8. Introducción a POO', ra: 'RA8.1-RA8.2', min: 25, raDescripcion: 'Clases, objetos, atributos y encapsulamiento.' },
    { id: 216, materiaId: 2, numero: '16', unidad: '8. Proyecto de Programación', ra: 'RA8.3-RA8.4', min: 30, raDescripcion: 'Integración de algoritmos y solución de ingeniería.' }
  ],
  3: [ // Visión de Máquina (Semanas 08 a 16)
    { id: 308, materiaId: 3, numero: '08', unidad: '1. Imagen Digital y Espacios de Color', ra: 'RA1.1-RA1.2', min: 20, raDescripcion: 'Muestreo, cuantización, espacios RGB, HSV y escala de grises.' },
    { id: 309, materiaId: 3, numero: '09', unidad: '1. Histogramas y Contraste', ra: 'RA1.3-RA1.4', min: 20, raDescripcion: 'Ecualización de histograma y ajuste de contraste.' },
    { id: 310, materiaId: 3, numero: '10', unidad: '2. Filtrado Espacial', ra: 'RA2.1-RA2.2', min: 25, raDescripcion: 'Convolución 2D, filtro Gaussiano y eliminación de ruido.' },
    { id: 311, materiaId: 3, numero: '11', unidad: '2. Detección de Bordes', ra: 'RA2.3-RA2.4', min: 25, raDescripcion: 'Operadores Sobel, Prewitt, Laplaciano y algoritmo de Canny.' },
    { id: 312, materiaId: 3, numero: '12', unidad: '3. Segmentación de Imágenes', ra: 'RA3.1-RA3.2', min: 25, raDescripcion: 'Umbralización global, Otsu y segmentación por color.' },
    { id: 313, materiaId: 3, numero: '13', unidad: '3. Morfología Matemática', ra: 'RA3.3-RA3.4', min: 25, raDescripcion: 'Erosión, dilatación, apertura, cierre y gradiente morfológico.' },
    { id: 314, materiaId: 3, numero: '14', unidad: '4. Descriptores de Forma', ra: 'RA4.1-RA4.2', min: 25, raDescripcion: 'Contornos, momentos de Hu y descriptores de contorno.' },
    { id: 315, materiaId: 3, numero: '15', unidad: '4. Introducción a CNNs', ra: 'RA4.3-RA4.4', min: 30, raDescripcion: 'Redes neuronales convolucionales para clasificación de imágenes.' },
    { id: 316, materiaId: 3, numero: '16', unidad: '5. Proyecto de Inspección Visual', ra: 'RA5.1-RA5.2', min: 30, raDescripcion: 'Sistema automático de control de calidad por visión industrial.' }
  ],
  4: [ // Énfasis — Nios II sobre FPGA (GPIO/USART/SPI/ADC) + Procesamiento Digital de Señales
    { id: 401, materiaId: 4, numero: '01', unidad: '1. Fundamentos FPGA y Nios II', ra: 'RA1.1-RA1.2', min: 20, raDescripcion: 'Arquitectura de FPGA y del procesador blando Nios II; entorno Quartus y Platform Designer.' },
    { id: 402, materiaId: 4, numero: '02', unidad: '1. Fundamentos FPGA y Nios II', ra: 'RA1.3-RA1.4', min: 20, raDescripcion: 'Construcción de un sistema Nios II básico sobre el bus Avalon: memoria, compilación del hardware y carga en la FPGA.' },
    { id: 403, materiaId: 4, numero: '03', unidad: '2. Periféricos GPIO/USART/SPI', ra: 'RA2.1-RA2.2', min: 20, raDescripcion: 'Diseño e integración del núcleo GPIO (PIO) para entradas y salidas digitales controladas desde Nios II.' },
    { id: 404, materiaId: 4, numero: '04', unidad: '2. Periféricos GPIO/USART/SPI', ra: 'RA2.3-RA2.4', min: 20, raDescripcion: 'Comunicación serial asíncrona (USART) y síncrona (SPI) entre Nios II y periféricos externos.' },
    { id: 405, materiaId: 4, numero: '05', unidad: '3. ADC y adquisición de señal', ra: 'RA3.1-RA3.2', min: 20, raDescripcion: 'Conversión analógico-digital: muestreo, cuantización e interfaz del núcleo ADC con Nios II.' },
    { id: 406, materiaId: 4, numero: '06', unidad: '3. ADC y adquisición de señal', ra: 'RA3.3-RA3.4', min: 20, raDescripcion: 'Adquisición de señales en tiempo real integrando el ADC al sistema Nios II.' },
    { id: 407, materiaId: 4, numero: '07', unidad: '4. Fundamentos de Procesamiento Digital de Señales', ra: 'RA4.1-RA4.2', min: 20, raDescripcion: 'Señales discretas, muestreo y teorema de Nyquist.' },
    { id: 408, materiaId: 4, numero: '08', unidad: '4. Fundamentos de Procesamiento Digital de Señales', ra: 'RA4.3-RA4.4', min: 20, raDescripcion: 'Sistemas LTI y convolución discreta.' },
    { id: 409, materiaId: 4, numero: '09', unidad: '5. Filtrado digital', ra: 'RA5.1-RA5.2', min: 25, raDescripcion: 'Diseño de filtros FIR pasa-bajas.' },
    { id: 410, materiaId: 4, numero: '10', unidad: '5. Filtrado digital', ra: 'RA5.3-RA5.4', min: 25, raDescripcion: 'Diseño de filtros FIR pasa-altas.' },
    { id: 411, materiaId: 4, numero: '11', unidad: '5. Filtrado digital', ra: 'RA5.5-RA5.6', min: 25, raDescripcion: 'Implementación de filtros digitales en Nios II (C/HAL) — primera etapa.' },
    { id: 412, materiaId: 4, numero: '12', unidad: '5. Filtrado digital', ra: 'RA5.7-RA5.8', min: 25, raDescripcion: 'Implementación y validación de filtros digitales en Nios II sobre señal adquirida por el ADC.' },
    { id: 413, materiaId: 4, numero: '13', unidad: '6. Análisis frecuencial y FFT', ra: 'RA6.1-RA6.2', min: 25, raDescripcion: 'Transformada de Fourier discreta (DFT).' },
    { id: 414, materiaId: 4, numero: '14', unidad: '6. Análisis frecuencial y FFT', ra: 'RA6.3-RA6.4', min: 25, raDescripcion: 'Algoritmo FFT y análisis de su complejidad computacional.' },
    { id: 415, materiaId: 4, numero: '15', unidad: '6. Análisis frecuencial y FFT', ra: 'RA6.5-RA6.6', min: 25, raDescripcion: 'Implementación de la FFT en Nios II sobre una señal adquirida por el ADC.' },
    { id: 416, materiaId: 4, numero: '16', unidad: '16. Proyecto integrador', ra: 'RA7.1-RA7.2', min: 30, raDescripcion: 'Cadena completa de procesamiento: ADC → filtro digital → FFT → salida por GPIO/USART/SPI.' }
  ]
};

// Asignaturas iniciales pre-pobladas alineadas con PostgreSQL
const ASIGNATURAS_POSTGRESQL = [
  { id: 1, codigo: 'MAT-101', nombre: 'Álgebra Lineal 2026', descripcion: 'Curso oficial de Álgebra Lineal (Grossman 7a/8a ed.) — Departamento de Instrumentación y Control', semestre: '2026-1' },
  { id: 2, codigo: 'PRG-201', nombre: 'Programación', descripcion: 'Algoritmos, estructuras de datos y programación estructurada en C/C++', semestre: '2026-1' },
  { id: 3, codigo: 'VIS-301', nombre: 'Visión de Máquina', descripcion: 'Procesamiento digital de imágenes, visión por computador e inspección visual', semestre: '2026-1' },
  { id: 4, codigo: 'ENF-401', nombre: 'Énfasis / Electivas', descripcion: 'Procesador Nios II sobre FPGA (GPIO, USART, SPI, ADC) y Procesamiento Digital de Señales', semestre: '2026-1' }
];

export const useCourseStore = create((set, get) => ({
  materias: ASIGNATURAS_POSTGRESQL,
  materiaActivaId: 1,
  semanas: PLANES_SEMANALES_MATERIAS[1],
  semanaSeleccionadaId: 1,
  preguntasMap: {},
  examenesProgramados: [],
  reportes: {
    totalEvaluaciones: 12,
    aprobadosCount: 10,
    infraccionesCount: 1,
    intentos: []
  },

  tokenJWT: localStorage.getItem('jwt_token') || null,
  usuario: JSON.parse(localStorage.getItem('user_data') || 'null'),
  themeMode: localStorage.getItem('theme_mode') || 'light',

  toggleThemeMode: () => {
    const nuevo = get().themeMode === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme_mode', nuevo);
    set({ themeMode: nuevo });
  },

  cargarReportesFromService: async () => {
    const data = await evaluacionesService.getReporteDocente();
    if (data && data.resumenGrupov) {
      set({
        reportes: {
          totalEvaluaciones: data.resumenGrupov.totalEvaluaciones,
          aprobadosCount: data.resumenGrupov.aprobadosCount,
          infraccionesCount: data.resumenGrupov.infraccionesCount,
          intentos: (data.intentos || []).map((i) => ({
            estudiante: i.estudianteNombre,
            semana: i.semanaNumero,
            nota: i.nota5,
            tiempo: `${Math.round(i.tiempoEmpleadoSeg / 60)} min`,
            infraccion: i.infraccionIA
          }))
        }
      });
    }
  },

  // Integración Dinámica con MateriasService (GET /materias desde NestJS / PostgreSQL)
  // list === null solo ocurre ante un fallo de red real (no ante una lista vacía legítima, p.
  // ej. un docente sin materias asignadas), y en ese caso se conserva lo que ya había en pantalla.
  cargarMateriasFromService: async () => {
    const list = await materiasService.getMaterias();
    if (Array.isArray(list)) {
      set((state) => {
        // Si la materia activa (por defecto la 1, "Álgebra Lineal") no está entre las que este
        // usuario puede ver/administrar (p. ej. un DOCENTE cuya única materia tiene otro id),
        // se corrige a la primera disponible — si no, quedan peticiones a la materia equivocada
        // (403 en endpoints que sí validan propiedad, datos de otro curso en los que no validan).
        const activaSigueValida = list.some((m) => m.id === state.materiaActivaId);
        return {
          materias: list,
          materiaActivaId: activaSigueValida ? state.materiaActivaId : (list[0]?.id ?? state.materiaActivaId)
        };
      });
    }
  },

  setMateriaActiva: (materiaId) => {
    const semMateria = PLANES_SEMANALES_MATERIAS[materiaId] || [];
    set({
      materiaActivaId: materiaId,
      semanas: semMateria,
      semanaSeleccionadaId: semMateria[0]?.id || null,
      preguntasMap: {}
    });
    get().cargarSemanasFromService(materiaId);
  },

  // Integración con SemanasService
  cargarSemanasFromService: async (materiaId = 1) => {
    const list = await semanasService.getSemanas(materiaId);
    if (list && list.length > 0) {
      const normalizadas = list.map((s) => ({
        id: s.id,
        materiaId: s.materiaId,
        numero: s.numero,
        unidadNombre: s.unidadNombre,
        unidad: `${s.unidadNombre} (${s.capituloGrossman || 'Unidad'})`,
        ra: s.ra,
        raDescripcion: s.raDescripcion,
        objetivos: Array.isArray(s.objetivosJson) && s.objetivosJson.length > 0
          ? s.objetivosJson
          : [{ ra: s.ra || '', descripcion: s.raDescripcion || '' }],
        min: s.duracionExamenMin,
        preguntasExamenCount: s.preguntasExamenCount ?? null,
        contenidoJson: s.contenidoJson || null,
        notasPdfUrl: s.notasPdfUrl || null,
        guiaPdfUrl: s.guiaPdfUrl || null,
        diapositivasPdfUrl: s.diapositivasPdfUrl || null,
        claseWebUrl: s.claseWebUrl || null,
        ejerciciosResueltosUrl: s.ejerciciosResueltosUrl || null,
        bancoPreguntasUrl: s.bancoPreguntasUrl || null
      }));
      set({ semanas: normalizadas, semanaSeleccionadaId: normalizadas[0]?.id || null });
    } else {
      const semResp = PLANES_SEMANALES_MATERIAS[materiaId] || [];
      set({ semanas: semResp, semanaSeleccionadaId: semResp[0]?.id || null });
    }
  },

  agregarMateria: async (nuevaMateria) => {
    const res = await materiasService.createMateria(nuevaMateria);
    const materiaGuardada = res.materia || { ...nuevaMateria, id: Date.now() };

    set((state) => ({
      materias: [...state.materias, materiaGuardada],
      materiaActivaId: materiaGuardada.id
    }));
  },

  loginWithJWT: async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('jwt_token', data.access_token);
    localStorage.setItem('user_data', JSON.stringify(data.user));

    set({
      tokenJWT: data.access_token,
      usuario: data.user
    });

    // Cargar materias dinámicas desde PostgreSQL tras autenticación exitosa
    get().cargarMateriasFromService();

    return { ok: true, user: data.user };
  },

  registrarWithJWT: async (datos) => {
    const data = await authService.registrar(datos);
    localStorage.setItem('jwt_token', data.access_token);
    localStorage.setItem('user_data', JSON.stringify(data.user));

    set({
      tokenJWT: data.access_token,
      usuario: data.user
    });

    get().cargarMateriasFromService();
    return { ok: true, user: data.user };
  },

  logoutJWT: () => {
    authService.logout();
    set({ tokenJWT: null, usuario: null });
  },

  setSemanaSeleccionada: (semanaId) => set({ semanaSeleccionadaId: semanaId }),

  cargarPreguntasFromService: async (semanaId) => {
    const lista = await preguntasService.getPreguntasBySemana(semanaId);
    if (lista && lista.length > 0) {
      set((state) => ({
        preguntasMap: { ...state.preguntasMap, [semanaId]: lista }
      }));
    }
    return lista || [];
  },

  // Preguntas para que el ESTUDIANTE presente el examen web: N preguntas aleatorias del banco
  // (configurable por sesión); no se cachea en preguntasMap porque cada intento sortea un
  // subconjunto/orden distinto.
  cargarPreguntasExamenFromService: async (semanaId) => {
    const lista = await preguntasService.getPreguntasExamen(semanaId);
    return lista || [];
  },

  agregarPregunta: async (nueva) => {
    const sId = nueva.semanaId || get().semanaSeleccionadaId;
    const listaActual = get().preguntasMap[sId] || [];

    const res = await preguntasService.createPregunta({ ...nueva, semanaId: sId });
    const preguntaGuardada = res.pregunta || { ...nueva, id: `s${sId}_p${Date.now()}`, semanaId: sId };

    set((state) => ({
      preguntasMap: {
        ...state.preguntasMap,
        [sId]: [...listaActual, preguntaGuardada]
      }
    }));
  },

  editarPregunta: async (id, actualizada) => {
    const sId = get().semanaSeleccionadaId;
    await preguntasService.updatePregunta(id, actualizada);

    set((state) => {
      const listaActual = state.preguntasMap[sId] || [];
      return {
        preguntasMap: {
          ...state.preguntasMap,
          [sId]: listaActual.map(p => p.id === id ? { ...p, ...actualizada } : p)
        }
      };
    });
  },

  eliminarPregunta: async (id) => {
    const sId = get().semanaSeleccionadaId;
    await preguntasService.deletePregunta(id);

    set((state) => {
      const listaActual = state.preguntasMap[sId] || [];
      return {
        preguntasMap: {
          ...state.preguntasMap,
          [sId]: listaActual.filter(p => p.id !== id)
        }
      };
    });
  },

  // Integración con ExamenesProgramadosService: calendario de pruebas virtuales por materia
  // (vista DOCENTE) — list === null solo ante fallo de red real, se conserva lo ya cargado.
  cargarExamenesMateriaFromService: async (materiaId) => {
    const lista = await examenesProgramadosService.getExamenesPorMateria(materiaId);
    if (Array.isArray(lista)) {
      set({ examenesProgramados: lista });
    }
  },

  // Agenda de exámenes programados de TODAS las materias en las que el ESTUDIANTE está inscrito.
  cargarMisExamenesFromService: async () => {
    const lista = await examenesProgramadosService.getMisExamenes();
    if (Array.isArray(lista)) {
      set({ examenesProgramados: lista });
    }
  },

  // Los errores de validación (fechas, banco insuficiente, etc.) se propagan al llamador para
  // que el formulario los muestre — no se enmascaran, a diferencia de agregarMateria/agregarPregunta.
  crearExamenProgramado: async (payload) => {
    const res = await examenesProgramadosService.crearExamen(payload);
    set((state) => ({ examenesProgramados: [...state.examenesProgramados, res.examen] }));
    return res.examen;
  },

  editarExamenProgramado: async (id, payload) => {
    const res = await examenesProgramadosService.editarExamen(id, payload);
    set((state) => ({
      examenesProgramados: state.examenesProgramados.map((e) => (e.id === id ? res.examen : e))
    }));
    return res.examen;
  },

  eliminarExamenProgramado: async (id) => {
    const res = await examenesProgramadosService.eliminarExamen(id);
    set((state) => ({
      examenesProgramados: res?.mensaje?.includes('cancel')
        ? state.examenesProgramados.map((e) => (e.id === id ? { ...e, estado: 'cancelado', estadoCalculado: 'cancelado' } : e))
        : state.examenesProgramados.filter((e) => e.id !== id)
    }));
    return res;
  },

  cargarPreguntasExamenProgramadoFromService: async (examenId) => {
    return examenesProgramadosService.getPreguntasExamen(examenId);
  },

  submitExamenProgramadoAction: async (examenId, payload) => {
    return examenesProgramadosService.submitIntento(examenId, payload);
  }
}));
