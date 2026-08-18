/**
 * Base de Datos Local del Dispositivo Móvil (Offline / Cache)
 * Permite persistir sesión, preguntas cacheadas y resultados sin conexión.
 */

// Memoria / AsyncStorage local wrapper
const STORE = {
  usuarioActual: null,
  token: null,
  preguntasCache: {},
  intentosLocales: []
};

export const localStorageService = {
  // Manejo de Sesión
  async setUsuarioActual(user, token) {
    STORE.usuarioActual = user;
    STORE.token = token;
    return true;
  },

  async getUsuarioActual() {
    return STORE.usuarioActual;
  },

  async getToken() {
    return STORE.token;
  },

  async cerrarSesion() {
    STORE.usuarioActual = null;
    STORE.token = null;
    return true;
  },

  // Base de Datos Local de Preguntas Cacheables
  async guardarPreguntasLocales(semanaId, preguntas) {
    STORE.preguntasCache[semanaId] = preguntas;
    return true;
  },

  async getPreguntasLocales(semanaId) {
    return STORE.preguntasCache[semanaId] || null;
  },

  // Guardado de Intentos de Examen Local
  async guardarIntentoLocal(intento) {
    STORE.intentosLocales.push(intento);
    return true;
  },

  async getIntentosLocales() {
    return STORE.intentosLocales;
  }
};
