import React, { useState } from 'react';
import { estudiantesService } from '../services/estudiantes.service';

export default function CargaEstudiantesModal({ isOpen, materia, onClose }) {
  const [archivo, setArchivo] = useState(null);
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setArchivo(null);
    setTexto('');
    setResultado(null);
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo && !texto.trim()) {
      setError('Sube un archivo o pega la lista de estudiantes.');
      return;
    }

    setCargando(true);
    setError('');
    setResultado(null);

    try {
      const data = await estudiantesService.cargaMasiva({ materiaId: materia.id, archivo, texto });
      setResultado(data);
      setArchivo(null);
      setTexto('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al procesar la lista de estudiantes.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-header">👥 Cargar Estudiantes por Bloque — {materia?.nombre}</h3>
        <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Formato: una línea por estudiante, tres campos separados por tabulación —
          <code> cédula&#9;NOMBRE COMPLETO&#9;correo@unicauca.edu.co</code>.
          El correo será el usuario y la cédula la contraseña inicial de cada estudiante.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Archivo (.md, .txt, .csv)</label>
            <input
              type="file"
              accept=".md,.txt,.csv"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            />
          </div>

          <div className="form-group">
            <label>...o pega el texto directamente</label>
            <textarea
              rows="6"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={'104726011638\tBONILLA AYALA DIANA ISABELLA\tdianaibonilla@unicauca.edu.co'}
              style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
              disabled={!!archivo}
            />
          </div>

          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '0.75rem', fontWeight: 'bold' }}>
              {error}
            </div>
          )}

          {resultado && (
            <div style={{
              fontSize: '0.75rem', marginBottom: '0.75rem', padding: '0.75rem',
              borderRadius: '0.75rem', border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.1)'
            }}>
              <div><strong>Total procesados:</strong> {resultado.total}</div>
              <div><strong>Creados:</strong> {resultado.creados} · <strong>Ya existían:</strong> {resultado.yaExistian} · <strong>Inscritos:</strong> {resultado.inscritos}</div>
              {resultado.errores?.length > 0 && (
                <div style={{ marginTop: '0.5rem', color: '#f59e0b' }}>
                  <strong>{resultado.errores.length} línea(s) con problemas:</strong>
                  <ul style={{ margin: '0.25rem 0 0 1rem' }}>
                    {resultado.errores.slice(0, 10).map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-action" onClick={handleClose}>
              {resultado ? 'Cerrar' : 'Cancelar'}
            </button>
            <button type="submit" className="btn-create" disabled={cargando}>
              {cargando ? 'Procesando...' : 'Cargar Estudiantes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
