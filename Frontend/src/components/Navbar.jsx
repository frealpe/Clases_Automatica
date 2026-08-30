import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourseStore } from '../store/useCourseStore';
import LoginDropdown from './LoginDropdown';
import DescargaMovilDropdown from './DescargaMovilDropdown';

/**
 * Navbar con responsive progresivo por breakpoints:
 *
 * xs  (0–639px)   — móvil portrait pequeño/mediano
 *   · Solo logo + tema + login/icono cuenta
 *   · Nombre usuario: solo icono account_circle
 *   · Botón descarga: oculto
 *   · Badge rol: oculto
 *   · Texto "Salir": oculto
 *
 * sm  (640–767px) — móvil landscape / teléfono grande
 *   · Logo + "UNICAUCA · 2026" (una línea)
 *   · Nombre usuario: hasta 100px visible
 *   · Botón descarga: visible
 *   · Badge rol: oculto
 *   · Texto "Salir": visible
 *
 * md  (768–1023px) — tablet portrait
 *   · Logo + brand completo (3 líneas)
 *   · Enlace "Gestión de Usuarios" visible
 *   · Nombre usuario: hasta 140px
 *   · Badge rol: visible
 *
 * lg  (1024px+)   — tablet landscape / escritorio
 *   · Todo visible, nombre hasta 180px, padding amplio
 */
