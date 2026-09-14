import axios from 'axios';

// Lectura de la URL base dinámicamente para desarrollo y producción
export const getBaseUrl = () => {
  if (import.meta?.env?.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:3000') {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return import.meta?.env?.VITE_API_URL || 'http://localhost:3000';
};

export const API_URL = getBaseUrl();

/**
 * Función centralizada para construir URLs de descarga directas (/uploads/...)
 * Evita la duplicación errónea del prefijo /api/uploads/ que generaba errores 404
 */
export const getDownloadUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads') || url.startsWith('/notas')) return url;
  return `${API_URL}${url}`;
};

/**
 * Cliente HTTP Axios configurado con variables de entorno (.env) y fallback relativo /api
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor de Petición para adjuntar automáticamente el JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta para manejo centralizado de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Axios: Token JWT no válido o sesión expirada (401)');
      if (!error.config?.url?.includes('/auth/login')) {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
      }
    }
    return Promise.reject(error);
  }
);
