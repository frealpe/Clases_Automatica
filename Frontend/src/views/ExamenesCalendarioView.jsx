import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import Sidebar from '../components/Sidebar';
import ExamenProgramadoModal from '../components/ExamenProgramadoModal';
import { withAuth } from '../hocs/withAuth';
import { withRole } from '../hocs/withRole';

const ESTADO_ETIQUETA = {
  proximo: { texto: 'Próximo', color: '#38bdf8' },
  activo: { texto: 'Activo ahora', color: '#22c55e' },
  finalizado: { texto: 'Finalizado', color: '#94a3b8' },
  cancelado: { texto: 'Cancelado', color: '#ef4444' }
};

function formatearFecha(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-CO', {
    weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
  });
}

function ExamenesCalendarioViewBase() {
  const navigate = useNavigate();
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const setMateriaActiva = useCourseStore((state) => state.setMateriaActiva);
  const semanas = useCourseStore((state) => state.semanas);
  const examenesProgramados = useCourseStore((state) => state.examenesProgramados);
  const cargarExamenesMateriaFromService = useCourseStore((state) => state.cargarExamenesMateriaFromService);
  const eliminarExamenProgramado = useCourseStore((state) => state.eliminarExamenProgramado);
  const themeMode = useCourseStore((state) => state.themeMode);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [examenEditar, setExamenEditar] = useState(null);
  const [eliminando, setEliminando] = useState({});

  const esLight = themeMode === 'light';
  const materiaActiva = materias.find((m) => m.id === materiaActivaId) || materias[0];

  useEffect(() => {
    if (materiaActivaId) cargarExamenesMateriaFromService(materiaActivaId);
  }, [materiaActivaId, cargarExamenesMateriaFromService]);

  const examenesOrdenados = useMemo(
    () => [...examenesProgramados].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)),
    [examenesProgramados]
  );

  const handleEliminar = async (examen) => {
    const confirmacion = window.confirm(`¿Eliminar/cancelar el examen "${examen.titulo}"?`);
    if (!confirmacion) return;
    setEliminando((prev) => ({ ...prev, [examen.id]: true }));
    try {
      await eliminarExamenProgramado(examen.id);
    } catch (err) {
      window.alert(err?.response?.data?.mensaje || err?.response?.data?.message || 'Error al eliminar el examen');
    } finally {
      setEliminando((prev) => ({ ...prev, [examen.id]: false }));
    }
  };

  return (
    <div className="h-full w-full flex gap-6 items-start overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full w-full overflow-hidden gap-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/materias')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                esLight
                  ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                  : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">west</span>
              <span>Volver a Materias</span>
            </button>

            <div>
              <div className={`text-xs font-mono font-bold uppercase tracking-wider ${esLight ? 'text-sky-700' : 'text-[#38bdf8]'}`}>
                CALENDARIO DE EXÁMENES — [{materiaActiva?.codigo}]
              </div>
              <h1 className="text-xl font-extrabold leading-tight">
                {materiaActiva?.nombre} · {examenesOrdenados.length} programados
              </h1>
            </div>
          </div>

          <button
            onClick={() => { setExamenEditar(null); setModalAbierto(true); }}
            className="px-4 py-2 rounded-xl bg-[#38bdf8] text-black font-extrabold text-xs hover:bg-sky-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Nuevo Examen Programado</span>
          </button>
        </div>

        {/* SELECTOR DE MATERIA */}
        {materias.length > 1 && (
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest shrink-0">
            {materias.map((m) => (
              <button
                key={m.id}
                onClick={() => setMateriaActiva(m.id)}
                className={`transition-all cursor-pointer ${
                  m.id === materiaActivaId
                    ? `font-extrabold ${esLight ? 'text-sky-700' : 'text-[#38bdf8]'} border-b-2 border-current`
                    : 'text-slate-500 hover:opacity-100'
                }`}
              >
                / {m.nombre}
              </button>
            ))}
          </div>
        )}

        {/* AGENDA */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {examenesOrdenados.length === 0 && (
            <div className={`p-8 text-center font-mono text-xs rounded-2xl border ${
              esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}>
              <span className="material-symbols-outlined text-4xl block mb-2">event_busy</span>
              Todavía no hay exámenes programados para esta materia.
            </div>
          )}

          {examenesOrdenados.map((ex) => {
            const estado = ESTADO_ETIQUETA[ex.estadoCalculado] || ESTADO_ETIQUETA.proximo;
            return (
              <div
                key={ex.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/60 border-slate-800 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                      style={{ color: estado.color, borderColor: estado.color }}
                    >
                      {estado.texto}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {ex.duracionMin} min · {ex.cantidadTeoria} teoría + {ex.cantidadEjercicio} ejercicio
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold">{ex.titulo}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatearFecha(ex.fechaInicio)} → {formatearFecha(ex.fechaFin)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Temas: {(ex.semanas || []).map((s) => `Semana ${s.numero}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => { setExamenEditar(ex); setModalAbierto(true); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      esLight ? 'border-slate-300 hover:bg-slate-100' : 'border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(ex)}
                    disabled={eliminando[ex.id] || ex.estadoCalculado === 'cancelado'}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/50 text-red-400 hover:bg-red-500/10 cursor-pointer disabled:opacity-40"
                  >
                    {eliminando[ex.id] ? '...' : ex.estadoCalculado === 'cancelado' ? 'Cancelado' : 'Eliminar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <ExamenProgramadoModal
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setExamenEditar(null); }}
        materiaId={materiaActivaId}
        semanas={semanas}
        examen={examenEditar}
      />
    </div>
  );
}

export default withAuth(withRole(ExamenesCalendarioViewBase, ['DOCENTE']));
