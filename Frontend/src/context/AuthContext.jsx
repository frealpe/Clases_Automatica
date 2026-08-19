import React, { createContext, useContext, useMemo } from 'react';
import { useCourseStore } from '../store/useCourseStore';

/**
 * Contexto de Autenticación y Sesión de Usuario (React Context + Zustand)
 * Proveedor único de estado de usuario autenticado, tokens JWT, comprobación de roles
 * (Superusuario, Docente, Estudiante) y métodos de sesión.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const usuario = useCourseStore((state) => state.usuario);
  const tokenJWT = useCourseStore((state) => state.tokenJWT);
  const loginWithJWT = useCourseStore((state) => state.loginWithJWT);
  const logoutJWT = useCourseStore((state) => state.logoutJWT);
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const setMateriaActiva = useCourseStore((state) => state.setMateriaActiva);

  const login = async (email, password) => {
    const res = await loginWithJWT(email, password);
    return res.user;
  };

  const value = useMemo(() => {
    const estaAutenticado = Boolean(tokenJWT && usuario);
    const esSuperusuario = usuario?.rol === 'SUPERUSUARIO';
    const esDocente = usuario?.rol === 'DOCENTE';
    const esEstudiante = usuario?.rol === 'ESTUDIANTE';

    // Asignatura activa seleccionada
    const materiaActiva = materias.find((m) => m.id === materiaActivaId) || materias[0] || null;

    return {
      usuario,
      tokenJWT,
      estaAutenticado,
      esSuperusuario,
      esDocente,
      esEstudiante,
      materias,
      materiaActivaId,
      materiaActiva,
      setMateriaActiva,
      login,
      logout: logoutJWT,
    };
  }, [usuario, tokenJWT, materias, materiaActivaId, loginWithJWT, logoutJWT, setMateriaActiva]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
