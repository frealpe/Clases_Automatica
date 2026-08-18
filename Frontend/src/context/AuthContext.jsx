import React, { createContext, useContext } from 'react';
import { useCourseStore } from '../store/useCourseStore';

/**
 * Contexto de Autenticación React: envoltorio delgado sobre useCourseStore (Zustand),
 * que es la única fuente de verdad de usuario/tokenJWT. Antes cada uno mantenía su
 * propio estado en paralelo (useState aquí + el store allá) y nunca se sincronizaban:
 * cambiar de rol en el Navbar (que usa este contexto) no se reflejaba en App.jsx
 * (que lee del store), dejando la vista de Estudiante inalcanzable.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const usuario = useCourseStore((state) => state.usuario);
  const tokenJWT = useCourseStore((state) => state.tokenJWT);
  const loginWithJWT = useCourseStore((state) => state.loginWithJWT);
  const logoutJWT = useCourseStore((state) => state.logoutJWT);

  const login = async (email, password) => {
    const res = await loginWithJWT(email, password);
    return res.user;
  };

  const value = {
    usuario,
    tokenJWT,
    login,
    logout: logoutJWT,
    estaAutenticado: !!tokenJWT && !!usuario,
    esSuperusuario: usuario?.rol === 'SUPERUSUARIO',
    esDocente: usuario?.rol === 'DOCENTE',
    esEstudiante: usuario?.rol === 'ESTUDIANTE'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
}
