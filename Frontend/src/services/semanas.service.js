import { apiClient } from './apiClient';

/**
 * Servicio de Semanas de Curso (SemanasService)
 */
export const semanasService = {
  // Versión pública (sin JWT): usada en la portada para visitantes sin sesión iniciada.
  async getSemanasPublicas(materiaId = 1) {
    try {
      const response = await apiClient.get('/semanas/publicas', { params: { materiaId } });
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async getSemanaPublicaById(id) {
    try {
      const response = await apiClient.get(`/semanas/publicas/${id}`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

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
        timeout: 300000,
      });
      return response.data;
    } catch (err) {
      const msg = err?.code === 'ECONNABORTED'
        ? 'Tiempo de espera agotado (superó 5 min)'
        : (err?.response?.data?.message || err?.message || 'Error al subir el PDF');
      return { ok: false, error: msg };
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
        timeout: 300000,
      });
      return response.data;
    } catch (err) {
      const msg = err?.code === 'ECONNABORTED'
        ? 'Tiempo de espera agotado (superó 5 min)'
        : (err?.response?.data?.message || err?.message || 'Error al subir el proyecto HTML');
      return { ok: false, error: msg };
    }
  },

  async actualizarConfigExamen(id, { duracionExamenMin, preguntasExamenCount, tipoExamen } = {}) {
    try {
      const response = await apiClient.patch(`/semanas/${id}/examen-config`, { duracionExamenMin, preguntasExamenCount, tipoExamen });
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
        timeout: 300000,
      });
      return response.data;
    } catch (err) {
      const msg = err?.code === 'ECONNABORTED'
        ? 'Tiempo de espera agotado (superó 5 min)'
        : (err?.response?.data?.message || err?.message || 'Error al subir los ejercicios resueltos');
      return { ok: false, error: msg };
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
        timeout: 300000,
      });
      return response.data;
    } catch (err) {
      const msg = err?.code === 'ECONNABORTED'
        ? 'Tiempo de espera agotado (superó 5 min)'
        : (err?.response?.data?.message || err?.message || 'Error al subir el banco de preguntas');
      return { ok: false, error: msg };
    }
  },

  async eliminarBancoPreguntasZip(id) {
    try {
      const response = await apiClient.delete(`/semanas/${id}/banco-preguntas`);
      return response.data;
    } catch (err) {
      return null;
    }
  },

  async subirCodigoFuente(id, archivo) {
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      const response = await apiClient.post(`/semanas/${id}/codigo-fuente`, formData, {
        timeout: 300000,
      });
      return response.data;
    } catch (err) {
      const msg = err?.code === 'ECONNABORTED'
        ? 'Tiempo de espera agotado al subir el archivo (superó los 5 min)'
        : (err?.response?.data?.message || err?.message || 'Error al subir el código fuente');
      return { ok: false, error: msg };
    }
  },

  async eliminarCodigoFuente(id) {
    try {
      const response = await apiClient.delete(`/semanas/${id}/codigo-fuente`);
      return response.data;
    } catch (err) {
      return null;
    }
  }
};
