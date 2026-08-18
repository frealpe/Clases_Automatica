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
  }
};
