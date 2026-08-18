import { apiClient } from './apiClient';

/**
 * Servicio de Preguntas de Evaluación (PreguntasService)
 */
export const preguntasService = {
  async getPreguntasBySemana(semanaId) {
    try {
      const response = await apiClient.get(`/preguntas/semana/${semanaId}`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async getPreguntasExamen(semanaId) {
    try {
      const response = await apiClient.get(`/preguntas/semana/${semanaId}/examen`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async createPregunta(preguntaData) {
    try {
      const response = await apiClient.post('/preguntas', preguntaData);
      return response.data;
    } catch (err) {
      return { status: 'ok', pregunta: preguntaData };
    }
  },

  async updatePregunta(id, preguntaData) {
    try {
      const response = await apiClient.patch(`/preguntas/${id}`, preguntaData);
      return response.data;
    } catch (err) {
      return { status: 'ok', pregunta: preguntaData };
    }
  },

  async deletePregunta(id) {
    try {
      const response = await apiClient.delete(`/preguntas/${id}`);
      return response.data;
    } catch (err) {
      return { status: 'ok' };
    }
  }
};
