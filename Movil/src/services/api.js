import axios from 'axios';
import { localStorageService } from '../database/localStorage';
import { SEMANAS_DATA } from '../data/semanasData';

// Lectura de la URL base desde las variables de entorno de Expo (.env)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Cliente Axios Móvil con Interceptor JWT y variables .env
export const mobileApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

mobileApiClient.interceptors.request.use(async (config) => {
  const token = await localStorageService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza `opciones` a [{id, texto}], igual que el frontend web: la BD puede devolver el
// campo como string JSON, como array de strings, o como objetos con claves distintas
// (letra/opcion/label en vez de id/texto) según cómo se haya cargado la pregunta.
function normalizarListaPreguntas(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map((p) => {
    let opciones = p.opciones;
    if (typeof opciones === 'string') {
      try {
        opciones = JSON.parse(opciones);
      } catch (e) {
        opciones = [];
      }
    }
    if (!Array.isArray(opciones)) opciones = [];

    const opcionesNorm = opciones.map((op, idx) => {
      if (typeof op === 'string') {
        const id = ['a', 'b', 'c', 'd', 'e'][idx] || String(idx);
        return { id, texto: op };
      }
      const id = String(op?.id || op?.letra || ['a', 'b', 'c', 'd', 'e'][idx] || idx);
      const texto = String(op?.texto || op?.opcion || op?.label || JSON.stringify(op));
      return { id, texto };
    });

    return { ...p, opciones: opcionesNorm };
  });
}

export const apiService = {
  // Autenticación via Axios (.env)
  async login(email, password) {
    // El login SIEMPRE se valida contra el servidor. No hay inicio de sesión "offline":
    // fabricar una sesión local (y peor, adivinar el rol por el texto del correo) permitía
    // entrar como DOCENTE sin credenciales. Si el servidor no responde, se propaga el error.
    const response = await mobileApiClient.post('/auth/login', { email, password });
    const data = response.data;
    await localStorageService.setUsuarioActual(data.user, data.access_token);
    return data;
  },

  // Obtener Preguntas via Axios (.env). Usa el endpoint /examen, que NO incluye la respuesta
  // correcta: la calificación la hace el servidor al enviar el intento.
  async getPreguntasSemana(semanaId) {
    const local = await localStorageService.getPreguntasLocales(semanaId);
    if (local && local.length > 0) return normalizarListaPreguntas(local);

    try {
      const response = await mobileApiClient.get(`/preguntas/semana/${semanaId}/examen`);
      if (response.data && response.data.length > 0) {
        const normalizadas = normalizarListaPreguntas(response.data);
        await localStorageService.guardarPreguntasLocales(semanaId, normalizadas);
        return normalizadas;
      }
    } catch (e) {
      console.log('Axios Móvil: Cargando del paquete local');
    }

    const semanaObj = SEMANAS_DATA.find(s => s.id === semanaId);
    const preguntasFallback = normalizarListaPreguntas(semanaObj ? semanaObj.preguntas : []);
    await localStorageService.guardarPreguntasLocales(semanaId, preguntasFallback);
    return preguntasFallback;
  },

  // Enviar Intento de Examen via Axios (.env). Devuelve la respuesta del servidor
  // (incluye `resultado` con la nota calculada y la revisión pregunta a pregunta) o null si
  // no se pudo enviar (queda guardado localmente para reintentar).
  async submitEvaluacion(intentoData) {
    await localStorageService.guardarIntentoLocal(intentoData);

    try {
      const response = await mobileApiClient.post('/evaluaciones/submit', intentoData);
      return response.data;
    } catch (e) {
      console.log('Axios Móvil: Guardado localmente para sincronizar al reconectar');
      return null;
    }
  },

  // Exámenes Programados (calendario) — agrega los de todas las materias inscritas del estudiante
  async getMisExamenesProgramados() {
    try {
      const response = await mobileApiClient.get('/examenes-programados/estudiante/mis-examenes');
      return response.data;
    } catch (e) {
      console.log('Axios Móvil: No se pudieron cargar los exámenes programados');
      return [];
    }
  },

  // Preguntas de un examen programado: solo dentro de su ventana de fecha/hora (403 si no).
  // El error se propaga a propósito (a diferencia de getPreguntasSemana) para que la pantalla
  // pueda mostrar por qué no se pudo presentar (p. ej. la ventana ya cerró).
  async getPreguntasExamenProgramado(examenId) {
    const response = await mobileApiClient.get(`/examenes-programados/${examenId}/preguntas`);
    return { ...response.data, preguntas: normalizarListaPreguntas(response.data?.preguntas) };
  },

  // Enviar intento de un examen programado. También se propaga el error (no hay fallback local
  // razonable: el servidor valida de nuevo la ventana de tiempo al recibir el submit).
  async submitExamenProgramado(examenId, intentoData) {
    const response = await mobileApiClient.post(`/examenes-programados/${examenId}/submit`, intentoData);
    return response.data;
  },

  // Reporte Docente via Axios (.env)
  async getReporteDocente() {
    try {
      const response = await mobileApiClient.get('/evaluaciones/docente/reportes');
      return response.data;
    } catch (e) {
      // Fallback
    }

    const intentosLocales = await localStorageService.getIntentosLocales();
    return {
      resumenGrupov: {
        totalEvaluaciones: intentosLocales.length + 1,
        aprobadosCount: intentosLocales.filter(i => i.aprobado).length + 1,
        infraccionesCount: intentosLocales.filter(i => i.infraccionIA).length,
        tasaAprobacion: '100%'
      },
      intentos: intentosLocales
    };
  },

  // Obtener la lista de materias asociadas al usuario autenticado (docente o estudiante)
  async getMisMaterias() {
    try {
      const response = await mobileApiClient.get('/materias');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {
      console.log('Axios Móvil: Error al consultar /materias, usando fallback local');
    }
    return [
      { id: 1, codigo: 'ALG-101', nombre: 'Álgebra Lineal 2026', descripcion: 'Curso principal de Álgebra Lineal (Grossman 7a/8a ed.)', semestre: '2026-1', numeroSemanas: 16 },
      { id: 2, codigo: 'PRG-201', nombre: 'Programación', descripcion: 'Curso de Lógica de Programación y Estructuras', semestre: '2026-1', numeroSemanas: 16 },
      { id: 3, codigo: 'ENF-301', nombre: 'Énfasis / Electivas', descripcion: 'Asignatura de profundización y aplicación técnica', semestre: '2026-1', numeroSemanas: 16 }
    ];
  },

  // Obtener listado de personas/estudiantes que han presentado exámenes
  async getHistoricoExamenes() {
    try {
      const response = await mobileApiClient.get('/evaluaciones/docente/reportes');
      if (response.data && Array.isArray(response.data.intentos)) {
        return response.data.intentos;
      }
    } catch (e) {
      console.log('Axios Móvil: Consultando intentos registrados localmente');
    }
    const intentosLocales = await localStorageService.getIntentosLocales();
    return intentosLocales;
  }
};