export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { usuario, logout, estaAutenticado, esSuperusuario, esDocente } = useAuth();
  const materias          = useCourseStore((s) => s.materias);
  const materiaActivaId   = useCourseStore((s) => s.materiaActivaId);
  const setMateriaActiva  = useCourseStore((s) => s.setMateriaActiva);
  const themeMode         = useCourseStore((s) => s.themeMode);
  const toggleThemeMode   = useCourseStore((s) => s.toggleThemeMode);

  const [loginDesplegado,    setLoginDesplegado]    = useState(false);
  const [descargaDesplegada, setDescargaDesplegada] = useState(false);
  const esLight = themeMode === 'light';

  const nombreUsuario = usuario?.nombre || usuario?.email || 'Usuario Unicauca';
  const etiquetaRol   = esSuperusuario ? 'Superusuario' : esDocente ? 'Docente' : 'Estudiante';

  const badgeRolClases = esSuperusuario
    ? esLight ? 'bg-amber-100 text-amber-900 border-amber-300'  : 'bg-amber-500/25 text-amber-300 border-amber-500/40'
    : esDocente
    ? esLight ? 'bg-red-100 text-red-900 border-red-300'        : 'bg-red-500/25 text-red-300 border-red-500/40'
    : esLight ? 'bg-sky-100 text-sky-900 border-sky-300'        : 'bg-sky-500/25 text-sky-300 border-sky-500/40';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 border-b transition-colors duration-300 ${
      esLight
        ? 'bg-white/90 border-slate-300 text-slate-900 shadow-md backdrop-blur-md'
        : 'bg-[#0a0a0a]/80 border-white/15 text-white backdrop-blur-md'
    }`}>
      {/* Contenedor principal — altura y padding crecen con el viewport */}
      <div className="w-full px-3 sm:px-5 md:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">

        {/* ── BRAND / LOGO ─────────────────────────────────────────── */}
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer min-w-0 overflow-hidden"
          onClick={() => navigate('/')}
        >
          {/* Logo: escala con breakpoint */}
          <img
            src="/assets/logo-unicauca.png"
            alt="Universidad del Cauca"
            className="h-8 sm:h-9 md:h-10 w-auto bg-white p-1 rounded-md shadow-md shrink-0"
          />

          {/* xs: oculto | sm: solo primera línea | md+: las 3 líneas */}
          <div className="hidden sm:block min-w-0">
            <div className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase truncate ${
              esLight ? 'text-sky-700' : 'text-[#38bdf8]'
            }`}>
              UNIVERSIDAD DEL CAUCA · 2026
            </div>
            {/* Líneas 2 y 3: solo desde md */}
            <div className={`hidden md:block text-[11px] font-medium truncate ${
              esLight ? 'text-slate-600' : 'text-white/70'
            }`}>
              Departamento de Instrumentación y Control
            </div>
            <div className={`hidden md:block text-xs lg:text-sm font-bold leading-tight truncate ${
              esLight ? 'text-slate-900' : 'text-white'
            }`}>
              Ingeniería en Automática Industrial
            </div>
          </div>
        </div>

        {/* ── ENLACE NAV (solo Docentes/Superusuarios, solo md+) ────── */}
        {(esSuperusuario || esDocente) && (
          <div className="hidden md:flex items-center gap-5 text-xs">
            <button
              onClick={() => navigate('/usuarios')}
              className={`hover:opacity-100 transition-all font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] lg:text-xs ${
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
              <span className="hidden lg:inline">Gestión de Usuarios</span>
              <span className="lg:hidden">Usuarios</span>
            </button>
          </div>
        )}

        {/* ── CONTROLES ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0 relative">

          {/* Botón descarga app: xs oculto | sm+ visible */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setDescargaDesplegada(!descargaDesplegada)}
              className={`p-1.5 sm:p-2 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                esLight
                  ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title="Descargar App Móvil"
            >
              <span className="material-symbols-outlined text-sm sm:text-base">smartphone</span>
            </button>
            <DescargaMovilDropdown
              isOpen={descargaDesplegada}
              onClose={() => setDescargaDesplegada(false)}
            />
          </div>

          {/* Selector de tema: siempre visible */}
          <button
            onClick={toggleThemeMode}
            className={`p-1.5 sm:p-2 rounded-full border transition-all flex items-center justify-center cursor-pointer text-sm ${
              esLight
                ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300'
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            }`}
            title={esLight ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
          >
            {esLight ? '🌙' : '☀️'}
          </button>

          {/* ── Autenticado / Login ────────────────────────────────── */}
          {estaAutenticado ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/*
                Chip de usuario
                · xs : solo icono account_circle (sin nombre)
                · sm : icono + nombre (hasta 100px)
                · md : icono + nombre (hasta 140px) + badge rol
                · lg : icono + nombre (hasta 180px) + badge rol
              */}
              <div
                onClick={() => navigate((esSuperusuario || esDocente) ? '/usuarios' : '/labor')}
                className={`rounded-full border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all p-1.5 sm:px-2.5 sm:py-1.5 md:px-3 ${
                  esLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title={(esSuperusuario || esDocente) ? 'Gestión de Usuarios y Matrículas' : 'Ir a Mis Materias'}
              >
                <span className="material-symbols-outlined text-base text-[#38bdf8]">account_circle</span>
                {/* Nombre: oculto en xs, visible sm+ con ancho creciente */}
                <span className="hidden sm:inline max-w-[100px] md:max-w-[140px] lg:max-w-[180px] truncate">
                  {nombreUsuario}
                </span>
                {/* Badge rol: oculto hasta md */}
                <span className={`hidden md:inline text-[10px] font-mono px-1.5 py-0.5 rounded-full font-extrabold uppercase border ${badgeRolClases}`}>
                  {etiquetaRol}
                </span>
              </div>

              {/*
                Botón salir
                · xs  : solo icono (cuadrado compacto)
                · sm+ : icono + texto "Salir"
              */}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="p-1.5 sm:px-2.5 sm:py-1.5 md:px-3 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-500/30 flex items-center gap-1 cursor-pointer transition-all shadow-md"
                title="Cerrar Sesión / Salir"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            /* ── Login button ──────────────────────────────────────── */
            <div className="relative">
              <button
                onClick={() => setLoginDesplegado(!loginDesplegado)}
                className={`rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg cursor-pointer px-2.5 py-1.5 sm:px-3.5 ${
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
