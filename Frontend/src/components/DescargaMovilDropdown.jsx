import React from 'react';
import { useCourseStore } from '../store/useCourseStore';

// URL del último .apk publicado en EAS (Movil/). Se actualiza a mano tras cada build nuevo:
// ver Movil/eas.json (perfil "preview") y HISTORY/LATEST.md para el enlace vigente.
const APK_DOWNLOAD_URL = 'https://expo.dev/accounts/frealpe/projects/algebra-lineal-evaluaciones/builds';

export default function DescargaMovilDropdown({ isOpen, onClose }) {
  const themeMode = useCourseStore((state) => state.themeMode);
  const esLight = themeMode === 'light';

  if (!isOpen) return null;

  return (
    <div className={`absolute right-0 top-14 w-72 border backdrop-blur-2xl rounded-2xl p-5 shadow-2xl z-50 transition-all animate-fadeIn ${
      esLight
        ? 'bg-white border-slate-300 text-slate-900 shadow-xl'
        : 'bg-[#131313]/95 border-white/20 text-white'
    }`}>
      <div className={`flex justify-between items-center mb-4 pb-2.5 border-b ${
        esLight ? 'border-slate-200' : 'border-white/15'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined text-xl ${esLight ? 'text-sky-600' : 'text-[#38bdf8]'}`}>
            smartphone
          </span>
          <span className={`text-sm font-extrabold ${esLight ? 'text-slate-900' : 'text-white'}`}>
            Descargar App Móvil
          </span>
        </div>
        <button onClick={onClose} className={`text-sm font-bold ${esLight ? 'text-slate-500 hover:text-slate-800' : 'text-white/60 hover:text-white'}`}>
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <a
          href={APK_DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full rounded-xl font-bold py-3 px-4 text-xs transition-all shadow-md cursor-pointer flex items-center gap-3 ${
            esLight
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
        >
          <span className="material-symbols-outlined text-xl">android</span>
          <div className="text-left">
            <div>Android (.apk)</div>
            <div className={`text-[10px] font-normal ${esLight ? 'text-emerald-50' : 'text-emerald-300/70'}`}>
              Instalación directa
            </div>
          </div>
        </a>

        <div
          className={`w-full rounded-xl font-bold py-3 px-4 text-xs flex items-center gap-3 opacity-60 cursor-not-allowed ${
            esLight
              ? 'bg-slate-100 text-slate-500 border border-slate-200'
              : 'bg-white/5 text-white/50 border border-white/10'
          }`}
          title="Requiere cuenta de Apple Developer para una build instalable en iPhone"
        >
          <span className="material-symbols-outlined text-xl">apple</span>
          <div className="text-left">
            <div>iOS</div>
            <div className="text-[10px] font-normal">Próximamente</div>
          </div>
        </div>
      </div>
    </div>
  );
}
