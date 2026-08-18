import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * HOC (Higher-Order Component) withRole
 * Valida el rol del usuario permitiendo arreglos de roles o cadenas simples.
 */
export function withRole(WrappedComponent, requiredRole) {
  return function RoleProtectedComponent(props) {
    const { usuario } = useAuth();
    const rolesPermitidos = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

    const rolActual = usuario?.rol;
    const tienePermiso = rolActual === 'SUPERUSUARIO' || rolesPermitidos.includes(rolActual);

    if (!tienePermiso) {
      return (
        <div className="p-8 max-w-lg mx-auto my-12 bg-slate-900 border-2 border-red-500 rounded-2xl text-center shadow-2xl text-white">
          <h2 className="text-xl font-black text-red-400 mb-2">⛔ Permisos Insuficientes</h2>
          <p className="text-xs text-slate-300">
            Este módulo requiere el perfil de <strong>{rolesPermitidos.join(', ')}</strong>.
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} userRole={rolActual} />;
  };
}
