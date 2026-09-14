import React, { useEffect, useState } from 'react';
import { visitasService } from '../services/visitas.service';
import { useCourseStore } from '../store/useCourseStore';
import { useAuth } from '../context/AuthContext';
import ModalRankingEstudiantes from './ModalRankingEstudiantes';

export default function VisitasCounter({ className = '' }) {
  const themeMode = useCourseStore((state) => state.themeMode);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const { estaAutenticado, esSuperusuario, esDocente } = useAuth();
  const esLight = themeMode === 'light';

  const [modalAbierto, setModalAbierto] = useState(false);
  const [stats, setStats] = useState({
    vistasTotales: 1420,
    visitantesUnicos: 315,
    cargando: true,
  });

  const puedeVerRanking = estaAutenticado && (esSuperusuario || esDocente);

  useEffect(() => {
    let mounted = true;
    const registrarYObtener = async () => {
      const res = await visitasService.registrarVisita();
      if (mounted && res && res.vistasTotales) {
        setStats({
          vistasTotales: Number(res.vistasTotales),
          visitantesUnicos: Number(res.visitantesUnicos),
          cargando: false,
        });
      }

      // Si el usuario está autenticado, registrar su actividad individual
      if (estaAutenticado) {
        visitasService.registrarActividad(materiaActivaId);
      }
    };

    registrarYObtener();
    return () => { mounted = false; };
  }, [estaAutenticado, materiaActivaId]);

  const formatear = (num) => {
    return new Intl.NumberFormat('es-CO').format(num || 0);
  };

  return (
    <>
      <div
        onClick={() => {
          if (puedeVerRanking) setModalAbierto(true);
        }}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono transition-all shadow-sm ${
          puedeVerRanking ? 'cursor-pointer hover:scale-105' : 'cursor-default'
        } ${
          esLight
            ? 'bg-slate-100/90 border-slate-300 text-slate-800 hover:bg-slate-200'
            : 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:bg-slate-800/80 backdrop-blur-md'
        } ${className}`}
        title={
          puedeVerRanking
            ? 'Haz clic para ver la Auditoría y Ranking de Alumnos que más ingresan a la plataforma'
            : 'Estadísticas de ingresos y vistas al portal en tiempo real'
        }
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        <div className="flex items-center gap-1.5 font-bold">
          <span className="material-symbols-outlined text-sm text-[#38bdf8]">visibility</span>
          <span className={esLight ? 'text-sky-900 font-extrabold' : 'text-[#38bdf8] font-extrabold'}>
            {formatear(stats.vistasTotales)}
          </span>
          <span className={esLight ? 'text-slate-400' : 'text-slate-500'}>vistas</span>
        </div>

        <span className={esLight ? 'text-slate-300' : 'text-slate-700'}>|</span>

        <div className="flex items-center gap-1.5 font-bold">
          <span className="material-symbols-outlined text-sm text-emerald-400">group</span>
          <span className={esLight ? 'text-emerald-900 font-extrabold' : 'text-emerald-400 font-extrabold'}>
            {formatear(stats.visitantesUnicos)}
          </span>
          <span className={esLight ? 'text-slate-400' : 'text-slate-500'}>visitantes</span>
        </div>

        {puedeVerRanking && (
          <span className="material-symbols-outlined text-xs text-amber-400 ml-0.5 animate-bounce">
            analytics
          </span>
        )}
      </div>

      {puedeVerRanking && (
        <ModalRankingEstudiantes
          isOpen={modalAbierto}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}
