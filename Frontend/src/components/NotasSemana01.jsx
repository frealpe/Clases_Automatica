import React from 'react';

export default function NotasSemana01({ contenidoDB, onAbrirSimulacion, onAbrirTest }) {
  if (!contenidoDB) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono text-xs bg-slate-950/80 rounded-2xl border border-slate-800 my-4">
        Cargando lección desde la base de datos PostgreSQL...
      </div>
    );
  }

  // Extracción flexible de secciones desde el objeto JSON traído de PostgreSQL DB
  const { titulo, subtitulo, seccion1, seccion2, seccion3, ejerciciosPropuestos = [] } = contenidoDB;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-8 text-slate-200">
      {/* BANNER ENCABEZADO DE LA SEMANA */}
      <div className="p-6 rounded-2xl bg-[#005A3C]/20 border border-[#005A3C]/50 shadow-xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-wider">
          <span>UNIVERSIDAD DEL CAUCA · CONTENIDO RECUPERADO DE POSTGRESQL DB</span>
          <span>{subtitulo || 'Notas de Clase'}</span>
        </div>
        <h2 className="text-2xl font-black text-white">
          {titulo || 'Sistemas de Ecuaciones Lineales'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
          Información temático-pedagógica renderizada dinámicamente desde el objeto JSON guardado en la base de datos (sin hardcode).
        </p>
      </div>

      {/* SECCIÓN 1: TEORÍA Y DEFINICIONES DE LA SECCIÓN 1 */}
      {seccion1 && (
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-lg font-extrabold text-[#38bdf8] border-b border-slate-800 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">menu_book</span>
            {seccion1.titulo || '1. Introducción a la Lección'}
          </h3>

          {/* Definición 1.1 / Defs */}
          {seccion1.def11 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <div className="text-xs font-mono font-bold text-sky-400">
                {seccion1.def11.nombre}
              </div>
              {seccion1.def11.formula && (
                <div className="p-3 rounded-lg bg-slate-950 text-cyan-300 font-mono text-center text-xs sm:text-sm font-bold border border-slate-800">
                  {seccion1.def11.formula}
                </div>
              )}
              <p className="text-xs text-slate-400 leading-relaxed">
                {seccion1.def11.explicacion}
              </p>
            </div>
          )}

          {/* Teorema 1.2 o Def 1.2 */}
          {(seccion1.teorema12 || seccion1.def12) && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <div className="text-xs font-mono font-bold text-emerald-400">
                {(seccion1.teorema12 || seccion1.def12).nombre}
              </div>
              {(seccion1.teorema12 || seccion1.def12).formula && (
                <div className="p-3.5 rounded-lg bg-slate-950 text-cyan-300 font-mono text-center text-xs sm:text-sm font-bold border border-slate-800 whitespace-pre-line">
                  {(seccion1.teorema12 || seccion1.def12).formula}
                </div>
              )}
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {(seccion1.teorema12 || seccion1.def12).explicacion}
              </p>
            </div>
          )}

          {/* Definición 1.3 */}
          {seccion1.def13 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <div className="text-xs font-mono font-bold text-sky-400">
                {seccion1.def13.nombre}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {seccion1.def13.explicacion}
              </p>
            </div>
          )}

          {/* Ejemplos de los Casos (Inconsistente, Única, Infinitas) */}
          {seccion1.ejemplosCasos && (
            <div className="flex flex-col gap-3 my-2">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">Clasificación de Casos:</h4>
              {seccion1.ejemplosCasos.map((ej, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-2">
                  <strong className="text-emerald-400 font-mono">{ej.nombre}</strong>
                  {ej.sistema && (
                    <div className="font-mono text-cyan-300 bg-slate-950 p-2.5 rounded border border-slate-800 whitespace-pre-line">
                      {ej.sistema}
                    </div>
                  )}
                  {ej.pasos && (
                    <div className="font-mono text-slate-300 bg-slate-950/80 p-3 rounded border border-slate-800/80 whitespace-pre-line leading-relaxed">
                      {ej.pasos}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN 2: ALGORITMO Y APLICAICÓN DE INGENIERÍA */}
      {seccion2 && (
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-2">
            <h3 className="text-lg font-extrabold text-[#38bdf8] flex items-center gap-2">
              <span className="material-symbols-outlined">analytics</span>
              {seccion2.titulo || '2. Desarrollo de la Lección'}
            </h3>

            {onAbrirSimulacion && (
              <button
                onClick={onAbrirSimulacion}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 text-black font-extrabold text-xs hover:bg-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span className="material-symbols-outlined text-base">monitoring</span>
                <span>Ver Simulación 2D</span>
              </button>
            )}
          </div>

          {/* Definiciones de la Sección 2 */}
          {seccion2.def21 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <div className="text-xs font-mono font-bold text-sky-400">
                {seccion2.def21.nombre}
              </div>
              {seccion2.def21.formula && (
                <div className="p-3 rounded-lg bg-slate-950 text-sky-200 font-mono text-xs sm:text-sm text-center font-bold border border-slate-800 whitespace-pre-line">
                  {seccion2.def21.formula}
                </div>
              )}
              <p className="text-xs text-slate-400 leading-relaxed">
                {seccion2.def21.explicacion}
              </p>
            </div>
          )}

          {seccion2.def22 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <div className="text-xs font-mono font-bold text-amber-400">
                {seccion2.def22.nombre}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {seccion2.def22.explicacion}
              </p>
            </div>
          )}

          {/* Aplicación en Ingeniería de Circuitos Electrónicos */}
          {seccion2.ingenieriaCircuito && (
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs flex flex-col gap-3">
              <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
                <span className="material-symbols-outlined">bolt</span>
                <span>{seccion2.ingenieriaCircuito.titulo}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {seccion2.ingenieriaCircuito.descripcion}
              </p>
              <div className="p-3 rounded-xl bg-slate-950 text-cyan-300 font-mono text-center border border-slate-800 whitespace-pre-line font-bold">
                {seccion2.ingenieriaCircuito.sistema}
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/90 text-emerald-300 font-mono border border-slate-800 whitespace-pre-line leading-relaxed">
                {seccion2.ingenieriaCircuito.pasosGaussJordan}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN 3: SISTEMAS HOMOGÉNEOS (SI EXISTE) */}
      {seccion3 && (
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-lg font-extrabold text-[#38bdf8] border-b border-slate-800 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">grain</span>
            {seccion3.titulo || '3. Sistemas Homogéneos'}
          </h3>

          {seccion3.def31 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <div className="text-xs font-mono font-bold text-sky-400">
                {seccion3.def31.nombre}
              </div>
              {seccion3.def31.formula && (
                <div className="p-3 rounded-lg bg-slate-950 text-cyan-300 font-mono text-center text-xs font-bold border border-slate-800">
                  {seccion3.def31.formula}
                </div>
              )}
              <p className="text-xs text-slate-300 leading-relaxed">
                {seccion3.def31.explicacion}
              </p>
            </div>
          )}

          {seccion3.teorema32 && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
              <div className="text-xs font-mono font-bold text-emerald-400">
                {seccion3.teorema32.nombre}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {seccion3.teorema32.explicacion}
              </p>
            </div>
          )}
        </div>
      )}

      {/* EJERCICIOS PROPUESTOS RESUELTOS DESDE BD */}
      {ejerciciosPropuestos.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col gap-4">
          <h3 className="text-lg font-extrabold text-[#38bdf8] border-b border-slate-800 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined">checklist</span>
            Soluciones de los Ejercicios Propuestos (Base de Datos PostgreSQL)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ejerciciosPropuestos.map((ej) => (
              <div key={ej.num} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2 text-xs">
                <div className="font-mono font-bold text-sky-400">EJERCICIO {ej.num}: {ej.titulo}</div>
                <div className="p-3 rounded-lg bg-slate-950 text-cyan-300 font-mono leading-relaxed border border-slate-800 whitespace-pre-line">
                  {ej.sol}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
