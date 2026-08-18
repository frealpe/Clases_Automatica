import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import { semanasService } from '../services/semanas.service';
import { preguntasService } from '../services/preguntas.service';
import { API_URL } from '../services/apiClient';
import Sidebar from '../components/Sidebar';
import GestionPreguntasModal from '../components/GestionPreguntasModal';
import { withAuth } from '../hocs/withAuth';
import { withRole } from '../hocs/withRole';

const TIPOS_PDF = [
  { tipo: 'notas', etiqueta: 'Notas de Clase', icono: 'description' },
  { tipo: 'guia', etiqueta: 'Guía de Aprendizaje', icono: 'menu_book' },
  { tipo: 'diapositivas', etiqueta: 'Diapositivas', icono: 'slideshow' }
];

const objetivoVacio = () => ({ ra: '', descripcion: '' });

function GestionContenidoViewBase() {
  const navigate = useNavigate();
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const semanas = useCourseStore((state) => state.semanas);
  const cargarSemanasFromService = useCourseStore((state) => state.cargarSemanasFromService);
  const themeMode = useCourseStore((state) => state.themeMode);

  const [borradores, setBorradores] = useState({});
  const [nombresBorrador, setNombresBorrador] = useState({});
  const [subiendo, setSubiendo] = useState({});
  const [guardando, setGuardando] = useState({});
  const [guardandoNombre, setGuardandoNombre] = useState({});
  const [mensaje, setMensaje] = useState({});
  const [agregandoSesion, setAgregandoSesion] = useState(false);
  const [eliminandoSesion, setEliminandoSesion] = useState({});
  const [subiendoHtml, setSubiendoHtml] = useState({});
  const [subiendoBancoZip, setSubiendoBancoZip] = useState({});
  const [preguntasCount, setPreguntasCount] = useState({});
  const [semanaPreguntas, setSemanaPreguntas] = useState(null);
  const [examenBorrador, setExamenBorrador] = useState({});
  const [guardandoExamen, setGuardandoExamen] = useState({});

  const esLight = themeMode === 'light';
  const materiaActiva = materias.find((m) => m.id === materiaActivaId) || materias[0];
  const textoSecundario = esLight ? 'text-slate-600' : 'text-slate-400';

  useEffect(() => {
    if (materiaActivaId) cargarSemanasFromService(materiaActivaId);
  }, [materiaActivaId, cargarSemanasFromService]);

  useEffect(() => {
    setBorradores((prev) => {
      const siguiente = { ...prev };
      semanas.forEach((s) => {
        if (!siguiente[s.id]) {
          const objetivos = Array.isArray(s.objetivos) && s.objetivos.length > 0
            ? s.objetivos.map((o) => ({ ra: o.ra || '', descripcion: o.descripcion || '' }))
            : [{ ra: s.ra || '', descripcion: s.raDescripcion || '' }];
          siguiente[s.id] = { objetivos };
        }
      });
      return siguiente;
    });
    setNombresBorrador((prev) => {
      const siguiente = { ...prev };
      semanas.forEach((s) => {
        // El store puede arrancar con datos de respaldo locales (sin unidadNombre) antes
        // de que responda el backend; no fijar el borrador hasta tener el nombre real.
        if (siguiente[s.id] === undefined && s.unidadNombre) {
          siguiente[s.id] = s.unidadNombre;
        }
      });
      return siguiente;
    });
    setExamenBorrador((prev) => {
      const siguiente = { ...prev };
      semanas.forEach((s) => {
        siguiente[s.id] = {
          duracionExamenMin: String(s.min ?? 15),
          preguntasExamenCount: s.preguntasExamenCount != null ? String(s.preguntasExamenCount) : ''
        };
      });
      return siguiente;
    });
  }, [semanas]);

  // Conteo de preguntas del banco por sesión (para mostrar "Gestionar (N)" en la tarjeta)
  useEffect(() => {
    semanas.forEach((s) => {
      preguntasService.getPreguntasBySemana(s.id).then((lista) => {
        setPreguntasCount((prev) => ({ ...prev, [s.id]: (lista || []).length }));
      });
    });
  }, [semanas]);

  const mostrarMensaje = (clave, texto) => {
    setMensaje((prev) => ({ ...prev, [clave]: texto }));
    setTimeout(() => setMensaje((prev) => ({ ...prev, [clave]: '' })), 2500);
  };

  const handleCambiarObjetivo = (semanaId, indice, campo, valor) => {
    setBorradores((prev) => {
      const objetivos = [...(prev[semanaId]?.objetivos || [])];
      objetivos[indice] = { ...objetivos[indice], [campo]: valor };
      return { ...prev, [semanaId]: { objetivos } };
    });
  };

  const handleAgregarObjetivo = (semanaId) => {
    setBorradores((prev) => ({
      ...prev,
      [semanaId]: { objetivos: [...(prev[semanaId]?.objetivos || []), objetivoVacio()] }
    }));
  };

  const handleQuitarObjetivo = (semanaId, indice) => {
    setBorradores((prev) => {
      const objetivos = (prev[semanaId]?.objetivos || []).filter((_, i) => i !== indice);
      return { ...prev, [semanaId]: { objetivos: objetivos.length > 0 ? objetivos : [objetivoVacio()] } };
    });
  };

  const handleGuardarObjetivo = async (id) => {
    setGuardando((prev) => ({ ...prev, [id]: true }));
    const res = await semanasService.actualizarObjetivo(id, borradores[id]?.objetivos || []);
    setGuardando((prev) => ({ ...prev, [id]: false }));
    mostrarMensaje(id, res?.ok ? '✅ Objetivos guardados' : '❌ Error al guardar');
    if (res?.ok) cargarSemanasFromService(materiaActivaId);
  };

  const handleSubirPdf = async (id, tipo, archivo) => {
    if (!archivo) return;
    const clave = `${id}-${tipo}`;
    setSubiendo((prev) => ({ ...prev, [clave]: true }));
    const res = await semanasService.subirPdf(id, tipo, archivo);
    setSubiendo((prev) => ({ ...prev, [clave]: false }));
    mostrarMensaje(clave, res?.ok ? '✅ PDF subido' : '❌ Error al subir el PDF');
    if (res?.ok) cargarSemanasFromService(materiaActivaId);
  };

  const handleSubirProyectoHtml = async (id, archivo) => {
    if (!archivo) return;
    if (!archivo.name.toLowerCase().endsWith('.zip')) {
      mostrarMensaje(`html-${id}`, '❌ Debe ser un archivo .zip');
      return;
    }
    setSubiendoHtml((prev) => ({ ...prev, [id]: true }));
    const res = await semanasService.subirProyectoHtml(id, archivo);
    setSubiendoHtml((prev) => ({ ...prev, [id]: false }));
    mostrarMensaje(`html-${id}`, res?.ok ? '✅ Proyecto web publicado' : `❌ ${res?.error || 'Error al subir el proyecto'}`);
    if (res?.ok) cargarSemanasFromService(materiaActivaId);
  };

  const handleSubirBancoZip = async (id, archivo) => {
    if (!archivo) return;
    if (!archivo.name.toLowerCase().endsWith('.zip')) {
      mostrarMensaje(`banco-zip-${id}`, '❌ Debe ser un archivo .zip');
      return;
    }
    setSubiendoBancoZip((prev) => ({ ...prev, [id]: true }));
    const res = await semanasService.subirBancoPreguntasZip(id, archivo);
    setSubiendoBancoZip((prev) => ({ ...prev, [id]: false }));
    mostrarMensaje(`banco-zip-${id}`, res?.ok ? '✅ Banco .zip publicado' : `❌ ${res?.error || 'Error al subir'}`);
    if (res?.ok) cargarSemanasFromService(materiaActivaId);
  };

  const handleGuardarNombre = async (id) => {
    const nombre = (nombresBorrador[id] || '').trim();
    if (!nombre) {
      mostrarMensaje(`nombre-${id}`, '❌ El nombre no puede estar vacío');
      return;
    }
    setGuardandoNombre((prev) => ({ ...prev, [id]: true }));
    const res = await semanasService.actualizarNombre(id, nombre);
    setGuardandoNombre((prev) => ({ ...prev, [id]: false }));
    mostrarMensaje(`nombre-${id}`, res?.ok ? '✅ Nombre guardado' : '❌ Error al guardar el nombre');
    if (res?.ok) cargarSemanasFromService(materiaActivaId);
  };

  const handleCambiarExamenBorrador = (semanaId, campo, valor) => {
    setExamenBorrador((prev) => ({
      ...prev,
      [semanaId]: { ...prev[semanaId], [campo]: valor }
    }));
  };

  const handleGuardarConfigExamen = async (id) => {
    const borrador = examenBorrador[id] || {};
    const duracionExamenMin = parseInt(borrador.duracionExamenMin, 10);
    if (!Number.isFinite(duracionExamenMin) || duracionExamenMin < 1) {
      mostrarMensaje(`examen-${id}`, '❌ Duración inválida');
      return;
    }
    const preguntasExamenCount = borrador.preguntasExamenCount === ''
      ? null
      : parseInt(borrador.preguntasExamenCount, 10);

    setGuardandoExamen((prev) => ({ ...prev, [id]: true }));
    const res = await semanasService.actualizarConfigExamen(id, { duracionExamenMin, preguntasExamenCount });
    setGuardandoExamen((prev) => ({ ...prev, [id]: false }));
    mostrarMensaje(`examen-${id}`, res?.ok ? '✅ Examen configurado' : '❌ Error al guardar');
    if (res?.ok) cargarSemanasFromService(materiaActivaId);
  };

  const handleAgregarSesion = async () => {
    const nombre = window.prompt('Nombre de la nueva sesión:', '');
    if (nombre === null) return;
    setAgregandoSesion(true);
    const res = await semanasService.crearSemana(materiaActivaId, nombre);
    setAgregandoSesion(false);
    if (res?.ok) {
      cargarSemanasFromService(materiaActivaId);
    } else {
      mostrarMensaje('global', '❌ Error al agregar la sesión');
    }
  };

  const handleEliminarSesion = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta sesión? Se perderá su objetivo, contenido y PDFs subidos.')) return;
    setEliminandoSesion((prev) => ({ ...prev, [id]: true }));
    const res = await semanasService.eliminarSemana(id);
    setEliminandoSesion((prev) => ({ ...prev, [id]: false }));
    if (res?.ok) {
      cargarSemanasFromService(materiaActivaId);
    } else {
      mostrarMensaje(id, '❌ Error al eliminar la sesión');
    }
  };

  return (
    <div className="h-full w-full flex gap-6 items-start overflow-hidden">
      {/* SIDEBAR UNIFICADO */}
      <Sidebar />

      {/* ÁREA PRINCIPAL: ADMINISTRACIÓN DE CONTENIDO A PANTALLA COMPLETA */}
      <main className="flex-1 flex flex-col h-full w-full overflow-hidden gap-4">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 pb-3 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/materias')}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                esLight
                  ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                  : 'bg-slate-800/80 border-slate-700 text-white hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">west</span>
              <span>Volver a Materias</span>
            </button>

            <div>
              <div className={`text-xs font-mono font-bold uppercase tracking-wider ${esLight ? 'text-sky-700' : 'text-[#38bdf8]'}`}>
                ADMINISTRAR CONTENIDO — [{materiaActiva?.codigo}]
              </div>
              <h1 className="text-xl font-extrabold leading-tight">
                {materiaActiva?.nombre} · {semanas.length} sesiones
              </h1>
            </div>
          </div>

          <button
            onClick={handleAgregarSesion}
            disabled={agregandoSesion}
            className="px-4 py-2 rounded-xl bg-[#38bdf8] text-black font-extrabold text-xs hover:bg-sky-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>{agregandoSesion ? 'Agregando...' : '+ Agregar Sesión'}</span>
          </button>
        </div>

        {mensaje.global && (
          <div className="text-xs font-mono font-bold text-red-400 shrink-0">{mensaje.global}</div>
        )}

        {/* LISTA DE SESIONES DE LA MATERIA */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          {semanas.map((s) => {
            const objetivos = borradores[s.id]?.objetivos || [objetivoVacio()];
            return (
              <div
                key={s.id}
                className={`p-4 rounded-xl border flex flex-col xl:flex-row gap-4 ${
                  esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/60 border-slate-800 shadow-sm'
                }`}
              >
                {/* IDENTIFICACIÓN DE LA SESIÓN (NOMBRE EDITABLE) */}
                <div className="xl:w-52 shrink-0 flex flex-col gap-2">
                  <div>
                    <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${textoSecundario}`}>
                      Sesión {s.numero}
                    </div>
                    <input
                      value={nombresBorrador[s.id] ?? ''}
                      onChange={(e) => setNombresBorrador((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      placeholder="Nombre de la sesión"
                      className={`w-full text-sm font-bold rounded-lg px-2 py-1 mt-0.5 border outline-none ${
                        esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => handleGuardarNombre(s.id)}
                        disabled={guardandoNombre[s.id]}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                          esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {guardandoNombre[s.id] ? 'Guardando...' : 'Guardar Nombre'}
                      </button>
                      {mensaje[`nombre-${s.id}`] && <span className="text-[9px] font-mono font-bold">{mensaje[`nombre-${s.id}`]}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminarSesion(s.id)}
                    disabled={eliminandoSesion[s.id]}
                    className="self-start px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/40 text-red-400 font-bold text-[10px] hover:bg-red-500/25 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    <span>{eliminandoSesion[s.id] ? 'Eliminando...' : 'Eliminar Sesión'}</span>
                  </button>
                </div>

                {/* OBJETIVOS DE APRENDIZAJE (RA) — UNO O VARIOS SEGÚN LA CLASE */}
                <div className="flex-1 min-w-[260px] flex flex-col gap-1.5">
                  <label className={`text-[10px] font-mono font-bold uppercase tracking-wider ${textoSecundario}`}>
                    Objetivos de Aprendizaje (Resultados de Aprendizaje)
                  </label>

                  <div className="flex flex-col gap-1.5">
                    {objetivos.map((obj, indice) => (
                      <div key={indice} className="flex flex-col sm:flex-row gap-2 items-start">
                        <input
                          value={obj.ra}
                          onChange={(e) => handleCambiarObjetivo(s.id, indice, 'ra', e.target.value)}
                          placeholder="Ej. RA1.1"
                          className={`sm:w-28 shrink-0 text-xs font-bold rounded-lg px-2.5 py-2 border outline-none ${
                            esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                          }`}
                        />
                        <textarea
                          rows={2}
                          value={obj.descripcion}
                          onChange={(e) => handleCambiarObjetivo(s.id, indice, 'descripcion', e.target.value)}
                          placeholder="Describe lo que el estudiante debe lograr en esta sesión..."
                          className={`flex-1 text-xs rounded-lg px-2.5 py-2 border outline-none resize-none leading-relaxed ${
                            esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                          }`}
                        />
                        <button
                          onClick={() => handleQuitarObjetivo(s.id, indice)}
                          title="Quitar este objetivo"
                          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                            esLight ? 'bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600' : 'bg-slate-800 text-slate-400 hover:bg-red-500/20 hover:text-red-400'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleAgregarObjetivo(s.id)}
                      className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 ${
                        esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Agregar Objetivo</span>
                    </button>
                    <button
                      onClick={() => handleGuardarObjetivo(s.id)}
                      disabled={guardando[s.id]}
                      className={`px-3 py-1.5 rounded-lg font-extrabold text-[11px] transition-all cursor-pointer ${
                        esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
                      }`}
                    >
                      {guardando[s.id] ? 'Guardando...' : 'Guardar Objetivos'}
                    </button>
                    {mensaje[s.id] && <span className="text-[10px] font-mono font-bold">{mensaje[s.id]}</span>}
                  </div>
                </div>

                {/* ARCHIVOS PDF (NOTAS, GUÍA, DIAPOSITIVAS) Y LECCIÓN INTERACTIVA (JSON) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4 gap-2 xl:w-[280px] 2xl:w-[540px] shrink-0">
                  {TIPOS_PDF.map(({ tipo, etiqueta, icono }) => {
                    const url = s[`${tipo}PdfUrl`];
                    const clave = `${s.id}-${tipo}`;
                    return (
                      <div
                        key={tipo}
                        className={`min-w-0 p-2.5 rounded-lg border flex flex-col items-center gap-1 text-center ${
                          esLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                        }`}
                      >
                        <span className={`material-symbols-outlined text-base ${esLight ? 'text-sky-700' : 'text-[#38bdf8]'}`}>
                          {icono}
                        </span>
                        <span className="text-[10px] font-bold leading-tight">{etiqueta}</span>
                        {url ? (
                          <a
                            href={`${API_URL}${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-emerald-500 underline"
                          >
                            Ver PDF ✓
                          </a>
                        ) : (
                          <span className={`text-[10px] ${textoSecundario}`}>Sin archivo</span>
                        )}
                        <label
                          className={`text-[10px] font-extrabold px-2 py-1 rounded-md cursor-pointer transition-all ${
                            esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
                          }`}
                        >
                          {subiendo[clave] ? 'Subiendo...' : url ? 'Reemplazar' : 'Subir PDF'}
                          <input
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) => handleSubirPdf(s.id, tipo, e.target.files[0])}
                          />
                        </label>
                        {mensaje[clave] && <span className="text-[9px] font-mono font-bold">{mensaje[clave]}</span>}
                      </div>
                    );
                  })}

                  {/* MATERIAL WEB: PROYECTO HTML COMPLETO (.zip) DE ESTA SESIÓN */}
                  <div
                    className={`min-w-0 p-2.5 rounded-lg border flex flex-col items-center gap-1 text-center ${
                      esLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-base ${esLight ? 'text-sky-700' : 'text-[#38bdf8]'}`}>
                      language
                    </span>
                    <span className="text-[10px] font-bold leading-tight">Material Web</span>
                    {s.claseWebUrl ? (
                      <a
                        href={`${API_URL}${s.claseWebUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-emerald-500 underline"
                      >
                        Ver ✓
                      </a>
                    ) : (
                      <span className={`text-[10px] ${textoSecundario}`}>Sin publicar</span>
                    )}
                    <label
                      className={`text-[10px] font-extrabold px-2 py-1 rounded-md cursor-pointer transition-all ${
                        esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
                      }`}
                      title="Sube un .zip con tu proyecto HTML (debe incluir index.html en la raíz)"
                    >
                      {subiendoHtml[s.id] ? 'Subiendo...' : s.claseWebUrl ? 'Reemplazar' : 'Subir .zip'}
                      <input
                        type="file"
                        accept=".zip,application/zip"
                        className="hidden"
                        onChange={(e) => handleSubirProyectoHtml(s.id, e.target.files[0])}
                      />
                    </label>
                    {mensaje[`html-${s.id}`] && <span className="text-[9px] font-mono font-bold">{mensaje[`html-${s.id}`]}</span>}
                  </div>

                  {/* BANCO DE PREGUNTAS: PREGUNTAS DE OPCIÓN MÚLTIPLE DEL EXAMEN WEB DE ESTA SESIÓN */}
                  <div
                    className={`min-w-0 p-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 text-center ${
                      esLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-bold leading-tight">
                      Banco de Preguntas · {preguntasCount[s.id] ?? 0}
                    </span>
                    <div className="flex items-center gap-1 w-full">
                      <button
                        onClick={() => setSemanaPreguntas(s)}
                        className={`flex-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                          esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
                        }`}
                      >
                        Gestionar
                      </button>
                      <label
                        className={`flex-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md cursor-pointer transition-all text-center ${
                          esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                        title="Sube un .zip con un banco de preguntas en HTML (material adicional; complementa las preguntas del formulario)"
                      >
                        {subiendoBancoZip[s.id] ? '...' : s.bancoPreguntasUrl ? 'Zip ✓' : 'Subir .zip'}
                        <input
                          type="file"
                          accept=".zip,application/zip"
                          className="hidden"
                          onChange={(e) => handleSubirBancoZip(s.id, e.target.files[0])}
                        />
                      </label>
                    </div>
                    {s.bancoPreguntasUrl && (
                      <a
                        href={`${API_URL}${s.bancoPreguntasUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] font-bold text-emerald-500 underline"
                      >
                        Ver .zip
                      </a>
                    )}
                    {mensaje[`banco-zip-${s.id}`] && <span className="text-[9px] font-mono font-bold">{mensaje[`banco-zip-${s.id}`]}</span>}
                  </div>

                  {/* CONFIGURAR EXAMEN WEB: DURACIÓN Y CANTIDAD DE PREGUNTAS ALEATORIAS POR ESTUDIANTE */}
                  <div
                    className={`min-w-0 p-2 rounded-lg border flex flex-col items-center justify-center gap-0.5 text-center ${
                      esLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-bold leading-tight">Examen Web</span>
                    <div className="flex items-center gap-1 w-full">
                      <input
                        type="number"
                        min="1"
                        value={examenBorrador[s.id]?.duracionExamenMin ?? ''}
                        onChange={(e) => handleCambiarExamenBorrador(s.id, 'duracionExamenMin', e.target.value)}
                        placeholder="Min."
                        title="Duración del examen en minutos"
                        className={`w-1/2 text-[10px] font-bold rounded-md px-1 py-0.5 border outline-none text-center ${
                          esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                      <input
                        type="number"
                        min="1"
                        value={examenBorrador[s.id]?.preguntasExamenCount ?? ''}
                        onChange={(e) => handleCambiarExamenBorrador(s.id, 'preguntasExamenCount', e.target.value)}
                        placeholder="Todas"
                        title="Cuántas preguntas aleatorias se le presentan a cada estudiante (vacío = todas)"
                        className={`w-1/2 text-[10px] font-bold rounded-md px-1 py-0.5 border outline-none text-center ${
                          esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                        }`}
                      />
                    </div>
                    <button
                      onClick={() => handleGuardarConfigExamen(s.id)}
                      disabled={guardandoExamen[s.id]}
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md cursor-pointer transition-all ${
                        esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
                      }`}
                    >
                      {guardandoExamen[s.id] ? 'Guardando...' : 'Guardar'}
                    </button>
                    {mensaje[`examen-${s.id}`] && <span className="text-[9px] font-mono font-bold">{mensaje[`examen-${s.id}`]}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <GestionPreguntasModal
        isOpen={Boolean(semanaPreguntas)}
        onClose={() => {
          setSemanaPreguntas(null);
          if (semanaPreguntas) {
            preguntasService.getPreguntasBySemana(semanaPreguntas.id).then((lista) => {
              setPreguntasCount((prev) => ({ ...prev, [semanaPreguntas.id]: (lista || []).length }));
            });
          }
        }}
        semana={semanaPreguntas}
      />
    </div>
  );
}

export default withAuth(withRole(GestionContenidoViewBase, ['DOCENTE']));
