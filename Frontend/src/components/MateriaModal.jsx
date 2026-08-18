import React, { useState, useEffect } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { useAuth } from '../context/AuthContext';
import { usuariosService } from '../services/usuarios.service';

export default function MateriaModal({ isOpen, onClose }) {
  const agregarMateria = useCourseStore((state) => state.agregarMateria);
  const { esSuperusuario } = useAuth();

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [semestre, setSemestre] = useState('2026-1');
  const [numeroSemanas, setNumeroSemanas] = useState(16);
  const [docenteId, setDocenteId] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && esSuperusuario) {
      usuariosService.getUsuarios()
        .then((lista) => setDocentes((lista || []).filter((u) => u.rol === 'DOCENTE')))
        .catch(() => setDocentes([]));
    }
  }, [isOpen, esSuperusuario]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    if (esSuperusuario && !docenteId) {
      setError('Debes elegir el docente responsable de la materia');
      return;
    }

    setError('');
    try {
      await agregarMateria({
        codigo: codigo || `MAT-${Math.floor(Math.random() * 900 + 100)}`,
        nombre,
        descripcion,
        semestre,
        numeroSemanas: Math.min(Math.max(parseInt(numeroSemanas, 10) || 16, 1), 32),
        ...(esSuperusuario ? { docenteId: parseInt(docenteId, 10) } : {})
      });

      setCodigo('');
      setNombre('');
      setDescripcion('');
      setNumeroSemanas(16);
      setDocenteId('');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al crear la materia');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-header">📚 Registrar Nueva Materia / Asignatura en la BD</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Código de la Materia</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ej. MAT-201, FIS-102, EDO-301"
            />
          </div>

          <div className="form-group">
            <label>Nombre de la Materia / Asignatura</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ej. Cálculo Multivariable, Ecuaciones Diferenciales"
            />
          </div>

          <div className="form-group">
            <label>Descripción / Programa Académico</label>
            <textarea
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej. Curso de integrales múltiples, campos vectoriales y teorema de Green..."
            />
          </div>

          <div className="form-group">
            <label>Semestre Académico</label>
            <select value={semestre} onChange={(e) => setSemestre(e.target.value)}>
              <option value="2026-1">2026-1</option>
              <option value="2026-2">2026-2</option>
            </select>
          </div>

          <div className="form-group">
            <label>Número de Semanas / Sesiones</label>
            <input
              type="number"
              min="1"
              max="32"
              value={numeroSemanas}
              onChange={(e) => setNumeroSemanas(e.target.value)}
              placeholder="Ej. 16"
            />
          </div>

          {esSuperusuario && (
            <div className="form-group">
              <label>Docente Responsable</label>
              <select value={docenteId} onChange={(e) => setDocenteId(e.target.value)} required>
                <option value="">-- Selecciona un docente --</option>
                {docentes.map((d) => (
                  <option key={d.id} value={d.id}>{d.nombre} ({d.email})</option>
                ))}
              </select>
            </div>
          )}

          {error && <p style={{ color: 'var(--color-danger, #d9534f)' }}>{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn-action" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-create">
              Guardar en Base de Datos PostgreSQL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
