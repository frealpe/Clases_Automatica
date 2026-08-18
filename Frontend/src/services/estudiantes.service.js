import { apiClient } from './apiClient';

/**
 * Servicio de Gestión de Estudiantes (EstudiantesService)
 */
export const estudiantesService = {
  async getEstudiantes(materiaId) {
    try {
      const response = await apiClient.get('/estudiantes', { params: { materiaId } });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async cargaMasiva({ materiaId, archivo, texto }) {
    const formData = new FormData();
    formData.append('materiaId', materiaId);
    if (archivo) formData.append('archivo', archivo);
    if (texto) formData.append('texto', texto);

    const response = await apiClient.post('/estudiantes/carga-masiva', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
};
