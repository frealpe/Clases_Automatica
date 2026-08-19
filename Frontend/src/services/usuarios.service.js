import { apiClient } from './apiClient';

export const usuariosService = {
  // Listar todos los usuarios (SUPERUSUARIO o DOCENTE)
  async getUsuarios() {
    try {
      const response = await apiClient.get('/auth/usuarios');
      return response.data;
    } catch (error) {
      console.error('Error al listar usuarios:', error);
      throw error;
    }
  },

  // Crear un usuario con rol (SUPERUSUARIO)
  async crearUsuario(dto) {
    try {
      const response = await apiClient.post('/auth/usuarios', dto);
      return response.data;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  },

  // Actualizar un usuario existente (SUPERUSUARIO)
  async actualizarUsuario(id, dto) {
    try {
      const response = await apiClient.patch(`/auth/usuarios/${id}`, dto);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  },

  // Eliminar un usuario (SUPERUSUARIO)
  async eliminarUsuario(id) {
    try {
      const response = await apiClient.delete(`/auth/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  },

  // Matricular un estudiante en una materia
  async inscribirEstudiante(materiaId, { estudianteId, email }) {
    try {
      const response = await apiClient.post('/estudiantes/inscribir', {
        materiaId,
        estudianteId,
        email,
      });
      return response.data;
    } catch (error) {
      console.error('Error al inscribir estudiante:', error);
      throw error;
    }
  },

  // Eliminar matrícula de un estudiante en una materia
  async eliminarInscripcion(materiaId, estudianteId) {
    try {
      const response = await apiClient.delete(`/estudiantes/inscripciones/${materiaId}/${estudianteId}`);
      return response.data;
    } catch (error) {
      console.error('Error al desmatricular estudiante:', error);
      throw error;
    }
  },

  // Carga masiva de estudiantes desde archivo .md / lista
  async cargaMasivaEstudiantes(materiaId, estudiantes) {
    try {
      const response = await apiClient.post('/auth/usuarios/carga-masiva', {
        materiaId,
        estudiantes,
      });
      return response.data;
    } catch (error) {
      console.error('Error en carga masiva de estudiantes:', error);
      throw error;
    }
  },
};
