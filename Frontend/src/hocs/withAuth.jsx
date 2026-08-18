import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * HOC (Higher-Order Component) withAuth
 * Consume AuthContext para validar credenciales y token JWT
 */
export function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { usuario, tokenJWT, estaAutenticado } = useAuth();

    if (!estaAutenticado) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155', margin: '40px auto', maxWidth: '500px' }}>
          <h2 style={{ color: '#ef4444', marginBottom: '8px' }}>🔒 Credenciales Requeridas</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Debes autenticarte para mantener la sesión y el token JWT activo.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} usuario={usuario} tokenJWT={tokenJWT} />;
  };
}
