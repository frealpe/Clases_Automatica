import React, { useState } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { estudiantesService } from '../services/estudiantes.service';

export default function CargaEstudiantesModal({ isOpen, materia, materiaId, onClose }) {
  const materias = useCourseStore((state) => state.materias);
  const themeMode = useCourseStore((state) => state.themeMode);
  const esLight = themeMode === 'light';

  const [materiaSelId, setMateriaSelId] = useState(materia?.id || materiaId || materias[0]?.id || 1);
  const [archivo, setArchivo] = useState(null);
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const targetMateriaId = materiaSelId || materia?.id || materiaId || materias[0]?.id || 1;
  const targetMateriaObj = materias.find((m) => m.id === Number(targetMateriaId)) || materia;

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
      setError('Por favor selecciona un archivo (.md, .txt) o pega la lista de estudiantes.');
      return;
    }

    if (!targetMateriaId) {
      setError('Por favor selecciona la materia a la cual deseas matricular los estudiantes.');
      return;
    }

    setCargando(true);
    setError('');
    setResultado(null);

    try {
      const data = await estudiantesService.cargaMasiva({
        materiaId: targetMateriaId,
        archivo,
        texto,
      });
      setResultado(data);
      setArchivo(null);
      setTexto('');
    } catch (err) {
      const msg = err?.response?.data?.message;
      const errorText = Array.isArray(msg)
        ? msg.join(', ')
        : (typeof msg === 'string' ? msg : 'Error al procesar la lista de estudiantes.');
      setError(errorText);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 transition-all ${
        esLight ? 'bg-white text-slate-900 border-slate-200' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-500/20 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-sky-500">upload_file</span>
            <h3 className="text-lg font-bold">Cargar Estudiantes (.md)</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <p className="text-xs text-slate-400 mb-4">
          Adjunta un archivo <strong>Estudiantes.md</strong> (o <code>.txt</code> / <code>.csv</code>) con el formato institucional:
          <code className="block mt-1 p-2 rounded bg-slate-950 font-mono text-[11px] text-sky-400">
            [Cédula] &#9; [NOMBRE COMPLETO] &#9; [correo@unicauca.edu.co]
          </code>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1">Materia Destino</label>
            <select
              value={targetMateriaId}
              onChange={(e) => setMateriaSelId(Number(e.target.value))}
              className={`w-full p-2.5 text-xs rounded-xl border font-bold outline-none ${
                esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
            >
              {materias.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} ({m.codigo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">Adjuntar Archivo Estudiantes.md</label>
            <input
              type="file"
              accept=".md,.txt,.csv"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
              className={`w-full text-xs p-2 rounded-xl border file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold ${
                esLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 file:bg-sky-600 file:text-white'
                  : 'bg-slate-950 border-slate-700 text-white file:bg-sky-500 file:text-slate-950'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">...o pega el contenido directamente</label>
            <textarea
              rows="5"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="104726011638&#9;BONILLA AYALA DIANA ISABELLA&#9;dianaibonilla@unicauca.edu.co"
              className={`w-full text-xs font-mono p-2.5 rounded-xl border outline-none ${
                esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
              }`}
              disabled={!!archivo}
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          {resultado && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono space-y-1">
              <div><strong>✅ Proceso completado exitosamente:</strong></div>
              <div>• Total registros procesados: <strong>{resultado.total}</strong></div>
              <div>• Cuentas creadas: <strong>{resultado.creados}</strong> · Ya existían: <strong>{resultado.yaExistian}</strong></div>
              <div>• Matricular en {targetMateriaObj?.nombre}: <strong>{resultado.inscritos}</strong></div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-500/20">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs rounded-xl border border-slate-500/30 text-slate-400 hover:text-white cursor-pointer"
            >
              {resultado ? 'Cerrar' : 'Cancelar'}
            </button>
            <button
              type="submit"
              disabled={cargando}
              className={`px-4 py-2 text-xs rounded-xl font-bold cursor-pointer transition-all flex items-center gap-2 ${
                esLight ? 'bg-sky-700 text-white hover:bg-sky-800' : 'bg-sky-500 text-slate-950 hover:bg-sky-400'
              }`}
            >
              {cargando ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Procesando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">upload</span>
                  Cargar Estudiantes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
