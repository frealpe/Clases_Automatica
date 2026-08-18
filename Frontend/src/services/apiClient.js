import axios from 'axios';

// Lectura de la URL base desde las variables de entorno de Vite (.env)
export const API_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:3000';

/**
 * Cliente HTTP Axios configurado con variables de entorno (.env)
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de Petición para adjuntar automáticamente el JWT Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    }
    return Promise.reject(error);
  }
);
