import React, { useState, useEffect, useCallback } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { preguntasService } from '../services/preguntas.service';
import PreguntaModal from './PreguntaModal';

export default function GestionPreguntasModal({ isOpen, onClose, semana }) {
  const setSemanaSeleccionada = useCourseStore((state) => state.setSemanaSeleccionada);
  const eliminarPregunta = useCourseStore((state) => state.eliminarPregunta);

  const [preguntas, setPreguntas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalPreguntaAbierto, setModalPreguntaAbierto] = useState(false);
  const [preguntaAEditar, setPreguntaAEditar] = useState(null);

  const recargar = useCallback(async () => {
    if (!semana) return;
    setCargando(true);
    const lista = await preguntasService.getPreguntasBySemana(semana.id);
    setPreguntas(lista || []);
    setCargando(false);
  }, [semana]);

  useEffect(() => {
    if (isOpen && semana) {
      setSemanaSeleccionada(semana.id);
      recargar();
    }
  }, [isOpen, semana, setSemanaSeleccionada, recargar]);

  if (!isOpen || !semana) return null;

  const handleNueva = () => {
    setPreguntaAEditar(null);
    setModalPreguntaAbierto(true);
  };

  const handleEditar = (p) => {
    setPreguntaAEditar(p);
    setModalPreguntaAbierto(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta pregunta del banco de la sesión?')) return;
    await eliminarPregunta(id);
    recargar();
  };

  const handleCerrarPreguntaModal = () => {
    setModalPreguntaAbierto(false);
    setPreguntaAEditar(null);
    recargar();
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}>
          <h3 className="modal-header">
            🧠 Banco de Preguntas — Sesión {semana.numero}
          </h3>

          {cargando && <p style={{ color: '#94a3b8' }}>Cargando preguntas...</p>}

          {!cargando && preguntas.length === 0 && (
            <p style={{ color: '#94a3b8' }}>Todavía no hay preguntas registradas para esta sesión.</p>
          )}

          {!cargando && preguntas.map((p, idx) => (
            <div
              key={p.id}
              style={{
                border: '1px solid rgba(148, 163, 184, 0.35)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '0.6rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.7 }}>
                  PREGUNTA {idx + 1} · {p.tipo === 'teoria' ? '📖 TEORÍA' : '🧮 EJERCICIO'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', whiteSpace: 'pre-line', marginBottom: '0.5rem' }}>{p.pregunta}</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn-action" onClick={() => handleEditar(p)}>Editar</button>
                <button type="button" className="btn-action" onClick={() => handleEliminar(p.id)}>Eliminar</button>
              </div>
            </div>
          ))}

          <div className="modal-actions">
            <button type="button" className="btn-action" onClick={onClose}>Cerrar</button>
            <button type="button" className="btn-create" onClick={handleNueva}>+ Nueva Pregunta</button>
          </div>
        </div>
      </div>

      <PreguntaModal
        isOpen={modalPreguntaAbierto}
        onClose={handleCerrarPreguntaModal}
        preguntaEditar={preguntaAEditar}
      />
    </>
  );
}
