import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourseStore } from '../store/useCourseStore';

export default function LoginDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const loginWithJWT = useCourseStore((state) => state.loginWithJWT);
  const registrarWithJWT = useCourseStore((state) => state.registrarWithJWT);
  const logoutJWT = useCourseStore((state) => state.logoutJWT);
  const themeMode = useCourseStore((state) => state.themeMode);

  // Modo: 'login' o 'registro'
  const [modo, setModo] = useState('login');

  // Campos Login / Registro
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('DOCENTE'); // DOCENTE por defecto para rápida creación
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);

  const esLight = themeMode === 'light';

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');
    setEsError(false);

    try {
      const res = await loginWithJWT(email, password);
      if (res.ok) {
        setMensaje('✅ Sesión iniciada exitosamente');
        setEsError(false);
        // Si el usuario es DOCENTE o SUPERUSUARIO -> Ruteo directo a /materias para crear/gestionar materias
        if (res.user?.rol === 'DOCENTE' || res.user?.rol === 'SUPERUSUARIO') {
          navigate('/materias');
        } else {
          navigate('/labor');
        }
        setTimeout(() => {
          onClose();
        }, 400);
      }
    } catch (err) {
      setEsError(true);
      setMensaje(err.message || 'Correo o contraseña incorrectos');
    } finally {
      setCargando(false);
    }
  };

  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setEsError(true);
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    setCargando(true);
    setMensaje('');
    setEsError(false);

    try {
      const res = await registrarWithJWT({ nombre: nombre.trim(), email: email.trim(), password: password.trim(), rol });
      if (res.ok) {
        setMensaje('🎉 Cuenta creada exitosamente');
        setEsError(false);
        // Si el nuevo usuario es DOCENTE -> Redireccionar inmediatamente a /materias
        if (res.user?.rol === 'DOCENTE' || res.user?.rol === 'SUPERUSUARIO') {
          navigate('/materias');
        } else {
          navigate('/labor');
        }
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      setEsError(true);
      setMensaje(err.message || 'Error al registrar la cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={`absolute right-0 top-14 w-84 border backdrop-blur-2xl rounded-2xl p-5 shadow-2xl z-50 transition-all animate-fadeIn ${
      esLight
        ? 'bg-white border-slate-300 text-slate-900 shadow-xl'
        : 'bg-[#131313]/95 border-white/20 text-white'
    }`}>
      {/* Encabezado Desplegable */}
      <div className={`flex justify-between items-center mb-3 pb-2 border-b ${
        esLight ? 'border-slate-200' : 'border-white/15'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-xl ${esLight ? 'text-sky-600' : 'text-[#38bdf8]'}`}>
            {modo === 'login' ? 'lock' : 'person_add'}
          </span>
          <span className={`text-sm font-extrabold ${esLight ? 'text-slate-900' : 'text-white'}`}>
            {modo === 'login' ? 'Ingreso a la Plataforma' : 'Crear Nueva Cuenta'}
          </span>
        </div>
        <button onClick={onClose} className={`text-sm font-bold ${esLight ? 'text-slate-500 hover:text-slate-800' : 'text-white/60 hover:text-white'}`}>
          ✕
        </button>
      </div>

      {/* Pestanas Modo Login / Registro */}
      <div className="grid grid-cols-2 gap-1 mb-4 p-1 rounded-xl bg-slate-500/10 border border-slate-500/20">
        <button
          type="button"
          onClick={() => { setModo('login'); setMensaje(''); }}
          className={`py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
            modo === 'login'
              ? esLight ? 'bg-sky-600 text-white shadow-sm' : 'bg-[#38bdf8] text-slate-950 shadow-sm'
              : esLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          Iniciar Sesión
        </button>
        <button
          type="button"
          onClick={() => { setModo('registro'); setMensaje(''); }}
          className={`py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
            modo === 'registro'
              ? esLight ? 'bg-sky-600 text-white shadow-sm' : 'bg-[#38bdf8] text-slate-950 shadow-sm'
              : esLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
          }`}
        >
          Registrarse
        </button>
      </div>

      {/* Estado del Usuario Conectado */}
      {usuario && (
        <div className={`border p-3 rounded-xl mb-4 flex items-center justify-between ${
          esLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
        }`}>
          <div>
            <div className={`text-[10px] font-mono font-bold ${esLight ? 'text-slate-500' : 'text-white/50'}`}>
              CONECTADO COMO [{usuario.rol}]
            </div>
            <div className={`text-xs font-bold truncate max-w-[130px] ${esLight ? 'text-slate-900' : 'text-white'}`}>
              {usuario.nombre}
            </div>
          </div>
          <button
            onClick={() => {
              logoutJWT();
              navigate('/');
            }}
            className="text-[11px] bg-red-500/20 text-red-600 border border-red-500/30 px-2.5 py-1 rounded-full font-bold hover:bg-red-500/30 transition-all cursor-pointer"
          >
            Salir
          </button>
        </div>
      )}

      {/* FORMULARIO DE LOGIN */}
      {modo === 'login' && (
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full text-xs py-2.5 px-3 rounded-xl border font-bold outline-none transition-all ${
                esLight
                  ? 'bg-slate-50 border-slate-400 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20'
                  : 'bg-slate-900/90 border-slate-600 text-white placeholder-slate-400 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/30'
              }`}
              placeholder="usuario@unicauca.edu.co"
              required
            />
          </div>

          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full text-xs py-2.5 px-3 pr-10 rounded-xl border font-bold outline-none transition-all ${
                  esLight
                    ? 'bg-slate-50 border-slate-400 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20'
                    : 'bg-slate-900/90 border-slate-600 text-white placeholder-slate-400 focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/30'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 p-1 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                title={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <span className="material-symbols-outlined text-base">
                  {mostrarPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {mensaje && (
            <div className={`text-[11px] font-mono text-center p-2 rounded-lg font-bold ${
              esError
                ? 'bg-red-500/20 text-red-700 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/40'
            }`}>
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className={`w-full rounded-full font-extrabold py-2.5 text-xs transition-all shadow-md cursor-pointer mt-1 ${
              esLight
                ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-sky-600/30'
                : 'bg-white text-black hover:bg-white/85 shadow-white/20'
            }`}
          >
            {cargando ? 'Verificando...' : 'Iniciar Sesión (Ingresar)'}
          </button>
        </form>
      )}

      {/* FORMULARIO DE REGISTRO */}
      {modo === 'registro' && (
        <form onSubmit={handleRegistroSubmit} className="flex flex-col gap-2.5">
          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Nombre Completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={`w-full text-xs py-2 px-3 rounded-xl border font-bold outline-none transition-all ${
                esLight
                  ? 'bg-slate-50 border-slate-400 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-sky-600'
                  : 'bg-slate-900/90 border-slate-600 text-white placeholder-slate-400 focus:border-[#38bdf8]'
              }`}
              placeholder="Ej: Prof. Roberto Gómez"
              required
            />
          </div>

          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full text-xs py-2 px-3 rounded-xl border font-bold outline-none transition-all ${
                esLight
                  ? 'bg-slate-50 border-slate-400 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-sky-600'
                  : 'bg-slate-900/90 border-slate-600 text-white placeholder-slate-400 focus:border-[#38bdf8]'
              }`}
              placeholder="docente@unicauca.edu.co"
              required
            />
          </div>

          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Tipo de Usuario / Rol
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className={`w-full text-xs py-2 px-3 rounded-xl border font-extrabold outline-none ${
                esLight
                  ? 'bg-slate-50 border-slate-400 text-slate-900'
                  : 'bg-slate-900/90 border-slate-600 text-white'
              }`}
            >
              <option value="DOCENTE">DOCENTE (Crear y gestionar materias)</option>
              <option value="ESTUDIANTE">ESTUDIANTE (Ver materias y presentar exámenes)</option>
            </select>
          </div>

          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full text-xs py-2 px-3 pr-10 rounded-xl border font-bold outline-none transition-all ${
                  esLight
                    ? 'bg-slate-50 border-slate-400 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-sky-600'
                    : 'bg-slate-900/90 border-slate-600 text-white placeholder-slate-400 focus:border-[#38bdf8]'
                }`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 p-1 text-slate-400 hover:text-sky-400 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">
                  {mostrarPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {mensaje && (
            <div className={`text-[11px] font-mono text-center p-2 rounded-lg font-bold ${
              esError
                ? 'bg-red-500/20 text-red-700 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-800 border border-emerald-500/40'
            }`}>
              {mensaje}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className={`w-full rounded-full font-extrabold py-2.5 text-xs transition-all shadow-md cursor-pointer mt-1 ${
              esLight
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/30'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-extrabold shadow-emerald-500/20'
            }`}
          >
            {cargando ? 'Creando Cuenta...' : 'Registrar e Ir a Mis Materias →'}
          </button>
        </form>
      )}
    </div>
  );
}
