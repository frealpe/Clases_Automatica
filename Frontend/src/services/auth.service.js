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

  async registrar(datos) {
    try {
      const response = await apiClient.post('/auth/register', datos);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Error al registrar usuario en el servidor');
    }
  },

  async cambiarPassword(passwordActual, passwordNueva) {
    try {
      const response = await apiClient.patch('/auth/cambiar-password', { passwordActual, passwordNueva });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Error al cambiar la contraseña');
    }
  },

  async recuperarPassword(email) {
    try {
      const response = await apiClient.post('/auth/recuperar-password', { email });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Error al solicitar recuperación de contraseña');
    }
  },

  async restablecerPassword(email, codigo, passwordNueva) {
    try {
      const response = await apiClient.post('/auth/restablecer-password', { email, codigo, passwordNueva });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error('Error al restablecer la contraseña');
    }
  },

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
  }
};
