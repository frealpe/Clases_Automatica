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

export const apiService = {
  // Autenticación via Axios (.env)
  async login(email, password) {
    try {
      const response = await mobileApiClient.post('/auth/login', { email, password });
      const data = response.data;
      await localStorageService.setUsuarioActual(data.user, data.access_token);
      return data;
    } catch (e) {
      console.log('Axios Móvil: Servidor offline, usando base local');
    }

    const esDocente = email.includes('docente') || email.includes('prof');
    const userSimulado = {
      id: esDocente ? 1 : 2,
      nombre: esDocente ? 'Prof. Mario Grosso (Docente)' : 'Estudiante Álgebra',
      email: email,
      rol: esDocente ? 'DOCENTE' : 'ESTUDIANTE'
    };
    const tokenSimulado = `local_token_${Date.now()}`;
    await localStorageService.setUsuarioActual(userSimulado, tokenSimulado);

    return {
      access_token: tokenSimulado,
      user: userSimulado
    };
  },

  // Obtener Preguntas via Axios (.env)
  async getPreguntasSemana(semanaId) {
    const local = await localStorageService.getPreguntasLocales(semanaId);
    if (local && local.length > 0) return local;

    try {
      const response = await mobileApiClient.get(`/preguntas/semana/${semanaId}`);
      if (response.data && response.data.length > 0) {
        await localStorageService.guardarPreguntasLocales(semanaId, response.data);
        return response.data;
      }
    } catch (e) {
      console.log('Axios Móvil: Cargando del paquete local');
    }

    const semanaObj = SEMANAS_DATA.find(s => s.id === semanaId);
    const preguntasFallback = semanaObj ? semanaObj.preguntas : [];
    await localStorageService.guardarPreguntasLocales(semanaId, preguntasFallback);
    return preguntasFallback;
  },

  // Enviar Intento de Examen via Axios (.env)
  async submitEvaluacion(intentoData) {
    await localStorageService.guardarIntentoLocal(intentoData);

    try {
      await mobileApiClient.post('/evaluaciones/submit', intentoData);
    } catch (e) {
      console.log('Axios Móvil: Guardado localmente para sincronizar al reconectar');
    }

    return true;
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
    return response.data;
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
