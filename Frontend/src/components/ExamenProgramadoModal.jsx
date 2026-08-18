import React, { useState, useEffect, useMemo } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { preguntasService } from '../services/preguntas.service';

// datetime-local trabaja en hora local sin offset; Date#toISOString() ya la convierte a UTC.
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

export default function ExamenProgramadoModal({ isOpen, onClose, materiaId, semanas, examen }) {
  const crearExamenProgramado = useCourseStore((state) => state.crearExamenProgramado);
  const editarExamenProgramado = useCourseStore((state) => state.editarExamenProgramado);
  const esEdicion = Boolean(examen);

  const [titulo, setTitulo] = useState('');
  const [semanaIds, setSemanaIds] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [duracionMin, setDuracionMin] = useState(15);
  const [cantidadTeoria, setCantidadTeoria] = useState(3);
  const [cantidadEjercicio, setCantidadEjercicio] = useState(2);
  const [disponibles, setDisponibles] = useState({ teoria: 0, ejercicio: 0 });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError('');
    if (examen) {
      setTitulo(examen.titulo || '');
      setSemanaIds((examen.semanas || []).map((s) => s.id));
      setFechaInicio(aDatetimeLocal(examen.fechaInicio));
      setFechaFin(aDatetimeLocal(examen.fechaFin));
      setDuracionMin(examen.duracionMin ?? 15);
      setCantidadTeoria(examen.cantidadTeoria ?? 0);
      setCantidadEjercicio(examen.cantidadEjercicio ?? 0);
    } else {
      setTitulo('');
      setSemanaIds([]);
      setFechaInicio('');
      setFechaFin('');
      setDuracionMin(15);
      setCantidadTeoria(3);
      setCantidadEjercicio(2);
    }
  }, [isOpen, examen]);

  // Conteo en vivo de preguntas disponibles por tipo entre las semanas seleccionadas, sumando
  // client-side sobre el banco ya existente (GET /preguntas/semana/:id) — evita un endpoint nuevo.
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

  const bancoInsuficiente = useMemo(
    () => cantidadTeoria > disponibles.teoria || cantidadEjercicio > disponibles.ejercicio,
    [cantidadTeoria, cantidadEjercicio, disponibles]
  );

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) { setError('El título del examen es requerido'); return; }
    if (semanaIds.length === 0) { setError('Selecciona al menos una semana/tema ya visto'); return; }
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
      setError(err?.response?.data?.mensaje || err?.response?.data?.message || 'Error al guardar el examen programado');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3 className="modal-header">
          🗓️ {esEdicion ? 'Editar Examen Programado' : 'Nuevo Examen Programado'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título del examen</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Quiz Unidad 2 — Vectores y matrices"
              required
            />
          </div>

          <div className="form-group">
            <label>Semanas / temas ya vistos que cubre el examen</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '140px', overflowY: 'auto', padding: '4px' }}>
              {semanas.map((s) => (
                <label
                  key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem',
                    padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color, #334155)',
                    cursor: 'pointer', background: semanaIds.includes(s.id) ? 'var(--accent-bg, #0ea5e930)' : 'transparent'
                  }}
                >
                  <input type="checkbox" checked={semanaIds.includes(s.id)} onChange={() => toggleSemana(s.id)} />
                  Semana {s.numero} — {s.unidadNombre || s.unidad}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Fecha y hora de apertura</label>
              <input type="datetime-local" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Fecha y hora de cierre</label>
              <input type="datetime-local" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label>Duración del intento (minutos, sugerido 15-20)</label>
            <input type="number" min="5" max="60" value={duracionMin} onChange={(e) => setDuracionMin(e.target.value)} />
          </div>

          <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label>Preguntas de teoría</label>
              <input type="number" min="0" value={cantidadTeoria} onChange={(e) => setCantidadTeoria(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Preguntas de ejercicio/problema</label>
              <input type="number" min="0" value={cantidadEjercicio} onChange={(e) => setCantidadEjercicio(e.target.value)} />
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: bancoInsuficiente ? '#f87171' : '#94a3b8' }}>
            Banco disponible en las semanas seleccionadas: {disponibles.teoria} de teoría, {disponibles.ejercicio} de ejercicio.
            {bancoInsuficiente && ' No alcanza para la cantidad configurada.'}
          </p>

          {esEdicion && (
            <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Si algún estudiante ya presentó este examen, la edición quedará bloqueada por el servidor.
            </p>
          )}

          {error && <p style={{ color: 'var(--color-danger, #d9534f)' }}>{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-action" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-create" disabled={guardando}>
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Programar examen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
