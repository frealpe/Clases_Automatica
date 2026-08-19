import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourseStore } from '../store/useCourseStore';
import { authService } from '../services/auth.service';

export default function LoginDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const loginWithJWT = useCourseStore((state) => state.loginWithJWT);
  const logoutJWT = useCourseStore((state) => state.logoutJWT);
  const themeMode = useCourseStore((state) => state.themeMode);

  // Modo de vista: 'login', 'recuperar', 'cambiar_auth'
  const [modo, setModo] = useState('login');

  // Campos Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Campos Cambio de Contraseña (Autenticado)
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');

  // Campos Recuperación de Contraseña (Por correo)
  const [pasoRecuperar, setPasoRecuperar] = useState(1);
  const [emailRecuperacion, setEmailRecuperacion] = useState('');
  const [codigoRecuperacion, setCodigoRecuperacion] = useState('');

  // Estado UI
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);

  const esLight = themeMode === 'light';

  if (!isOpen) return null;

  // --- SUBMIT LOGIN ---
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

  // --- SUBMIT CAMBIAR CONTRASEÑA (AUTENTICADO) ---
  const handleCambiarPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordActual || !passwordNueva) {
      setEsError(true);
      setMensaje('Ingresa la contraseña actual y la nueva');
      return;
    }
    if (passwordNueva !== passwordConfirmar) {
      setEsError(true);
      setMensaje('La nueva contraseña y su confirmación no coinciden');
      return;
    }

    setCargando(true);
    setMensaje('');
    setEsError(false);

    try {
      const res = await authService.cambiarPassword(passwordActual, passwordNueva);
      setMensaje(`✅ ${res.mensaje || 'Contraseña actualizada exitosamente'}`);
      setEsError(false);
      setPasswordActual('');
      setPasswordNueva('');
      setPasswordConfirmar('');
      setTimeout(() => {
        setModo('login');
      }, 1200);
    } catch (err) {
      setEsError(true);
      setMensaje(err.message || 'La contraseña actual ingresada es incorrecta');
    } finally {
      setCargando(false);
    }
  };

  // --- SUBMIT RECUPERAR CONTRASEÑA PASO 1 (SOLICITAR CÓDIGO POR CORREO) ---
  const handleSolicitarCodigoSubmit = async (e) => {
    e.preventDefault();
    if (!emailRecuperacion.trim()) {
      setEsError(true);
      setMensaje('Ingresa tu correo electrónico registrado');
      return;
    }

    setCargando(true);
    setMensaje('');
    setEsError(false);

    try {
      const res = await authService.recuperarPassword(emailRecuperacion.trim());
      setMensaje(`📩 ${res.mensaje}`);
      setEsError(false);
      if (res.codigoRecuperacion) {
        setCodigoRecuperacion(res.codigoRecuperacion);
      }
      setPasoRecuperar(2);
    } catch (err) {
      setEsError(true);
      setMensaje(err.message || 'Error al enviar código de recuperación');
    } finally {
      setCargando(false);
    }
  };

  // --- SUBMIT RESTABLECER CONTRASEÑA PASO 2 (VALIDAR CÓDIGO Y CAMBIAR) ---
  const handleRestablecerSubmit = async (e) => {
    e.preventDefault();
    if (!codigoRecuperacion.trim() || !passwordNueva.trim()) {
      setEsError(true);
      setMensaje('Ingresa el código de 6 dígitos y la nueva contraseña');
      return;
    }

    setCargando(true);
    setMensaje('');
    setEsError(false);

    try {
      const res = await authService.restablecerPassword(emailRecuperacion.trim(), codigoRecuperacion.trim(), passwordNueva.trim());
      setMensaje(`🎉 ${res.mensaje}`);
      setEsError(false);
      setTimeout(() => {
        setModo('login');
        setPasoRecuperar(1);
        setEmail(emailRecuperacion);
      }, 1500);
    } catch (err) {
      setEsError(true);
      setMensaje(err.message || 'Código inválido o expirado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={`absolute right-0 top-14 w-[90vw] sm:w-[400px] max-w-[420px] border backdrop-blur-2xl rounded-2xl p-5 shadow-2xl z-50 transition-all animate-fadeIn ${
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
            {modo === 'login' ? 'lock' : modo === 'recuperar' ? 'mark_email_unread' : 'key'}
          </span>
          <span className={`text-sm font-extrabold ${esLight ? 'text-slate-900' : 'text-white'}`}>
            {modo === 'login' && 'Ingreso a la Plataforma'}
            {modo === 'recuperar' && 'Recuperar Contraseña'}
            {modo === 'cambiar_auth' && 'Cambiar Mi Contraseña'}
          </span>
        </div>
        <button onClick={onClose} className={`text-sm font-bold ${esLight ? 'text-slate-500 hover:text-slate-800' : 'text-white/60 hover:text-white'}`}>
          ✕
        </button>
      </div>

      {/* Estado del Usuario Conectado con Opción de Cambiar Contraseña */}
      {usuario && (
        <div className={`border p-3 rounded-xl mb-4 flex flex-col gap-2 ${
          esLight ? 'bg-slate-100 border-slate-200' : 'bg-white/5 border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-[10px] font-mono font-bold ${esLight ? 'text-slate-500' : 'text-white/50'}`}>
                CONECTADO COMO [{usuario.rol}]
              </div>
              <div className={`text-xs font-bold truncate max-w-[140px] ${esLight ? 'text-slate-900' : 'text-white'}`}>
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

          <button
            type="button"
            onClick={() => { setModo('cambiar_auth'); setMensaje(''); }}
            className={`text-xs font-bold py-1.5 px-3 rounded-lg border transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              modo === 'cambiar_auth'
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                : esLight
                ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50'
                : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-sm">key</span>
            <span>Cambiar mi Contraseña Actual</span>
          </button>
        </div>
      )}

      {/* 1. FORMULARIO DE LOGIN */}
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
            <div className="flex justify-between items-center mb-1">
              <label className={`text-xs font-mono font-bold ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => { setModo('recuperar'); setPasoRecuperar(1); setMensaje(''); }}
                className="text-[11px] font-bold text-sky-600 dark:text-[#38bdf8] hover:underline cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
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

      {/* 2. FORMULARIO DE CAMBIO DE CONTRASEÑA (USUARIOS AUTENTICADOS) */}
      {modo === 'cambiar_auth' && (
        <form onSubmit={handleCambiarPasswordSubmit} className="flex flex-col gap-3">
          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Contraseña Anterior / Actual
            </label>
            <input
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className={`w-full text-xs py-2 px-3 rounded-xl border font-bold outline-none ${
                esLight
                  ? 'bg-slate-50 border-slate-400 text-slate-900 focus:bg-white focus:border-amber-600'
                  : 'bg-slate-900 border-slate-600 text-white focus:border-amber-400'
              }`}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className={`w-full text-xs py-2 px-3 rounded-xl border font-bold outline-none ${
                esLight
                  ? 'bg-slate-50 border-slate-400 text-slate-900 focus:bg-white focus:border-amber-600'
                  : 'bg-slate-900 border-slate-600 text-white focus:border-amber-400'
              }`}
              placeholder="Nueva contraseña"
              required
            />
          </div>

          <div>
            <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
              Confirmar Nueva Contraseña
            </label>
            <input
              type="password"
              value={passwordConfirmar}
              onChange={(e) => setPasswordConfirmar(e.target.value)}
              className={`w-full text-xs py-2 px-3 rounded-xl border font-bold outline-none ${
                esLight
                  ? 'bg-slate-50 border-slate-400 text-slate-900 focus:bg-white focus:border-amber-600'
                  : 'bg-slate-900 border-slate-600 text-white focus:border-amber-400'
              }`}
              placeholder="Repite la nueva contraseña"
              required
            />
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

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setModo('login'); setMensaje(''); }}
              className="flex-1 py-2 text-xs font-bold rounded-xl border border-slate-500/30 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 py-2 text-xs font-extrabold rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md"
            >
              {cargando ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
            </button>
          </div>
        </form>
      )}

      {/* 3. FORMULARIO DE RECUPERACIÓN DE CONTRASEÑA (POR CORREO) */}
      {modo === 'recuperar' && (
        <div className="flex flex-col gap-3">
          {pasoRecuperar === 1 ? (
            <form onSubmit={handleSolicitarCodigoSubmit} className="flex flex-col gap-3">
              <p className={`text-xs leading-relaxed ${esLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Ingresa el correo electrónico asociado a tu cuenta para recibir tu código de recuperación de 6 dígitos:
              </p>
              <div>
                <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
                  Correo Registrado
                </label>
                <input
                  type="email"
                  value={emailRecuperacion}
                  onChange={(e) => setEmailRecuperacion(e.target.value)}
                  className={`w-full text-xs py-2 px-3 rounded-xl border font-bold outline-none ${
                    esLight
                      ? 'bg-slate-50 border-slate-400 text-slate-900 focus:bg-white focus:border-sky-600'
                      : 'bg-slate-900 border-slate-600 text-white focus:border-[#38bdf8]'
                  }`}
                  placeholder="tu_correo@unicauca.edu.co"
                  required
                />
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

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setModo('login'); setMensaje(''); }}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-slate-500/30 text-slate-400 hover:text-white cursor-pointer"
                >
                  Volver al Login
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 py-2 text-xs font-extrabold rounded-xl bg-sky-600 text-white hover:bg-sky-500 transition-all cursor-pointer shadow-md"
                >
                  {cargando ? 'Enviando...' : 'Enviar Código →'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRestablecerSubmit} className="flex flex-col gap-3">
              <div className={`p-2.5 rounded-xl border font-mono text-xs ${
                esLight ? 'bg-sky-50 border-sky-300 text-sky-900' : 'bg-sky-950/60 border-sky-500/40 text-sky-300'
              }`}>
                <span className="font-bold block">Correo: {emailRecuperacion}</span>
                <span>Ingresa el código de 6 dígitos generado para crear tu nueva clave.</span>
              </div>

              <div>
                <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
                  Código de Verificación (6 dígitos)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={codigoRecuperacion}
                  onChange={(e) => setCodigoRecuperacion(e.target.value)}
                  className={`w-full text-center tracking-widest text-sm font-mono py-2 px-3 rounded-xl border font-bold outline-none ${
                    esLight
                      ? 'bg-slate-50 border-slate-400 text-slate-900 focus:bg-white'
                      : 'bg-slate-900 border-slate-600 text-white'
                  }`}
                  placeholder="123456"
                  required
                />
              </div>

              <div>
                <label className={`text-xs font-mono font-bold block mb-1 ${esLight ? 'text-slate-800' : 'text-white/90'}`}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  className={`w-full text-xs py-2 px-3 rounded-xl border font-bold outline-none ${
                    esLight
                      ? 'bg-slate-50 border-slate-400 text-slate-900 focus:bg-white'
                      : 'bg-slate-900 border-slate-600 text-white'
                  }`}
                  placeholder="Nueva contraseña"
                  required
                />
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

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPasoRecuperar(1)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-slate-500/30 text-slate-400 hover:text-white cursor-pointer"
                >
                  ← Reenviar
                </button>
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex-1 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-md"
                >
                  {cargando ? 'Restableciendo...' : 'Restablecer Clave'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
