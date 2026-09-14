import React, { useState, useEffect, useMemo } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { preguntasService } from '../services/preguntas.service';

function aISO(valorDatetimeLocal) {
  if (!valorDatetimeLocal) return null;
  const fecha = new Date(valorDatetimeLocal);
  return isNaN(fecha.getTime()) ? null : fecha.toISOString();
}

function aDatetimeLocal(iso) {
  if (!iso) return '';
  const fecha = new Date(iso);
  if (isNaN(fecha.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
}

export default function ExamenProgramadoModal({ isOpen, onClose, materiaId, semanas, examen, modoPresetInicial = null }) {
  const crearExamenProgramado = useCourseStore((state) => state.crearExamenProgramado);
  const editarExamenProgramado = useCourseStore((state) => state.editarExamenProgramado);
  const themeMode = useCourseStore((state) => state.themeMode);
  const esLight = themeMode === 'light';
  const esEdicion = Boolean(examen);

  const [tipoPreset, setTipoPreset] = useState('quiz'); // 'quiz', 'parcial', 'recuperacion', 'final'
  const [titulo, setTitulo] = useState('');
  const [semanaIds, setSemanaIds] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [duracionMin, setDuracionMin] = useState(20);
  const [cantidadTeoria, setCantidadTeoria] = useState(3);
  const [cantidadEjercicio, setCantidadEjercicio] = useState(2);
  const [disponibles, setDisponibles] = useState({ teoria: 0, ejercicio: 0 });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  // Aplicar Presets de Configuración Rápida para Quiz o Parcial
  const aplicarPreset = (tipo) => {
    setTipoPreset(tipo);
    const fechaBase = new Date();
    const isoInicio = new Date(fechaBase.getTime() + 10 * 60 * 1000); // 10 min en el futuro
    const isoFin = new Date(fechaBase.getTime() + 24 * 60 * 60 * 1000); // 24 horas después

    setFechaInicio(aDatetimeLocal(isoInicio.toISOString()));
    setFechaFin(aDatetimeLocal(isoFin.toISOString()));

    if (tipo === 'quiz') {
      if (!titulo || titulo.startsWith('Examen Parcial') || titulo.startsWith('Recuperación')) {
        setTitulo('Quiz — ');
      }
      setDuracionMin(20);
      setCantidadTeoria(3);
      setCantidadEjercicio(2);
      if (semanas && semanas.length > 0 && semanaIds.length === 0) {
        setSemanaIds([semanas[0].id]);
      }
    } else if (tipo === 'parcial') {
      if (!titulo || titulo.startsWith('Quiz') || titulo.startsWith('Recuperación')) {
        setTitulo('Examen Parcial 1 — ');
      }
      setDuracionMin(60);
      setCantidadTeoria(5);
      setCantidadEjercicio(5);
      if (semanas && semanas.length > 0) {
        setSemanaIds(semanas.slice(0, 4).map(s => s.id));
      }
    } else if (tipo === 'recuperacion') {
      if (!titulo || titulo.startsWith('Quiz') || titulo.startsWith('Examen Parcial')) {
        setTitulo('Recuperación / Reposición RQuiz1 — ');
      }
      setDuracionMin(30);
      setCantidadTeoria(4);
      setCantidadEjercicio(3);
      if (semanas && semanas.length > 0 && semanaIds.length === 0) {
        setSemanaIds([semanas[0].id]);
      }
    } else if (tipo === 'final') {
      setTitulo('Examen Final — ');
      setDuracionMin(90);
      setCantidadTeoria(6);
      setCantidadEjercicio(6);
      if (semanas && semanas.length > 0) {
        setSemanaIds(semanas.map(s => s.id));
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setError('');

    if (examen) {
      setTitulo(examen.titulo || '');
      setSemanaIds((examen.semanas || []).map((s) => s.id));
      setFechaInicio(aDatetimeLocal(examen.fechaInicio));
      setFechaFin(aDatetimeLocal(examen.fechaFin));
      setDuracionMin(examen.duracionMin ?? 20);
      setCantidadTeoria(examen.cantidadTeoria ?? 0);
      setCantidadEjercicio(examen.cantidadEjercicio ?? 0);

      const tLow = (examen.titulo || '').toLowerCase();
      if (tLow.includes('parcial')) setTipoPreset('parcial');
      else if (tLow.includes('recuperac') || tLow.includes('rquiz')) setTipoPreset('recuperacion');
      else if (tLow.includes('final')) setTipoPreset('final');
      else setTipoPreset('quiz');
    } else {
      const presetTarget = modoPresetInicial || 'quiz';
      aplicarPreset(presetTarget);
    }
  }, [isOpen, examen, modoPresetInicial]);

  // Conteo de preguntas en vivo
  useEffect(() => {
    if (!isOpen || semanaIds.length === 0) {
      setDisponibles({ teoria: 0, ejercicio: 0 });
      return;
    }
    let cancelado = false;
    Promise.all(semanaIds.map((id) => preguntasService.getPreguntasBySemana(id))).then((listas) => {
      if (cancelado) return;
      const todas = listas.flat().filter(Boolean);
      setDisponibles({
        teoria: todas.filter((p) => p.tipo === 'teoria').length,
        ejercicio: todas.filter((p) => p.tipo === 'ejercicio').length
      });
    });
    return () => { cancelado = true; };
  }, [isOpen, semanaIds]);

  const toggleSemana = (id) => {
    setSemanaIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const seleccionarTodasSemanas = () => {
    if (semanaIds.length === semanas.length) {
      setSemanaIds([]);
    } else {
      setSemanaIds(semanas.map(s => s.id));
    }
  };

  const bancoInsuficiente = useMemo(
    () => cantidadTeoria > disponibles.teoria || cantidadEjercicio > disponibles.ejercicio,
    [cantidadTeoria, cantidadEjercicio, disponibles]
  );

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) { setError('El título del examen o quiz es requerido'); return; }
    if (semanaIds.length === 0) { setError('Selecciona al menos una semana/tema que cubrirá la prueba'); return; }
    const fi = aISO(fechaInicio);
    const ff = aISO(fechaFin);
    if (!fi || !ff) { setError('Indica fecha y hora de inicio y de cierre'); return; }
    if (new Date(ff) <= new Date(fi)) { setError('La fecha/hora de cierre debe ser posterior a la de inicio'); return; }
    if (Number(cantidadTeoria) + Number(cantidadEjercicio) <= 0) {
      setError('Configura al menos una pregunta (teoría o ejercicio)');
      return;
    }

    setError('');
    setGuardando(true);
    try {
      const payload = {
        materiaId,
        titulo: titulo.trim(),
        semanaIds,
        fechaInicio: fi,
        fechaFin: ff,
        duracionMin: Number(duracionMin),
        cantidadTeoria: Number(cantidadTeoria),
        cantidadEjercicio: Number(cantidadEjercicio)
      };
      if (esEdicion) {
        await editarExamenProgramado(examen.id, payload);
      } else {
        await crearExamenProgramado(payload);
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.mensaje || err?.response?.data?.message || 'Error al guardar la prueba programada');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl border transition-all duration-200 ${
        esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-sky-500/40 text-white'
      }`}>
        {/* HEADER DEL MODAL */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-500/20">
          <h3 className="text-base font-extrabold flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-500">
              {esEdicion ? 'settings' : 'event_available'}
            </span>
            <span>{esEdicion ? 'Editar Evaluación Programada' : 'Programar Nuevo Quiz o Parcial'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* SELECTOR DE PRESETS / TIPO DE EVALUACIÓN */}
        {!esEdicion && (
          <div className={`p-3 rounded-xl border mb-4 flex flex-col gap-2 ${
            esLight ? 'bg-slate-100/90 border-slate-300' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <label className={`text-xs font-black uppercase tracking-wider ${esLight ? 'text-sky-800' : 'text-sky-400'}`}>
              Modalidad de Evaluación (Presets Rápidos):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => aplicarPreset('quiz')}
                className={`p-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  tipoPreset === 'quiz'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm'
                    : esLight ? 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50' : 'border-slate-800 text-slate-400 bg-slate-900 hover:bg-slate-800'
                }`}
              >
                ⚡ Quiz (20 min)
              </button>

              <button
                type="button"
                onClick={() => aplicarPreset('parcial')}
                className={`p-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  tipoPreset === 'parcial'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                    : esLight ? 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50' : 'border-slate-800 text-slate-400 bg-slate-900 hover:bg-slate-800'
                }`}
              >
                📝 Parcial (60 min)
              </button>

              <button
                type="button"
                onClick={() => aplicarPreset('recuperacion')}
                className={`p-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  tipoPreset === 'recuperacion'
                    ? 'bg-orange-500/20 border-orange-500 text-orange-600 dark:text-orange-400 shadow-sm'
                    : esLight ? 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50' : 'border-slate-800 text-slate-400 bg-slate-900 hover:bg-slate-800'
                }`}
              >
                🔄 RQuiz
              </button>

              <button
                type="button"
                onClick={() => aplicarPreset('final')}
                className={`p-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  tipoPreset === 'final'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400 shadow-sm'
                    : esLight ? 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50' : 'border-slate-800 text-slate-400 bg-slate-900 hover:bg-slate-800'
                }`}
              >
                🎓 Final (90 min)
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* TÍTULO */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold">Título de la prueba / evaluación *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Quiz 1 — Semanas 01 a 03 o Examen Parcial 1"
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold outline-none transition-all ${
                esLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500 focus:bg-white'
                  : 'bg-slate-950 border-slate-700 text-white focus:border-sky-400'
              }`}
            />
          </div>

          {/* SEMANAS / TEMAS */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-extrabold">Semanas / Temas que cubrirá la prueba *</label>
              <button
                type="button"
                onClick={seleccionarTodasSemanas}
                className="text-xs font-bold text-sky-500 hover:underline cursor-pointer"
              >
                {semanaIds.length === semanas.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
              </button>
            </div>

            <div className={`p-3 rounded-xl border max-h-48 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 ${
              esLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/80 border-slate-800'
            }`}>
              {semanas.map((s) => {
                const seleccionado = semanaIds.includes(s.id);
                const nombreLimpio = (s.unidadNombre || s.unidad || s.nombre || 'Tema').replace(/^\$/, '');
                return (
                  <label
                    key={s.id}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-all ${
                      seleccionado
                        ? esLight
                          ? 'bg-sky-100 border-sky-400 text-sky-950 font-black shadow-sm'
                          : 'bg-sky-950/60 border-sky-500/60 text-sky-200 font-black shadow-sm'
                        : esLight
                        ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={seleccionado}
                      onChange={() => toggleSemana(s.id)}
                      className="accent-sky-500 cursor-pointer w-4 h-4 shrink-0"
                    />
                    <span className="truncate leading-tight">
                      Semana {String(s.numero).padStart(2, '0')} — {nombreLimpio}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* FECHAS APERTURA Y CIERRE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold">Apertura (Fecha y Hora) *</label>
              <input
                type="datetime-local"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                  esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold">Cierre (Fecha y Hora) *</label>
              <input
                type="datetime-local"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                  esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>
          </div>

          {/* DURACIÓN */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-extrabold">Duración límite del intento (minutos) *</label>
            <input
              type="number"
              min="5"
              max="180"
              value={duracionMin}
              onChange={(e) => setDuracionMin(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          </div>

          {/* CANTIDAD DE PREGUNTAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold">Preguntas de Teoría</label>
              <input
                type="number"
                min="0"
                value={cantidadTeoria}
                onChange={(e) => setCantidadTeoria(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                  esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-extrabold">Preguntas de Ejercicio / Problema</label>
              <input
                type="number"
                min="0"
                value={cantidadEjercicio}
                onChange={(e) => setCantidadEjercicio(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold outline-none ${
                  esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                }`}
              />
            </div>
          </div>

          {/* ESTADO BANCO DISPONIBLE */}
          <div className={`p-3 rounded-xl border text-xs font-bold ${
            bancoInsuficiente
              ? esLight ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : esLight ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-sky-950/40 border-sky-500/40 text-sky-300'
          }`}>
            📊 Banco disponible en semanas seleccionadas: <strong>{disponibles.teoria}</strong> teoría, <strong>{disponibles.ejercicio}</strong> ejercicio.
            {bancoInsuficiente && ' ⚠️ No hay suficientes preguntas en el banco para la cantidad solicitada.'}
          </div>

          {esEdicion && (
            <p className="text-[11px] text-slate-400 italic">
              Nota: Si algún estudiante ya presentó este examen, la edición del contenido estará protegida por seguridad.
            </p>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-extrabold">
              {error}
            </div>
          )}

          {/* ACCIONES */}
          <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-500/20">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                esLight
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>{guardando ? 'Guardando...' : esEdicion ? 'Guardar Cambios' : 'Programar Evaluación'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

