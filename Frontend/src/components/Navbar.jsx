import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourseStore } from '../store/useCourseStore';
import LoginDropdown from './LoginDropdown';
import DescargaMovilDropdown from './DescargaMovilDropdown';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout, estaAutenticado, esSuperusuario, esDocente } = useAuth();
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const setMateriaActiva = useCourseStore((state) => state.setMateriaActiva);
  const themeMode = useCourseStore((state) => state.themeMode);
  const toggleThemeMode = useCourseStore((state) => state.toggleThemeMode);

  const [loginDesplegado, setLoginDesplegado] = useState(false);
  const [descargaDesplegada, setDescargaDesplegada] = useState(false);
  const esLight = themeMode === 'light';

  const materiaActiva = materias.find((m) => m.id === materiaActivaId) || materias[0];
  const nombreUsuario = usuario?.nombre || usuario?.email || 'Usuario Unicauca';
  const etiquetaRol = esSuperusuario ? 'Superusuario' : esDocente ? 'Docente' : 'Estudiante';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 border-b transition-colors duration-300 ${
      esLight
        ? 'bg-white/90 border-slate-300 text-slate-900 shadow-md backdrop-blur-md'
        : 'bg-[#0a0a0a]/80 border-white/15 text-white backdrop-blur-md'
    }`}>
      <div className="w-full px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo Unicauca */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => navigate('/')}
        >
          <img
            src="/assets/logo-unicauca.png"
            alt="Universidad del Cauca"
            className="h-10 w-auto bg-white p-1 rounded-md shadow-md"
          />
          <div>
            <div className={`text-[10px] font-mono font-bold tracking-widest uppercase ${
              esLight ? 'text-sky-700' : 'text-[#38bdf8]'
            }`}>
              UNIVERSIDAD DEL CAUCA · 2026
            </div>
            <div className={`text-xs font-medium ${esLight ? 'text-slate-600' : 'text-white/70'}`}>
              Departamento de Instrumentación y Control
            </div>
            <div className={`text-xs sm:text-sm font-bold leading-tight ${esLight ? 'text-slate-900' : 'text-white'}`}>
              Ingeniería en Automática Industrial
            </div>
          </div>
        </div>

        {/* Enlace de Gestión de Usuarios (visible para Docentes y Superusuarios) */}
        {(esSuperusuario || esDocente) && (
          <div className="hidden md:flex items-center gap-5 text-xs">
            <button
              onClick={() => navigate('/usuarios')}
              className={`hover:opacity-100 transition-all font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                location.pathname === '/usuarios'
                  ? esLight
                    ? 'bg-sky-100 text-sky-800 border-sky-300 font-extrabold'
                    : 'bg-sky-500/20 text-[#38bdf8] border-sky-500/40 font-extrabold'
                  : esLight
                  ? 'text-slate-700 border-slate-300 hover:bg-slate-100'
                  : 'text-white/80 border-white/20 hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-base">manage_accounts</span>
              <span>Gestión de Usuarios</span>
            </button>
          </div>
        )}

        {/* Controles CTA: Conmutador de Tema + Usuario Autenticado / Login */}
        <div className="flex items-center gap-3 shrink-0 relative">
          {/* Botón de Descarga de la App Móvil (Android / iOS) */}
          <div className="relative">
            <button
              onClick={() => setDescargaDesplegada(!descargaDesplegada)}
              className={`p-2 rounded-full border transition-all text-sm flex items-center justify-center cursor-pointer ${
                esLight
                  ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title="Descargar App Móvil"
            >
              <span className="material-symbols-outlined text-base">smartphone</span>
            </button>

            <DescargaMovilDropdown
              isOpen={descargaDesplegada}
              onClose={() => setDescargaDesplegada(false)}
            />
          </div>

          {/* Selector de Tema Claro / Oscuro */}
          <button
            onClick={toggleThemeMode}
            className={`p-2 rounded-full border transition-all text-sm flex items-center justify-center cursor-pointer ${
              esLight
                ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
            title={esLight ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
          >
            {esLight ? '🌙' : '☀️'}
          </button>

          {/* CONDICIONAL: SI ESTÁ AUTENTICADO MUESTRA NOMBRE Y BOTÓN DE SALIDA */}
          {estaAutenticado ? (
            <div className="flex items-center gap-2">
              <div
                onClick={() => navigate((esSuperusuario || esDocente) ? '/usuarios' : '/labor')}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                  esLight ? 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={(esSuperusuario || esDocente) ? 'Gestión de Usuarios y Matrículas' : 'Ir a Mis Materias'}
              >
                <span className="material-symbols-outlined text-base text-[#38bdf8]">account_circle</span>
                <span className="max-w-[150px] truncate">{nombreUsuario}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-extrabold uppercase ${
                  esSuperusuario
                    ? esLight ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                    : esDocente
                    ? esLight ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-red-500/25 text-red-300 border border-red-500/40'
                    : esLight ? 'bg-sky-100 text-sky-900 border border-sky-300' : 'bg-sky-500/25 text-sky-300 border border-sky-500/40'
                }`}>
                  {etiquetaRol}
                </span>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-500/30 flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                title="Cerrar Sesión / Salir"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Salir</span>
              </button>
            </div>
          ) : (
            /* SI NO ESTÁ AUTENTICADO MUESTRA EL BOTÓN Y DESPLEGABLE DE LOGIN */
            <div className="relative">
              <button
                onClick={() => setLoginDesplegado(!loginDesplegado)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${
                  esLight
                    ? 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800'
                    : 'bg-white/15 text-white border-white/25 backdrop-blur-md hover:bg-white/25'
                }`}
                title="Iniciar Sesión / Login"
              >
                <span className={`material-symbols-outlined text-base ${esLight ? 'text-sky-400' : 'text-[#38bdf8]'}`}>
                  login
                </span>
                <span>Login</span>
              </button>

              <LoginDropdown
                isOpen={loginDesplegado}
                onClose={() => setLoginDesplegado(false)}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
