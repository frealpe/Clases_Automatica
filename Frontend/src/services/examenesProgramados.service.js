import { apiClient } from './apiClient';

/**
 * Servicio de Exámenes Programados (ExamenesProgramadosService)
 */
export const examenesProgramadosService = {
  async getExamenesPorMateria(materiaId) {
    try {
      const response = await apiClient.get(`/examenes-programados/materia/${materiaId}`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async getMisExamenes() {
    try {
      const response = await apiClient.get('/examenes-programados/estudiante/mis-examenes');
      return response.data;
    } catch (err) {
      return null;
    }
  },

  // Errores reales del backend (validación, permisos, ventana, etc.) se propagan a propósito:
  // el docente/estudiante necesita ver por qué falló, no una confirmación falsa (mismo criterio
  // que materiasService.createMateria).
  async crearExamen(examenData) {
    const response = await apiClient.post('/examenes-programados', examenData);
    return response.data;
  },

  async editarExamen(id, examenData) {
    const response = await apiClient.patch(`/examenes-programados/${id}`, examenData);
    return response.data;
  },

  async eliminarExamen(id) {
    const response = await apiClient.delete(`/examenes-programados/${id}`);
    return response.data;
  },

  async getPreguntasExamen(id) {
    const response = await apiClient.get(`/examenes-programados/${id}/preguntas`);
    return response.data;
  },

  async submitIntento(id, intentoData) {
    const response = await apiClient.post(`/examenes-programados/${id}/submit`, intentoData);
    return response.data;
  }
};
