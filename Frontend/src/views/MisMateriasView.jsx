import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import Sidebar from '../components/Sidebar';
import { withAuth } from '../hocs/withAuth';
import { withRole } from '../hocs/withRole';

function MisMateriasViewBase() {
  const navigate = useNavigate();
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const setMateriaActiva = useCourseStore((state) => state.setMateriaActiva);
  const themeMode = useCourseStore((state) => state.themeMode);

  const esLight = themeMode === 'light';
  const textoSecundario = esLight ? 'text-slate-600' : 'text-slate-400';

  const handleAbrirMateria = (materiaId) => {
    setMateriaActiva(materiaId);
    navigate('/material_apoyo');
  };

  return (
    <div className="h-full w-full flex gap-6 items-start overflow-hidden">
      {/* SIDEBAR UNIFICADO */}
      <Sidebar />

      {/* ÁREA PRINCIPAL: VISTA INICIAL INFORMATIVA DE MIS MATERIAS ASIGNADAS */}
      <main className="flex-1 flex flex-col justify-start gap-4 h-full w-full overflow-hidden">

        {/* HEADER */}
        <div className="shrink-0">
          <h2 className="text-xl font-extrabold tracking-tight">Mis Materias ({materias.length})</h2>
          <p className={`text-xs mt-0.5 ${textoSecundario}`}>
            Cursos que tienes asignados este semestre. Haz clic en cualquiera para ver su material.
          </p>
        </div>

        {materias.length === 0 && (
          <div className={`p-8 text-center rounded-2xl border shrink-0 ${
            esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}>
            <span className="material-symbols-outlined text-4xl block mb-2">folder_off</span>
            Aún no tienes materias asignadas.
          </div>
        )}

        {/* GRID DE TARJETAS INFORMATIVAS (SIN ACCIONES ADMINISTRATIVAS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {materias.map((m) => {
            const esActiva = m.id === materiaActivaId;
            return (
              <div
                key={m.id}
                onClick={() => handleAbrirMateria(m.id)}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative group ${
                  esActiva
                    ? esLight
                      ? 'bg-sky-50/90 border-sky-400 shadow-sm ring-2 ring-sky-500/20'
                      : 'bg-slate-900 border-[#38bdf8] shadow-md ring-2 ring-[#38bdf8]/30'
                    : esLight
                    ? 'bg-white border-slate-300 hover:border-slate-400 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Fila Superior: Título y Subtítulo */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-sm font-bold leading-snug">
                      {m.nombre}
                    </h3>
                    <p className={`text-[11px] mt-0.5 font-mono ${textoSecundario}`}>
                      [{m.codigo}] {m.semestre || '2026-1'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {m.numeroSemanas || m.semanasCount || 16} Semanas
                  </span>
                </div>

                {/* Subtítulo descriptor */}
                <p className={`text-xs my-2.5 line-clamp-2 leading-snug ${textoSecundario}`}>
                  {m.descripcion || m.subtitulo || 'Material pedagógico de la asignatura.'}
                </p>

                {/* ÚNICA ACCIÓN: VER MATERIAL */}
                <div className="pt-2 border-t border-slate-700/30">
                  <button
                    onClick={() => handleAbrirMateria(m.id)}
                    className={`w-full py-1.5 rounded-lg font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm ${
                      esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">auto_stories</span>
                    <span>Ver Material →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default withAuth(withRole(MisMateriasViewBase, ['DOCENTE', 'ESTUDIANTE', 'SUPERUSUARIO']));
