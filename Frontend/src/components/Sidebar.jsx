import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const themeMode = useCourseStore((state) => state.themeMode);
  const { esEstudiante } = useAuth();

  const [sidebarExpandido, setSidebarExpandido] = useState(true);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const esLight = themeMode === 'light';

  const esLabor = location.pathname.startsWith('/labor');
  const esExamenes = location.pathname.startsWith('/materias/examenes');
  const esMaterias = location.pathname.startsWith('/materias') && !esExamenes;
  const esMaterialApoyo = location.pathname.startsWith('/material_apoyo');
  const esUsuarios = location.pathname.startsWith('/usuarios');

  const textoSecundario = esLight ? 'text-slate-600' : 'text-slate-400';

  return (
    <>
      {/* 1. VERSIÓN DESKTOP (SIDEBAR LATERAL) */}
      <aside className={`hidden md:flex transition-all duration-300 flex-col shrink-0 h-full ${
        sidebarExpandido ? 'w-64' : 'w-16'
      }`}>
        <div className={`p-4 rounded-2xl border flex flex-col justify-between h-full ${
          esLight
            ? 'bg-white border-slate-300 text-slate-900 shadow-md'
            : 'bg-slate-900/90 border-slate-700 text-white shadow-xl backdrop-blur-xl'
        }`}>

          <div className="flex flex-col gap-4">
            {/* LOGO / ENCABEZADO SUPERIOR */}
            <div
              onClick={() => navigate('/labor')}
              className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                esLabor
                  ? esLight
                    ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-sm'
                    : 'bg-slate-800 border-slate-600 text-white shadow-md'
                  : esLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
              title="Ir a Mis Materias"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-lg text-[#38bdf8]">grid_view</span>
                {sidebarExpandido && <span>Universidad del Cauca</span>}
              </div>
            </div>

            <hr className={esLight ? 'border-slate-200' : 'border-slate-800'} />

            {/* SECCIÓN: GESTIÓN DE LA PLATAFORMA / ADMINISTRACIÓN */}
            <div className="flex flex-col gap-2.5">
              {sidebarExpandido && (
                <span className={`text-[10px] font-mono font-bold tracking-widest uppercase ${textoSecundario}`}>
                  GESTIÓN DE LA PLATAFORMA
                </span>
              )}

              <div className="flex flex-col gap-1.5">
                {/* 1. MATERIAL DE APOYO */}
                <button
                  onClick={() => navigate('/material_apoyo')}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                    esMaterialApoyo
                      ? esLight
                        ? 'bg-sky-100 border border-sky-300 text-sky-900 font-extrabold shadow-sm'
                        : 'bg-slate-800 border border-slate-600 text-[#38bdf8] font-extrabold shadow-sm'
                      : esLight
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-slate-400 hover:bg-slate-800/50'
                  }`}
                  title="Material de Apoyo Docente"
                >
                  <span className={`material-symbols-outlined text-base shrink-0 ${esMaterialApoyo ? 'text-[#38bdf8]' : ''}`}>
                    menu_book
                  </span>
                  {sidebarExpandido && <span>Material de Apoyo</span>}
                </button>

                {/* 2-5. ADMINISTRACIÓN */}
                {!esEstudiante && (
                  <>
                    <button
                      onClick={() => navigate('/usuarios')}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                        esUsuarios
                          ? esLight
                            ? 'bg-sky-100 border border-sky-300 text-sky-900 font-extrabold shadow-sm'
                            : 'bg-slate-800 border border-slate-600 text-[#38bdf8] font-extrabold shadow-sm'
                          : esLight
                          ? 'text-slate-600 hover:bg-slate-100'
                          : 'text-slate-400 hover:bg-slate-800/50'
                      }`}
                      title="Gestión de Usuarios y Matrículas"
                    >
                      <span className={`material-symbols-outlined text-base shrink-0 ${esUsuarios ? 'text-[#38bdf8]' : ''}`}>
                        manage_accounts
                      </span>
                      {sidebarExpandido && <span>Usuarios / Matrículas</span>}
                    </button>

                    <button
                      onClick={() => navigate('/materias/examenes')}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                        esExamenes
                          ? esLight
                            ? 'bg-sky-100 border border-sky-300 text-sky-900 font-extrabold shadow-sm'
                            : 'bg-slate-800 border border-slate-600 text-[#38bdf8] font-extrabold shadow-sm'
                          : esLight
                          ? 'text-slate-600 hover:bg-slate-100'
                          : 'text-slate-400 hover:bg-slate-800/50'
                      }`}
                      title="Parámetros y Evaluaciones"
                    >
                      <span className={`material-symbols-outlined text-base shrink-0 ${esExamenes ? 'text-[#38bdf8]' : ''}`}>tune</span>
                      {sidebarExpandido && <span>Parámetros / Evaluaciones</span>}
                    </button>

                    <button
                      onClick={() => navigate('/materias')}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                        esLight ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800/50'
                      }`}
                      title="Auditoría e Infracciones Anti-IA"
                    >
                      <span className="material-symbols-outlined text-base shrink-0">verified_user</span>
                      {sidebarExpandido && <span>Auditoría / Anti-IA</span>}
                    </button>

                    <button
                      onClick={() => navigate('/materias')}
                      className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all cursor-pointer ${
                        esMaterias
                          ? esLight
                            ? 'bg-slate-200 text-slate-900 font-extrabold shadow-sm border border-slate-300'
                            : 'bg-sky-500/20 border border-sky-500/40 text-[#38bdf8] font-extrabold shadow-sm'
                          : esLight
                          ? 'text-slate-600 hover:bg-slate-100'
                          : 'text-slate-400 hover:bg-slate-800/50'
                      }`}
                      title="Administración de Materias"
                    >
                      <span className={`material-symbols-outlined text-base shrink-0 ${esMaterias ? 'text-[#38bdf8]' : ''}`}>
                        folder
                      </span>
                      {sidebarExpandido && <span>Materias</span>}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700/40">
            <button
              onClick={() => setSidebarExpandido(!sidebarExpandido)}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 w-full ${
                esLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Colapsar / Desplegar Menú Lateral"
            >
              <span className="material-symbols-outlined text-base shrink-0">
                {sidebarExpandido ? 'west' : 'east'}
              </span>
              {sidebarExpandido && <span>Colapsar Menú</span>}
            </button>
          </div>

        </div>
      </aside>

      {/* 2. VERSIÓN MÓVIL (MENÚ DESPLEGABLE HORIZONTAL EN SMARTPHONES) */}
      <div className="block md:hidden w-full mb-3 shrink-0">
        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
          esLight ? 'bg-white border-slate-300 text-slate-900 shadow-sm' : 'bg-slate-900 border-slate-700 text-white shadow-md'
        }`}>
          <button
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            className="flex items-center gap-2 text-xs font-bold"
          >
            <span className="material-symbols-outlined text-lg text-sky-500">menu</span>
            <span>Menú de Navegación del Curso</span>
          </button>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
            Móvil
          </span>
        </div>

        {menuMovilAbierto && (
          <div className={`mt-2 p-3 rounded-xl border flex flex-col gap-2 transition-all animate-fadeIn ${
            esLight ? 'bg-white border-slate-300 text-slate-900 shadow-xl' : 'bg-slate-900 border-slate-700 text-white'
          }`}>
            <button
              onClick={() => { navigate('/material_apoyo'); setMenuMovilAbierto(false); }}
              className="p-2 text-xs font-bold flex items-center gap-2 border-b border-slate-500/20"
            >
              <span className="material-symbols-outlined text-base text-sky-500">menu_book</span>
              Material de Apoyo
            </button>

            {!esEstudiante && (
              <>
                <button
                  onClick={() => { navigate('/usuarios'); setMenuMovilAbierto(false); }}
                  className="p-2 text-xs font-bold flex items-center gap-2 border-b border-slate-500/20"
                >
                  <span className="material-symbols-outlined text-base text-sky-500">manage_accounts</span>
                  Usuarios / Matrículas
                </button>

                <button
                  onClick={() => { navigate('/materias/examenes'); setMenuMovilAbierto(false); }}
                  className="p-2 text-xs font-bold flex items-center gap-2 border-b border-slate-500/20"
                >
                  <span className="material-symbols-outlined text-base text-sky-500">tune</span>
                  Parámetros / Evaluaciones
                </button>

                <button
                  onClick={() => { navigate('/materias'); setMenuMovilAbierto(false); }}
                  className="p-2 text-xs font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-sky-500">folder</span>
                  Gestión de Materias
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
