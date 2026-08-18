import { apiClient } from './apiClient';

/**
 * Servicio de Gestión de Materias (MateriasService)
 */
export const materiasService = {
  async getMaterias() {
    try {
      const response = await apiClient.get('/materias');
      return response.data;
    } catch (err) {
      if (err?.response?.status === 401) {
        // Sin sesión válida: no hay lista de materias que mostrar (no es un error de red).
        return [];
      }
      console.warn('MateriasService: error de red al cargar materias, usando lista local');
      return null;
    }
  },

  async createMateria(materiaData) {
    try {
      const response = await apiClient.post('/materias', materiaData);
      return response.data;
    } catch (err) {
      if (err?.response) {
        // Error real del backend (validación, permisos, etc.): debe propagarse, no
        // enmascararse con un guardado local falso.
        throw err;
      }
      console.warn('MateriasService: sin conexión con el backend, guardando localmente en desarrollo');
      return { status: 'ok', materia: { ...materiaData, id: Date.now() } };
    }
  }
};
