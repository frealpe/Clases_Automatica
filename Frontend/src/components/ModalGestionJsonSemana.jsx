import React, { useState, useEffect } from 'react';
import { semanasService } from '../services/semanas.service';

export default function ModalGestionJsonSemana({ isOpen, onClose, materia, semanas = [], onActualizado, semanaInicialId }) {
  const [semanaId, setSemanaId] = useState(semanaInicialId || semanas[0]?.id || 1);
  const [jsonText, setJsonText] = useState('{\n  "titulo": "Semana 1",\n  "seccion1": {}\n}');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [guardando, setGuardando] = useState(false);

  // Al abrir el modal para una sesión específica, preseleccionarla
  useEffect(() => {
    if (isOpen && semanaInicialId) {
      setSemanaId(semanaInicialId);
    }
  }, [isOpen, semanaInicialId]);

  const semanaSeleccionada = semanas.find((s) => s.id === Number(semanaId)) || semanas[0];

  // Cargar contenido JSON actual desde la BD cuando cambia la semana
  useEffect(() => {
    if (semanaSeleccionada?.id) {
      cargarContenidoBD(semanaSeleccionada.id);
    }
  }, [semanaId, semanaSeleccionada]);

  const cargarContenidoBD = async (id) => {
    setMensaje({ tipo: '', texto: '' });
    const data = await semanasService.getSemanaById(id);
    if (data && data.contenidoJson) {
      setJsonText(JSON.stringify(data.contenidoJson, null, 2));
    } else {
      setJsonText('{\n  "titulo": "Nuevo Tema de Clase",\n  "subtitulo": "Lección oficial",\n  "seccion1": {\n    "titulo": "1. Introducción Teórica",\n    "def11": {\n      "nombre": "DEFINICIÓN 1.1",\n      "formula": "a₁ x₁ + a₂ x₂ = b",\n      "explicacion": "Explicación teórica redactada"\n    }\n  },\n  "ejerciciosPropuestos": []\n}');
    }
  };

  if (!isOpen) return null;

  // 1. Subir archivo JSON local
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonText(JSON.stringify(parsed, null, 2));
        setMensaje({ tipo: 'exito', texto: '✓ Archivo .json cargado localmente. Haz clic en "Guardar en Base de Datos".' });
      } catch (err) {
        setMensaje({ tipo: 'error', texto: '❌ El archivo seleccionado no tiene un formato JSON válido.' });
      }
    };
    reader.readAsText(file);
  };

  // 2. Guardar JSON en PostgreSQL DB
  const handleGuardarDB = async () => {
    setGuardando(true);
    setMensaje({ tipo: '', texto: '' });
    try {
      const parsed = JSON.parse(jsonText);
      const res = await semanasService.guardarContenidoSemana(semanaSeleccionada.id, parsed);
      if (res && res.ok) {
        setMensaje({ tipo: 'exito', texto: `✅ ¡Contenido JSON grabado exitosamente en PostgreSQL DB para la Semana ${semanaSeleccionada.numero}!` });
        if (onActualizado) onActualizado();
      } else {
        setMensaje({ tipo: 'error', texto: '❌ Error al comunicarse con la base de datos PostgreSQL.' });
      }
    } catch (err) {
      setMensaje({ tipo: 'error', texto: '❌ Error de Sintaxis: El texto ingresado no es un JSON válido.' });
    } finally {
      setGuardando(false);
    }
  };

  // 3. Eliminar / Limpiar Contenido JSON en PostgreSQL DB
  const handleEliminarDB = async () => {
    if (!window.confirm(`¿Seguro que deseas eliminar/resetear el contenido JSON de la Semana ${semanaSeleccionada.numero}?`)) return;

    setGuardando(true);
    const res = await semanasService.eliminarContenidoSemana(semanaSeleccionada.id);
    if (res && res.ok) {
      setJsonText('{\n  "titulo": "Sin Contenido Cargado",\n  "seccion1": {}\n}');
      setMensaje({ tipo: 'exito', texto: `🗑️ Contenido JSON de la Semana ${semanaSeleccionada.numero} limpiado en PostgreSQL DB.` });
      if (onActualizado) onActualizado();
    } else {
      setMensaje({ tipo: 'error', texto: '❌ Error al eliminar el contenido en la base de datos.' });
    }
    setGuardando(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-white max-h-[90vh]">
        {/* Encabezado Modal */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono font-bold text-[#38bdf8] uppercase">
              GESTIÓN DE MATERIAL DE CLASE (POSTGRESQL JSON)
            </div>
            <h2 className="text-xl font-extrabold text-white mt-0.5">
              [{materia?.codigo}] {materia?.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Controles de Selección de Semana y Carga de Archivos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
              Seleccionar Semana a Modificar:
            </label>
            <select
              value={semanaId}
              onChange={(e) => setSemanaId(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-bold outline-none"
            >
              {semanas.map((s) => (
                <option key={s.id} value={s.id}>
                  Semana {s.numero}: {s.unidad}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-400 mb-1">
              Subir Archivo .JSON desde Equipo:
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="w-full text-xs text-slate-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#38bdf8] file:text-black hover:file:bg-sky-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Notificaciones */}
        {mensaje.texto && (
          <div className={`p-3 rounded-lg text-xs font-mono font-bold ${
            mensaje.tipo === 'exito' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'bg-red-950/80 text-red-300 border border-red-500/40'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Area de Edición del Objeto JSON */}
        <div className="flex-1 flex flex-col gap-1.5 min-h-[260px]">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>Editor JSON en Vivo:</span>
            <span>Semana {semanaSeleccionada?.numero}</span>
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-64 bg-slate-950 font-mono text-xs text-sky-300 p-4 rounded-xl border border-slate-800 outline-none focus:border-[#38bdf8] resize-none leading-relaxed"
            placeholder="Pegar objeto JSON de la clase..."
          />
        </div>

        {/* Acciones de Guardar / Eliminar */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button
            onClick={handleEliminarDB}
            disabled={guardando}
            className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs hover:bg-red-500/30 transition-all cursor-pointer"
          >
            🗑️ Eliminar Contenido en BD
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-700 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={handleGuardarDB}
              disabled={guardando}
              className="px-5 py-2 rounded-xl bg-[#38bdf8] text-black font-extrabold text-xs hover:bg-sky-300 shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              <span>{guardando ? 'Guardando...' : 'Guardar en Base de Datos PostgreSQL'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
