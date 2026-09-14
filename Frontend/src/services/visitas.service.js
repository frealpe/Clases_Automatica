import { apiClient } from './apiClient';

// Guardas a nivel de modulo: VisitasCounter se monta a la vez en Navbar y Sidebar,
// asi que sin esto cada carga de pagina registraria la visita/actividad dos veces.
let promesaVisitaEnCurso = null;
let ultimaActividadEnviada = null;

export const visitasService = {
  registrarVisita() {
    if (promesaVisitaEnCurso) return promesaVisitaEnCurso;

    const claveStorage = 'visita_sitio_unicauca_2026';
    const esNuevoVisitante = !localStorage.getItem(claveStorage);
    // Se marca antes del await para cerrar la carrera entre los dos montajes.
    if (esNuevoVisitante) {
      localStorage.setItem(claveStorage, 'true');
    }

    promesaVisitaEnCurso = apiClient
      .post('/visitas/registrar', { esNuevoVisitante })
      .then((response) => response.data)
      .catch((err) => {
        console.warn('Error al registrar visita:', err?.message);
        return { ok: false, vistasTotales: 1420, visitantesUnicos: 315 };
      });

    return promesaVisitaEnCurso;
  },

  async registrarActividad(materiaId, semanaId, accion = 'vista_plataforma') {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) return { ok: false };

      const clave = `${materiaId ?? ''}|${semanaId ?? ''}|${accion}`;
      if (clave === ultimaActividadEnviada) return { ok: true, duplicada: true };
      ultimaActividadEnviada = clave;

      const response = await apiClient.post('/visitas/registrar-actividad', { materiaId, semanaId, accion });
      return response.data;
    } catch (err) {
      return { ok: false };
    }
  },

  async getStats() {
    try {
      const response = await apiClient.get('/visitas/stats');
      return response.data;
    } catch (err) {
      console.warn('Error al obtener estadísticas de visitas:', err?.message);
      return { ok: false, vistasTotales: 1420, visitantesUnicos: 315 };
    }
  },

  async getRankingEstudiantes() {
    try {
      const response = await apiClient.get('/visitas/ranking-estudiantes');
      return response.data;
    } catch (err) {
      return { ok: false, estudiantes: [], totalAlumnos: 0, error: err?.response?.data?.message || err?.message };
    }
  },
};
