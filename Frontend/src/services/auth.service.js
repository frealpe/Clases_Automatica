import { apiClient } from './apiClient';

/**
 * Servicio de Autenticación JWT (AuthService)
 * Valida correo y contraseña en el servidor NestJS/PostgreSQL.
 */
export const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Error al conectar con el servidor de autenticación');
    }
  },

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }
};
