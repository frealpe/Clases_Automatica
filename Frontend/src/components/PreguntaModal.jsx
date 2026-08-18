import React, { useState, useEffect } from 'react';
import { useCourseStore } from '../store/useCourseStore';

export default function PreguntaModal({ isOpen, onClose, preguntaEditar }) {
  const agregarPregunta = useCourseStore((state) => state.agregarPregunta);
  const editarPregunta = useCourseStore((state) => state.editarPregunta);
  const semanaSeleccionadaId = useCourseStore((state) => state.semanaSeleccionadaId);

  const [tipo, setTipo] = useState('teoria');
  const [preguntaTexto, setPreguntaTexto] = useState('');
  const [opcionA, setOpcionA] = useState('');
  const [opcionB, setOpcionB] = useState('');
  const [opcionC, setOpcionC] = useState('');
  const [correcta, setCorrecta] = useState('a');
  const [explicacion, setExplicacion] = useState('');
  const [falencia, setFalencia] = useState('');

  useEffect(() => {
    if (preguntaEditar) {
      setTipo(preguntaEditar.tipo || 'teoria');
      setPreguntaTexto(preguntaEditar.pregunta || '');
      setOpcionA(preguntaEditar.opciones?.[0]?.texto || '');
      setOpcionB(preguntaEditar.opciones?.[1]?.texto || '');
      setOpcionC(preguntaEditar.opciones?.[2]?.texto || '');
      setCorrecta(preguntaEditar.correcta || 'a');
      setExplicacion(preguntaEditar.explicacion || '');
      setFalencia(preguntaEditar.falencia || '');
    } else {
      setTipo('teoria');
      setPreguntaTexto('');
      setOpcionA('');
      setOpcionB('');
      setOpcionC('');
      setCorrecta('a');
      setExplicacion('');
      setFalencia('');
    }
  }, [preguntaEditar, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      tipo,
      pregunta: preguntaTexto,
      opciones: [
        { id: 'a', texto: opcionA },
        { id: 'b', texto: opcionB },
        { id: 'c', texto: opcionC }
      ],
      correcta,
      explicacion,
      falencia,
      semanaId: semanaSeleccionadaId
    };

    if (preguntaEditar) {
      editarPregunta(preguntaEditar.id, payload);
    } else {
      agregarPregunta(payload);
    }

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3 className="modal-header">
          {preguntaEditar ? '✏️ Editar Pregunta' : '➕ Nueva Pregunta para la Semana'}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Pregunta</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="teoria">📖 TEORÍA (Conceptos / Definiciones)</option>
              <option value="ejercicio">🧮 EJERCICIO PRÁCTICO (Cálculos / Procedimientos)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Enunciado de la Pregunta</label>
            <textarea
              rows="3"
              value={preguntaTexto}
              onChange={(e) => setPreguntaTexto(e.target.value)}
              required
              placeholder="Ej. Dada la matriz A = [2 1; 5 3], determine su matriz inversa..."
            />
          </div>

          <div className="form-group">
            <label>Opción A</label>
            <input value={opcionA} onChange={(e) => setOpcionA(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Opción B</label>
            <input value={opcionB} onChange={(e) => setOpcionB(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Opción C</label>
            <input value={opcionC} onChange={(e) => setOpcionC(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Opción Correcta</label>
            <select value={correcta} onChange={(e) => setCorrecta(e.target.value)}>
              <option value="a">Opción A</option>
              <option value="b">Opción B</option>
              <option value="c">Opción C</option>
            </select>
          </div>

          <div className="form-group">
            <label>Justificación / Explicación Pedagógica</label>
            <input
              value={explicacion}
              onChange={(e) => setExplicacion(e.target.value)}
              placeholder="Ej. Por la fórmula de la inversa A⁻¹ = (1/det)[d -b; -c a]..."
            />
          </div>

          <div className="form-group">
            <label>Falencia Asociada (Concepto a Reforzar en el Reporte)</label>
            <input
              value={falencia}
              onChange={(e) => setFalencia(e.target.value)}
              placeholder="Ej. Cálculo de la matriz inversa 2x2"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-action" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-create">
              {preguntaEditar ? 'Guardar Cambios' : 'Crear Pregunta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
