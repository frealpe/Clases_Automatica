import React, { useState, useEffect, useRef } from 'react';

export default function SimuladorRectas2D() {
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(5);

  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(1);

  const canvasRef = useRef(null);

  // Cálculo determinante Δ = a1*b2 - a2*b1
  const det = a1 * b2 - a2 * b1;
  const esParalela = Math.abs(det) < 0.0001;

  let tipoSistema = '';
  let solX = 0;
  let solY = 0;

  if (!esParalela) {
    tipoSistema = 'DETERMINADO'; // Solución Única
    solX = (c1 * b2 - b1 * c2) / det;
    solY = (a1 * c2 - c1 * a2) / det;
  } else {
    // Verificar si las rectas son coincidentes: (a1/a2 == b1/b2 == c1/c2)
    const esCoincidente = Math.abs(a1 * c2 - c1 * a2) < 0.0001 && Math.abs(b1 * c2 - c1 * b2) < 0.0001;
    tipoSistema = esCoincidente ? 'INDETERMINADO' : 'INCONSISTENTE';
  }

  // Presets Rápidos
  const cargarPresetUnica = () => {
    setA1(1); setB1(1); setC1(5);
    setA2(1); setB2(-1); setC2(1);
  };

  const cargarPresetParalelas = () => {
    setA1(2); setB1(1); setC1(4);
    setA2(4); setB2(2); setC2(3);
  };

  const cargarPresetCoincidentes = () => {
    setA1(1); setB1(-2); setC1(3);
    setA2(-2); setB2(4); setC2(-6);
  };

  // Renderizado en HTML Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Escala cartesiana [-10, 10]
    const minX = -10, maxX = 10;
    const minY = -10, maxY = 10;

    const toScreenX = (x) => ((x - minX) / (maxX - minX)) * w;
    const toScreenY = (y) => h - ((y - minY) / (maxY - minY)) * h;

    // Fondo
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Grilla
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = minX; x <= maxX; x += 2) {
      ctx.beginPath();
      ctx.moveTo(toScreenX(x), 0);
      ctx.lineTo(toScreenX(x), h);
      ctx.stroke();
    }
    for (let y = minY; y <= maxY; y += 2) {
      ctx.beginPath();
      ctx.moveTo(0, toScreenY(y));
      ctx.lineTo(w, toScreenY(y));
      ctx.stroke();
    }

    // Ejes Cartesiamos Principales
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(w, toScreenY(0));
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), h);
    ctx.stroke();

    // Dibujar Recta 1 (a1*x + b1*y = c1 => y = (c1 - a1*x)/b1) en Azul Cyan
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (Math.abs(b1) > 0.001) {
      const y1 = (c1 - a1 * minX) / b1;
      const y2 = (c1 - a1 * maxX) / b1;
      ctx.moveTo(toScreenX(minX), toScreenY(y1));
      ctx.lineTo(toScreenX(maxX), toScreenY(y2));
    } else if (Math.abs(a1) > 0.001) {
      const x = c1 / a1;
      ctx.moveTo(toScreenX(x), 0);
      ctx.lineTo(toScreenX(x), h);
    }
    ctx.stroke();

    // Dibujar Recta 2 (a2*x + b2*y = c2 => y = (c2 - a2*x)/b2) en Rojo Coral / Amarillo
    ctx.strokeStyle = tipoSistema === 'INDETERMINADO' ? '#38bdf8' : '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    if (Math.abs(b2) > 0.001) {
      const y1 = (c2 - a2 * minX) / b2;
      const y2 = (c2 - a2 * maxX) / b2;
      ctx.moveTo(toScreenX(minX), toScreenY(y1));
      ctx.lineTo(toScreenX(maxX), toScreenY(y2));
    } else if (Math.abs(a2) > 0.001) {
      const x = c2 / a2;
      ctx.moveTo(toScreenX(x), 0);
      ctx.lineTo(toScreenX(x), h);
    }
    ctx.stroke();

    // Dibujar Punto de Intersección si es Consistente Determinado
    if (tipoSistema === 'DETERMINADO') {
      const px = toScreenX(solX);
      const py = toScreenY(solY);

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Texto de Coordenadas
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`P(${solX.toFixed(2)}, ${solY.toFixed(2)})`, px + 10, py - 10);
    }
  }, [a1, b1, c1, a2, b2, c2, tipoSistema, solX, solY]);

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 text-white flex flex-col gap-4 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold text-[#38bdf8] uppercase tracking-wider block">
            SIMULADOR INTERACTIVO · GEOMETRÍA DE SISTEMAS 2x2
          </span>
          <h3 className="text-lg font-extrabold text-white">
            Análisis Geométrico de Rectas en ℝ²
          </h3>
        </div>

        {/* Presets Rápidos */}
        <div className="flex items-center gap-2">
          <button
            onClick={cargarPresetUnica}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 cursor-pointer"
          >
            🟢 Solución Única
          </button>
          <button
            onClick={cargarPresetParalelas}
            className="px-2.5 py-1 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold hover:bg-red-500/30 cursor-pointer"
          >
            🔴 Sin Solución
          </button>
          <button
            onClick={cargarPresetCoincidentes}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 cursor-pointer"
          >
            🟡 Infinitas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Controles de Coeficientes de Ecuaciones */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Ecuación 1 (Azul Cyan) */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-500/40 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-[#38bdf8]">
              Recta L₁: {a1}x + ({b1})y = {c1}
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <label>a₁: <input type="number" value={a1} onChange={(e) => setA1(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" /></label>
              <label>b₁: <input type="number" value={b1} onChange={(e) => setB1(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" /></label>
              <label>c₁: <input type="number" value={c1} onChange={(e) => setC1(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" /></label>
            </div>
          </div>

          {/* Ecuación 2 (Rojo Coral) */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/40 flex flex-col gap-2">
            <span className="text-xs font-mono font-bold text-rose-400">
              Recta L₂: {a2}x + ({b2})y = {c2}
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <label>a₂: <input type="number" value={a2} onChange={(e) => setA2(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" /></label>
              <label>b₂: <input type="number" value={b2} onChange={(e) => setB2(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" /></label>
              <label>c₂: <input type="number" value={c2} onChange={(e) => setC2(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 px-2 py-1 rounded text-white" /></label>
            </div>
          </div>

          {/* Resultado de Clasificación y Determinante */}
          <div className={`p-4 rounded-xl border text-xs font-mono flex flex-col gap-1.5 ${
            tipoSistema === 'DETERMINADO'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
              : tipoSistema === 'INCONSISTENTE'
              ? 'bg-red-950/60 border-red-500/50 text-red-200'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
          }`}>
            <div className="flex justify-between items-center">
              <strong>CLASIFICACIÓN:</strong>
              <span className="px-2 py-0.5 rounded font-extrabold bg-black/40">
                {tipoSistema === 'DETERMINADO' && '🟢 CONSISTENTE DETERMINADO'}
                {tipoSistema === 'INCONSISTENTE' && '🔴 INCONSISTENTE (SIN SOLUCIÓN)'}
                {tipoSistema === 'INDETERMINADO' && '🟡 CONSISTENTE INDETERMINADO'}
              </span>
            </div>

            <div>Determinante Δ = a₁b₂ - a₂b₁ = {det.toFixed(2)}</div>

            {tipoSistema === 'DETERMINADO' ? (
              <div className="font-bold text-white mt-1 pt-1 border-t border-emerald-500/30">
                📌 Solución Única de Intersección: (x = {solX.toFixed(2)}, y = {solY.toFixed(2)})
              </div>
            ) : tipoSistema === 'INCONSISTENTE' ? (
              <div className="text-red-300 mt-1 pt-1 border-t border-red-500/30">
                ⚠️ Las rectas son Paralelas Distintas. No existe ningún punto (x,y) común.
              </div>
            ) : (
              <div className="text-amber-300 mt-1 pt-1 border-t border-amber-500/30">
                ♾️ Las rectas son Coincidentes. Existen infinitas soluciones de la forma (x, (c₁ - a₁x)/b₁).
              </div>
            )}
          </div>
        </div>

        {/* Canvas Interactivo Gráfico 2D */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 p-2 rounded-xl border border-slate-800">
          <canvas
            ref={canvasRef}
            width={520}
            height={380}
            className="w-full h-auto max-w-full rounded-lg shadow-inner border border-slate-800"
          />
          <div className="text-[10px] font-mono text-slate-400 mt-2 flex gap-4">
            <span className="text-[#38bdf8]">━ Recta L₁</span>
            <span className="text-rose-400">━ Recta L₂</span>
            <span className="text-emerald-400">● Intersección</span>
          </div>
        </div>
      </div>
    </div>
  );
}
