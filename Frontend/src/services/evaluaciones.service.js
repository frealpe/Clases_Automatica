import { apiClient } from './apiClient';

/**
 * Servicio de Evaluaciones (EvaluacionesService)
 */
export const evaluacionesService = {
  async submitIntento(intentoData) {
    const response = await apiClient.post('/evaluaciones/submit', intentoData);
    return response.data;
  },

  async getReporteDocente() {
    try {
      const response = await apiClient.get('/evaluaciones/docente/reportes');
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async getQuicesAlgebra(materiaId) {
    try {
      const response = await apiClient.get('/evaluaciones/docente/quices-algebra', {
        params: materiaId ? { materiaId } : {}
      });
      return response.data;
    } catch (err) {
      return [];
    }
  },

  async ingresarRespuestasManuales(data) {
    const response = await apiClient.post('/evaluaciones/docente/ingresar-respuestas-manuales', data);
    return response.data;
  },

  async crearQuiz(quizData) {
    const response = await apiClient.post('/evaluaciones/docente/quices', quizData);
    return response.data;
  },

  async generarQuizAleatorio(data) {
    const response = await apiClient.post('/evaluaciones/docente/generar-quiz-aleatorio', data);
    return response.data;
  },

  async eliminarQuiz(id) {
    const response = await apiClient.delete(`/evaluaciones/docente/quices/${id}`);
    return response.data;
  },

  async generarParcialesIndividualesRA(data) {
    const response = await apiClient.post('/evaluaciones/docente/generar-parciales-individuales-ra', data);
    return response.data;
  },

  async eliminarIntento(id) {
    const response = await apiClient.delete(`/evaluaciones/docente/intentos/${id}`);
    return response.data;
  },

  async editarIntento(id, data) {
    const response = await apiClient.put(`/evaluaciones/docente/intentos/${id}`, data);
    return response.data;
  }
};


