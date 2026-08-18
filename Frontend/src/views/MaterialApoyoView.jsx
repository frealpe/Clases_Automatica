import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import { semanasService } from '../services/semanas.service';
import { API_URL } from '../services/apiClient';
import Sidebar from '../components/Sidebar';
import ExamenModal from '../components/ExamenModal';
import NotasSemana01 from '../components/NotasSemana01';

export default function MaterialApoyoView() {
  const navigate = useNavigate();
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const setMateriaActiva = useCourseStore((state) => state.setMateriaActiva);
  const semanas = useCourseStore((state) => state.semanas);
  const themeMode = useCourseStore((state) => state.themeMode);

  // Estado de la semana seleccionada para ver la clase en formato Página Web desde la BD
  const [semanaClaseActiva, setSemanaClaseActiva] = useState(null);
  const [contenidoDB, setContenidoDB] = useState(null);
  const [semanaExamen, setSemanaExamen] = useState(null);

  const esLight = themeMode === 'light';
  const materiaActiva = materias.find((m) => m.id === materiaActivaId) || materias[0];

  const textoTitulo = esLight ? 'text-slate-900' : 'text-white';
  const textoMuted = esLight ? 'text-slate-600' : 'text-slate-400';
  const acentoCian = esLight ? 'text-sky-700 font-bold' : 'text-[#38bdf8] font-bold';
  const btnBotonModal = esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100';

  const handleAbrirClaseEnHoja = async (semana) => {
    setSemanaClaseActiva(semana);
    setContenidoDB(null);
    if (semana?.id) {
      const resDetalle = await semanasService.getSemanaById(semana.id);
      if (resDetalle && resDetalle.contenidoJson) {
        setContenidoDB(resDetalle.contenidoJson);
      }
    }
  };

  // Paginación Continua (Anterior / Siguiente Semana)
  const idxClaseActual = semanaClaseActiva ? semanas.findIndex((s) => s.id === semanaClaseActiva.id) : -1;
  const semanaAnterior = idxClaseActual > 0 ? semanas[idxClaseActual - 1] : null;
  const semanaSiguiente = idxClaseActual >= 0 && idxClaseActual < semanas.length - 1 ? semanas[idxClaseActual + 1] : null;

  return (
    <div className="h-full w-full flex gap-6 items-start overflow-hidden">
      {/* BARRA DE MENÚ LATERAL PERSISTENTE UNIFICADA */}
      <Sidebar />

      {/* ÁREA PRINCIPAL CON EL MATERIAL DE APOYO */}
      <main className="flex-1 flex flex-col justify-start gap-3 h-full w-full overflow-hidden">
        
        {/* VISTA A: LECTURA DE CLASE WEB DESDE LA BD CON NAVEGACIÓN CONTINUA */}
        {semanaClaseActiva ? (
          <div className={`flex-1 flex flex-col h-full w-full overflow-hidden rounded-2xl border shadow-2xl p-5 transition-all ${
            esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900/95 border-slate-700 text-white'
          }`}>
            {/* Header Superior del Visor: Cuadrícula + navegación Anterior/Siguiente */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3.5 border-b border-slate-700/50 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSemanaClaseActiva(null)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm ${
                    esLight
                      ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                      : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                  }`}
                  title="Volver a la vista de cuadrícula de semanas"
                >
                  <span className="material-symbols-outlined text-base">grid_view</span>
                  <span className="hidden sm:inline">Cuadrícula</span>
                </button>

                {/* BOTÓN ANTERIOR */}
                <button
                  disabled={!semanaAnterior}
                  onClick={() => semanaAnterior && handleAbrirClaseEnHoja(semanaAnterior)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    semanaAnterior
                      ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
                      : 'bg-slate-950 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">west</span>
                  <span>Sem. {semanaAnterior ? semanaAnterior.numero : '--'}</span>
                </button>

                {/* BOTÓN SIGUIENTE */}
                <button
                  disabled={!semanaSiguiente}
                  onClick={() => semanaSiguiente && handleAbrirClaseEnHoja(semanaSiguiente)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    semanaSiguiente
                      ? 'bg-sky-600 border-sky-500 text-white hover:bg-sky-700 shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span>Sem. {semanaSiguiente ? semanaSiguiente.numero : '--'}</span>
                  <span className="material-symbols-outlined text-base">east</span>
                </button>
              </div>
            </div>

            {/* BARRA SECUNDARIA */}
            <div className="flex justify-between items-center py-2 px-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs shrink-0 my-2">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="px-2 py-0.5 rounded bg-[#38bdf8]/20 border border-[#38bdf8]/40 text-[#38bdf8] font-mono text-xs font-bold shrink-0">
                  Semana {semanaClaseActiva.numero} / {semanas.length}
                </span>
                <span className="font-extrabold text-white truncate">
                  {semanaClaseActiva.unidad}
                </span>
              </div>

              <button
                onClick={() => setSemanaExamen(semanaClaseActiva)}
                className="px-3 py-1 rounded-lg bg-white text-black font-extrabold text-xs hover:bg-slate-100 transition-all flex items-center gap-1 shadow-md cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm">quiz</span>
                <span>Presentar Test</span>
              </button>
            </div>

            {/* ÁREA DE CONTENIDO NATIVO WEB RECUPERADO DINÁMICAMENTE DE LA BASE DE DATOS */}
            <div className="flex-1 overflow-y-auto pt-2 pr-1">
              {semanaClaseActiva?.claseWebUrl ? (
                <iframe
                  src={`${API_URL}${semanaClaseActiva.claseWebUrl}`}
                  title={`Material Web — Sesión ${semanaClaseActiva.numero}`}
                  className="w-full h-full min-h-[70vh] border-0 rounded-xl bg-white"
                />
              ) : (
                <NotasSemana01
                  contenidoDB={contenidoDB}
                  onAbrirTest={() => setSemanaExamen(semanaClaseActiva)}
                />
              )}
            </div>
          </div>
        ) : (
          /* VISTA B: CUADRÍCULA DE TARJETAS DE SEMANAS (4 POR FILA) */
          <>
            {/* 1. HEADER DE MATERIAL DE APOYO */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 pb-2 border-b border-slate-700/40">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/labor')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    esLight
                      ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                      : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
                  }`}
                  title="Volver a Mis Materias"
                >
                  <span className="material-symbols-outlined text-base">west</span>
                  <span>Volver a Mis Materias</span>
                </button>

                <div>
                  <div className={`text-xs font-mono font-bold uppercase tracking-wider ${acentoCian}`}>
                    MATERIAL DE APOYO DOCENTE — [{materiaActiva?.codigo}]
                  </div>
                  <h1 className={`text-xl font-extrabold leading-tight ${textoTitulo}`}>
                    {materiaActiva?.nombre}
                  </h1>
                </div>
              </div>

              {/* Selector de Materia */}
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold ${textoMuted}`}>Asignatura:</span>
                <select
                  value={materiaActivaId}
                  onChange={(e) => setMateriaActiva(Number(e.target.value))}
                  className={`text-xs border rounded-xl px-3 py-1.5 outline-none font-bold cursor-pointer ${
                    esLight
                      ? 'bg-white text-slate-900 border-slate-300 shadow-sm'
                      : 'bg-slate-900 text-white border-slate-700 shadow-sm'
                  }`}
                >
                  {materias.map((m) => (
                    <option key={m.id} value={m.id} className={esLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-white'}>
                      [{m.codigo}] {m.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. GRID ULTRA COMPACTO DE 4 TARJETAS POR FILA */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 pb-4">
                {semanas.length === 0 ? (
                  <div className={`p-8 text-center col-span-4 font-mono text-xs rounded-2xl border ${
                    esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/80 border-slate-700 text-slate-300'
                  }`}>
                    <span className={`material-symbols-outlined text-4xl block mb-2 ${acentoCian}`}>folder_off</span>
                    Esta asignatura ([{materiaActiva?.codigo}] {materiaActiva?.nombre}) aún no cuenta con guías redactadas ni evaluaciones registradas.
                  </div>
                ) : (
                  semanas.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleAbrirClaseEnHoja(s)}
                      className="glass-panel p-3.5 rounded-xl flex flex-col justify-between overflow-hidden shadow-sm group cursor-pointer hover:border-[#38bdf8] transition-all"
                    >
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            esLight ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40'
                          }`}>
                            Semana {s.numero}
                          </span>
                          <span className={`text-[10px] font-mono ${textoMuted}`}>
                            ⏱ {s.min}m
                          </span>
                        </div>

                        <h3 className={`text-xs font-bold mb-1 line-clamp-1 group-hover:text-[#38bdf8] transition-colors ${textoTitulo}`} title={s.unidad}>
                          {s.unidad}
                        </h3>

                        {s.raDescripcion && (
                          <p className={`text-[10px] p-2 rounded mb-2.5 leading-relaxed font-medium line-clamp-2 border ${
                            esLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-950/80 text-slate-200 border-slate-800'
                          }`} title={s.raDescripcion}>
                            {s.raDescripcion}
                          </p>
                        )}
                      </div>

                      <div>
                        {/* BOTONES DE DESCARGA PDF RAPIDOS (URL real de esta semana/materia, servida por el backend) */}
                        <div className="flex flex-wrap gap-1 mb-2 pt-1.5 border-t border-slate-700/30">
                          {s.guiaPdfUrl && (
                            <a
                              href={`${API_URL}${s.guiaPdfUrl}`}
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-0.5 rounded text-[10px] border font-bold bg-slate-800 border-slate-600 text-sky-300 flex items-center gap-0.5 hover:bg-slate-700 no-underline"
                            >
                              📥 Guía
                            </a>
                          )}
                          {s.notasPdfUrl && (
                            <a
                              href={`${API_URL}${s.notasPdfUrl}`}
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-0.5 rounded text-[10px] border font-bold bg-slate-800 border-slate-600 text-emerald-300 flex items-center gap-0.5 hover:bg-slate-700 no-underline"
                            >
                              📥 Notas
                            </a>
                          )}
                          {s.diapositivasPdfUrl && (
                            <a
                              href={`${API_URL}${s.diapositivasPdfUrl}`}
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-0.5 rounded text-[10px] border font-bold bg-slate-800 border-slate-600 text-violet-300 flex items-center gap-0.5 hover:bg-slate-700 no-underline"
                            >
                              📥 Slides
                            </a>
                          )}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAbrirClaseEnHoja(s);
                          }}
                          className={`w-full py-1.5 rounded text-[10px] font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm ${btnBotonModal}`}
                        >
                          <span className="material-symbols-outlined text-xs">auto_stories</span>
                          <span>Abrir Clase Web →</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* MODAL DE EVALUACIÓN INTERACTIVA */}
      {semanaExamen && (
        <ExamenModal
          isOpen={Boolean(semanaExamen)}
          onClose={() => setSemanaExamen(null)}
          semana={semanaExamen}
        />
      )}
    </div>
  );
}
