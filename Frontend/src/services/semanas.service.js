import { apiClient } from './apiClient';

/**
 * Servicio de Semanas de Curso (SemanasService)
 */
export const semanasService = {
  async getSemanas(materiaId = 1) {
    try {
      const response = await apiClient.get('/semanas', { params: { materiaId } });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async getSemanaById(id) {
    try {
      const response = await apiClient.get(`/semanas/${id}`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async guardarContenidoSemana(id, contenidoJson) {
    try {
      const response = await apiClient.put(`/semanas/${id}/contenido`, contenidoJson);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async eliminarContenidoSemana(id) {
    try {
      const response = await apiClient.delete(`/semanas/${id}/contenido`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async actualizarObjetivo(id, objetivos) {
    try {
      const response = await apiClient.patch(`/semanas/${id}/objetivo`, { objetivos });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async subirPdf(id, tipo, archivo) {
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      const response = await apiClient.post(`/semanas/${id}/pdf/${tipo}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async crearSemana(materiaId, nombre) {
    try {
      const response = await apiClient.post('/semanas', { materiaId, nombre });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async actualizarNombre(id, nombre) {
    try {
      const response = await apiClient.patch(`/semanas/${id}/nombre`, { nombre });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async eliminarSemana(id) {
    try {
      const response = await apiClient.delete(`/semanas/${id}`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async subirProyectoHtml(id, archivoZip) {
    try {
      const formData = new FormData();
      formData.append('proyecto', archivoZip);
      const response = await apiClient.post(`/semanas/${id}/html`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return { ok: false, error: err?.response?.data?.message || 'Error al subir el proyecto HTML' };
    }
  },

  async actualizarConfigExamen(id, { duracionExamenMin, preguntasExamenCount } = {}) {
    try {
      const response = await apiClient.patch(`/semanas/${id}/examen-config`, { duracionExamenMin, preguntasExamenCount });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async eliminarProyectoHtml(id) {
    try {
      const response = await apiClient.delete(`/semanas/${id}/html`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async subirEjerciciosResueltos(id, archivoZip) {
    try {
      const formData = new FormData();
      formData.append('proyecto', archivoZip);
      const response = await apiClient.post(`/semanas/${id}/ejercicios-resueltos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return { ok: false, error: err?.response?.data?.message || 'Error al subir los ejercicios resueltos' };
    }
  },

  async eliminarEjerciciosResueltos(id) {
    try {
      const response = await apiClient.delete(`/semanas/${id}/ejercicios-resueltos`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async subirBancoPreguntasZip(id, archivoZip) {
    try {
      const formData = new FormData();
      formData.append('proyecto', archivoZip);
      const response = await apiClient.post(`/semanas/${id}/banco-preguntas`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      return { ok: false, error: err?.response?.data?.message || 'Error al subir el banco de preguntas' };
    }
  },

  async eliminarBancoPreguntasZip(id) {
    try {
      const response = await apiClient.delete(`/semanas/${id}/banco-preguntas`);
      return response.data;
    } catch (err) {
      return null;
    }
  }
};
