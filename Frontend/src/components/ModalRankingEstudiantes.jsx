import React, { useState, useEffect } from 'react';
import { visitasService } from '../services/visitas.service';
import { useCourseStore } from '../store/useCourseStore';

export default function ModalRankingEstudiantes({ isOpen, onClose }) {
  const themeMode = useCourseStore((state) => state.themeMode);
  const esLight  = themeMode === 'light';

  const [estudiantes, setEstudiantes] = useState([]);
  const [busqueda, setBusqueda]       = useState('');
  const [cargando, setCargando]       = useState(false);
  const [statsGlobales, setStatsGlobales] = useState({ totalAlumnos: 0, vistasTotales: 0 });

  useEffect(() => {
    if (!isOpen) return;
    const cargarRanking = async () => {
      setCargando(true);
      const res = await visitasService.getRankingEstudiantes();
      if (res && res.ok) {
        setEstudiantes(res.estudiantes || []);
        setStatsGlobales({
          totalAlumnos: res.totalAlumnos || (res.estudiantes?.length || 0),
          vistasTotales: res.vistasTotales || 0,
        });
      }
      setCargando(false);
    };
    cargarRanking();
  }, [isOpen]);

  if (!isOpen) return null;

  const estudiantesFiltrados = estudiantes.filter((est) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    return (
      (est.nombre || '').toLowerCase().includes(q) ||
      (est.email || '').toLowerCase().includes(q) ||
      (est.codigoEstudiantil || '').toLowerCase().includes(q)
    );
  });

  const maxVistas = Math.max(...estudiantes.map((e) => Number(e.totalVistas || 0)), 1);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return 'Sin actividad registrada';
    const f = new Date(fechaStr);
    return f.toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
        }`}
      >
        {/* CABECERA DEL MODAL */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 shrink-0 ${
          esLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#38bdf8]/20 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shrink-0">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold leading-tight">
                Auditoría de Actividad e Ingresos de Alumnos
              </h2>
              <p className={`text-xs font-mono ${esLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Ranking de estudiantes autenticados (logueados) que más consultan la plataforma
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              esLight
                ? 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* TARJETAS RESUMEN DE ACTIVIDAD */}
        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-slate-700/30 shrink-0">
          <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
            esLight ? 'bg-sky-50 border-sky-200' : 'bg-sky-500/10 border-sky-500/30'
          }`}>
            <span className="material-symbols-outlined text-2xl text-sky-400">group</span>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">Total Alumnos</div>
              <div className="text-lg font-extrabold">{statsGlobales.totalAlumnos} Registrados</div>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
            esLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <span className="material-symbols-outlined text-2xl text-emerald-400">visibility</span>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">Vistas Generales</div>
              <div className="text-lg font-extrabold">{statsGlobales.vistasTotales} Interacciones</div>
            </div>
          </div>

          <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
            esLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/30'
          }`}>
            <span className="material-symbols-outlined text-2xl text-amber-400">emoji_events</span>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Alumno Más Activo</div>
              <div className="text-sm font-extrabold truncate max-w-[170px]">
                {estudiantes[0]?.nombre || 'Sin datos'}
              </div>
            </div>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTRADO */}
        <div className="p-3 sm:p-4 pb-0 flex items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-slate-400">search</span>
            <input
              type="text"
              placeholder="Buscar estudiante por nombre, email o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border outline-none transition-all font-medium ${
                esLight
                  ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-sky-600'
                  : 'bg-slate-950 border-slate-700 text-white focus:border-[#38bdf8]'
              }`}
            />
          </div>
        </div>

        {/* TABLA DE AUDITORÍA Y RANKING */}
        <div className="p-3 sm:p-5 flex-1 overflow-y-auto">
          {cargando ? (
            <div className="p-10 text-center font-mono text-xs text-sky-400 animate-pulse">
              Cargando estadísticas y ranking de estudiantes...
            </div>
          ) : estudiantesFiltrados.length === 0 ? (
            <div className={`p-8 text-center rounded-2xl border font-mono text-xs ${
              esLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}>
              No se encontraron alumnos con el criterio de búsqueda "{busqueda}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-[10px] font-mono uppercase tracking-wider border-b ${
                    esLight ? 'text-slate-600 border-slate-200' : 'text-slate-400 border-slate-800'
                  }`}>
                    <th className="pb-2.5 pl-2 font-bold w-10">#</th>
                    <th className="pb-2.5 font-bold">Estudiante</th>
                    <th className="pb-2.5 font-bold hidden sm:table-cell">Código</th>
                    <th className="pb-2.5 font-bold">Vistas e Ingresos</th>
                    <th className="pb-2.5 font-bold pr-2 text-right">Último Ingreso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/20 text-xs">
                  {estudiantesFiltrados.map((est, idx) => {
                    const vistas = Number(est.totalVistas || 0);
                    const porcentaje = Math.min(Math.round((vistas / maxVistas) * 100), 100);

                    return (
                      <tr key={est.id || idx} className={`transition-colors ${
                        esLight ? 'hover:bg-slate-100/70' : 'hover:bg-slate-800/40'
                      }`}>
                        {/* Posición */}
                        <td className="py-3 pl-2 font-mono font-bold">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                        </td>

                        {/* Datos Estudiante */}
                        <td className="py-3">
                          <div className="font-bold">{est.nombre}</div>
                          <div className={`text-[10px] font-mono ${esLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            {est.email}
                          </div>
                        </td>

                        {/* Código */}
                        <td className="py-3 hidden sm:table-cell font-mono text-[11px]">
                          {est.codigoEstudiantil ? (
                            <span className="px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700 text-sky-300 font-bold">
                              {est.codigoEstudiantil}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>

                        {/* Vistas e Ingresos con Barra Visual */}
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-sm text-[#38bdf8]">
                              {vistas}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">vistas</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(porcentaje, 4)}%` }}
                            ></div>
                          </div>
                        </td>

                        {/* Fecha Último Ingreso */}
                        <td className="py-3 pr-2 text-right font-mono text-[10px]">
                          {vistas > 0 ? (
                            <span className="text-emerald-400 font-medium">
                              {formatearFecha(est.ultimaActividad)}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">Sin ingresos aún</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
