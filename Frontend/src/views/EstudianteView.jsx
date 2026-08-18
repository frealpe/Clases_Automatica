import React, { useState, useEffect, useMemo } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import ExamenModal from '../components/ExamenModal';

function formatearFechaCorta(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function EstudianteView() {
  const semanas = useCourseStore((state) => state.semanas);
  const usuario = useCourseStore((state) => state.usuario);
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const setMateriaActiva = useCourseStore((state) => state.setMateriaActiva);
  const themeMode = useCourseStore((state) => state.themeMode);
  const examenesProgramados = useCourseStore((state) => state.examenesProgramados);
  const cargarMisExamenesFromService = useCourseStore((state) => state.cargarMisExamenesFromService);

  const [semanaExamen, setSemanaExamen] = useState(null);
  const [examenProgramadoActivo, setExamenProgramadoActivo] = useState(null);
  const [modalSemanasAbierto, setModalSemanasAbierto] = useState(false);

  useEffect(() => {
    if (usuario?.rol === 'ESTUDIANTE') cargarMisExamenesFromService();
  }, [usuario, cargarMisExamenesFromService]);

  const examenesPendientes = useMemo(
    () => examenesProgramados
      .filter((ex) => ex.estadoCalculado === 'activo' || ex.estadoCalculado === 'proximo')
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)),
    [examenesProgramados]
  );

  const esLight = themeMode === 'light';
  const materiaActiva = materias.find((m) => m.id === materiaActivaId) || materias[0];
  const carpetaNotas = (numero) => `/notas/semana-${numero}`;

  // Clases adaptativas de alto contraste para ambos temas (Light & Dark)
  const textoTitulo = esLight ? 'text-slate-900' : 'text-white';
  const textoSub = esLight ? 'text-slate-700 font-medium' : 'text-slate-200 font-medium';
  const textoMuted = esLight ? 'text-slate-600' : 'text-slate-400';
  const acentoCian = esLight ? 'text-sky-700 font-bold' : 'text-[#38bdf8] font-bold';
  const borderAcento = esLight ? 'border-sky-700' : 'border-[#38bdf8]';
  const btnBotonModal = esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100';

  const getMateriaIcon = (codigo, index) => {
    if (codigo?.includes('MAT')) return 'calculate';
    if (codigo?.includes('PRG')) return 'code';
    if (codigo?.includes('VIS')) return 'visibility';
    if (codigo?.includes('ENF')) return 'memory';
    const icons = ['menu_book', 'terminal', 'science', 'precision_manufacturing'];
    return icons[index % icons.length];
  };

  const getMateriaStyles = (codigo, index) => {
    const styles = [
      {
        badge: esLight ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-sky-500/20 text-sky-300 border-sky-500/30',
        icon: esLight ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-[#5056AC]/40 text-white border-[#38bdf8]/50 group-hover:bg-[#5056AC]',
        activeBorder: esLight ? 'border-sky-600 bg-sky-50/70 shadow-lg' : 'border-[#38bdf8] bg-sky-950/30 shadow-lg'
      },
      {
        badge: esLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        icon: esLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-600/40 text-white border-emerald-400/50 group-hover:bg-emerald-600',
        activeBorder: esLight ? 'border-emerald-600 bg-emerald-50/70 shadow-lg' : 'border-emerald-400 bg-emerald-950/30 shadow-lg'
      },
      {
        badge: esLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        icon: esLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-[#b31b1b]/40 text-white border-amber-400/50 group-hover:bg-[#b31b1b]',
        activeBorder: esLight ? 'border-amber-600 bg-amber-50/70 shadow-lg' : 'border-amber-500 bg-amber-950/30 shadow-lg'
      },
      {
        badge: esLight ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        icon: esLight ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : 'bg-[#38bdf8]/30 text-white border-[#38bdf8]/50 group-hover:bg-[#38bdf8]/60',
        activeBorder: esLight ? 'border-indigo-600 bg-indigo-50/70 shadow-lg' : 'border-indigo-400 bg-indigo-950/30 shadow-lg'
      }
    ];
    return styles[index % styles.length];
  };

  return (
    <div className="h-full w-full flex flex-col justify-between py-2 relative z-10 overflow-hidden">
      {/* 1. SECCIÓN HERO TITULAR */}
      <div className="flex flex-col justify-center gap-3">
        {/* Tags de Asignatura */}
        <div className={`flex items-center gap-4 font-mono text-xs uppercase tracking-widest ${acentoCian}`}>
          {materias.map((m) => (
            <button
              key={m.id}
              onClick={() => setMateriaActiva(m.id)}
              className={`transition-all cursor-pointer ${
                m.id === materiaActivaId ? `font-extrabold ${acentoCian} border-b-2 ${borderAcento}` : `${textoMuted} hover:opacity-100`
              }`}
            >
              / {m.nombre}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className={`text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight ${textoTitulo}`}>
              Claro. Preciso.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5056AC] via-[#38bdf8] to-[#a7c8ff]">
                Automatizado.
              </span>
            </h1>
            <p className={`text-xs sm:text-sm max-w-xl mt-1.5 leading-relaxed ${textoSub}`}>
              Departamento de Instrumentación y Control — Universidad del Cauca.<br />
              Plataforma docente interactiva para formación en Ingeniería en Automática Industrial.
            </p>
          </div>

          {/* Tarjeta del Docente / Perfil Activo de Alto Contraste Adaptativa */}
          <div className="glass-panel p-4 flex items-center gap-3.5 rounded-2xl shadow-2xl overflow-hidden shrink-0">
            <div className={`w-10 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              esLight ? 'bg-sky-100 border border-sky-300 text-sky-900' : 'bg-[#5056AC]/50 border border-[#38bdf8]/40 text-white'
            }`}>
              <span className="material-symbols-outlined text-2xl">person_filled</span>
            </div>
            <div>
              <div className={`text-xs font-bold ${textoTitulo}`}>
                {usuario?.nombre ? usuario.nombre : 'Prof. Fabio Hernán Realpe'}
              </div>
              <div className={`text-[10px] font-mono ${textoMuted}`}>
                {usuario?.rol ? `Rol: ${usuario.rol} · Docente Ocasional Tiempo Completo` : 'Docente Ocasional Tiempo Completo · Unicauca'}
              </div>
              <div className={`text-[11px] font-bold ${acentoCian} mt-0.5`}>
                Ingeniería en Automática Industrial
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TARJETAS DINÁMICAS DE MATERIAS ASIGNADAS */}
      <div className={`grid grid-cols-1 gap-4 my-1 ${
        materias.length === 1 ? 'md:grid-cols-1' :
        materias.length === 2 ? 'md:grid-cols-2' :
        materias.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {materias.map((m, idx) => {
          const esActiva = m.id === materiaActivaId;
          const style = getMateriaStyles(m.codigo, idx);
          const icon = getMateriaIcon(m.codigo, idx);

          return (
            <div
              key={m.id}
              onClick={() => setMateriaActiva(m.id)}
              className={`glass-panel p-4 sm:p-5 rounded-2xl flex flex-col justify-between group cursor-pointer overflow-hidden transition-all duration-300 border ${
                esActiva ? style.activeBorder : 'border-slate-300/40 hover:scale-[1.01]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${style.icon}`}>
                      <span className="material-symbols-outlined text-lg">{icon}</span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                      {m.codigo}
                    </span>
                  </div>

                  {esActiva && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                      Activa
                    </span>
                  )}
                </div>

                <h3 className={`text-sm sm:text-base font-extrabold leading-snug ${textoTitulo}`}>
                  {m.nombre}
                </h3>
                <p className={`text-xs mt-2 leading-relaxed line-clamp-3 break-words ${textoSub}`}>
                  {m.descripcion}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className={textoMuted}>{m.semestre || '2026-1'}</span>
                <span className={`font-bold flex items-center gap-1 ${esActiva ? acentoCian : textoMuted}`}>
                  {esActiva ? 'Seleccionada' : 'Seleccionar'}
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2.5 AGENDA DE EXÁMENES PROGRAMADOS (calendario con ventana de fecha/hora) */}
      {examenesPendientes.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl flex flex-col gap-2.5 overflow-hidden">
          <div className={`text-xs font-mono font-bold uppercase tracking-wider ${esLight ? 'text-sky-700' : 'text-[#38bdf8]'}`}>
            🗓️ Exámenes Programados
          </div>
          {examenesPendientes.map((ex) => {
            const activo = ex.estadoCalculado === 'activo';
            return (
              <div key={ex.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-b border-white/10 last:border-b-0">
                <div>
                  <div className={`text-sm font-extrabold ${textoTitulo}`}>{ex.titulo}</div>
                  <div className={`text-[11px] font-mono ${textoMuted}`}>
                    {ex.materiaNombre ? `${ex.materiaNombre} · ` : ''}
                    {activo ? 'Disponible ahora hasta' : 'Abre'} {formatearFechaCorta(activo ? ex.fechaFin : ex.fechaInicio)}
                    {' · '}{ex.duracionMin} min
                  </div>
                </div>
                <button
                  onClick={() => setExamenProgramadoActivo(ex)}
                  disabled={!activo}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${btnBotonModal}`}
                >
                  {activo ? 'Presentar ahora' : 'Aún no disponible'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. BARRA DE ACCESO RÁPIDO A EVALUACIONES Y MATERIALES */}
      <div className="glass-panel p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined text-3xl ${acentoCian}`}>menu_book</span>
          <div>
            <div className={`text-xs font-mono font-bold uppercase tracking-wider ${acentoCian}`}>
              Asignatura: [{materiaActiva?.codigo}] {materiaActiva?.nombre}
            </div>
            <div className={`text-xs sm:text-sm font-extrabold ${textoTitulo}`}>
              Accede al Banco de Evaluaciones, PDFs y Diapositivas
            </div>
          </div>
        </div>

        <button
          onClick={() => setModalSemanasAbierto(true)}
          className={`rounded-full px-6 py-2.5 text-xs font-black transition-all flex items-center gap-2 shadow-2xl cursor-pointer whitespace-nowrap ${btnBotonModal}`}
        >
          <span className="material-symbols-outlined text-base">quiz</span>
          Ver Semanas y Presentar Test ({semanas.length})
        </button>
      </div>

      {/* 4. FOOTER PANTALLA ÚNICA */}
      <footer className={`w-full pt-1.5 flex justify-between items-center text-[10px] sm:text-[11px] font-mono border-t ${
        esLight ? 'border-slate-300 text-slate-600' : 'border-white/15 text-white/70'
      }`}>
        <div>© 2026 Universidad del Cauca · Departamento de Instrumentación y Control</div>
        <div>Prof. Fabio Hernán Realpe</div>
      </footer>

      {/* MODAL GLASS CON EL BANCO DE SEMANAS Y MATERIALES */}
      {modalSemanasAbierto && (
        <div className="modal-overlay">
          <div className="modal-content max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className={`flex justify-between items-center mb-6 pb-4 border-b ${
              esLight ? 'border-slate-300' : 'border-slate-700'
            }`}>
              <div>
                <span className={`text-xs font-mono font-bold ${acentoCian}`}>
                  [{materiaActiva?.codigo}] {materiaActiva?.nombre}
                </span>
                <h2 className={`text-2xl font-bold ${textoTitulo}`}>Plan Semanal de Evaluaciones</h2>
              </div>

              <button
                onClick={() => setModalSemanasAbierto(false)}
                className={`text-2xl font-bold p-1 cursor-pointer ${textoMuted} hover:opacity-100`}
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {semanas.length === 0 ? (
                <div className={`p-8 text-center col-span-2 font-mono text-xs rounded-2xl border ${
                  esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/80 border-slate-700 text-slate-300'
                }`}>
                  <span className={`material-symbols-outlined text-4xl block mb-2 ${acentoCian}`}>folder_off</span>
                  Esta asignatura ([{materiaActiva?.codigo}] {materiaActiva?.nombre}) aún no cuenta con guías redactadas ni evaluaciones registradas en las carpetas docentes.
                </div>
              ) : (
                semanas.map((s) => (
                  <div key={s.id} className="glass-panel p-5 rounded-xl flex flex-col justify-between overflow-hidden">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                          esLight ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/40'
                        }`}>
                          Semana {s.numero}
                        </span>
                        <span className={`text-[11px] font-mono ${textoMuted}`}>
                          {s.ra}
                        </span>
                      </div>

                      <h4 className={`text-base font-bold mb-1 ${textoTitulo}`}>
                        {s.unidad}
                      </h4>

                      <p className={`text-xs mb-3 ${textoMuted}`}>
                        ⏱ Límite: {s.min} minutos
                      </p>

                      {s.raDescripcion && (
                        <p className={`text-xs p-2.5 rounded-lg mb-4 leading-relaxed font-medium border ${
                          esLight ? 'bg-slate-100 text-slate-800 border-slate-200' : 'bg-slate-950/80 text-slate-200 border-slate-800'
                        }`}>
                          {s.raDescripcion}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <a
                          href={`${carpetaNotas(s.numero)}/guia.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 rounded text-xs border font-bold no-underline ${
                            esLight ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300' : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                          }`}
                        >
                          📋 Guía
                        </a>
                        <a
                          href={`${carpetaNotas(s.numero)}/notas.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 rounded text-xs border font-bold no-underline ${
                            esLight ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300' : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                          }`}
                        >
                          📖 Notas
                        </a>
                        <a
                          href={`${carpetaNotas(s.numero)}/diapositivas.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 rounded text-xs border font-bold no-underline ${
                            esLight ? 'bg-slate-200 border-slate-300 text-slate-800 hover:bg-slate-300' : 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
                          }`}
                        >
                          📊 Slides
                        </a>
                      </div>

                      <button
                        onClick={() => setSemanaExamen(s)}
                        className={`w-full py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md ${btnBotonModal}`}
                      >
                        Presentar Evaluación
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EVALUACIÓN INTERACTIVA (bajo demanda, por semana) */}
      {semanaExamen && (
        <ExamenModal
          isOpen={Boolean(semanaExamen)}
          onClose={() => setSemanaExamen(null)}
          semana={semanaExamen}
        />
      )}

      {/* MODAL DE EXAMEN PROGRAMADO (calendario + fullscreen + detección de infracciones) */}
      {examenProgramadoActivo && (
        <ExamenModal
          isOpen={Boolean(examenProgramadoActivo)}
          onClose={() => { setExamenProgramadoActivo(null); cargarMisExamenesFromService(); }}
          examenProgramado={examenProgramadoActivo}
        />
      )}
    </div>
  );
}
