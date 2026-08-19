import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useCourseStore } from '../store/useCourseStore';
import { evaluacionesService } from '../services/evaluaciones.service';

// examenProgramado, si se pasa, activa el modo "programado": ventana de calendario, pantalla
// completa + detección de infracciones (blur/cambio de pestaña/salida de fullscreen) y timer con
// auto-entrega. Sin examenProgramado se conserva el modo "bajo demanda" original (por semana).
export default function ExamenModal({ isOpen, onClose, semana, examenProgramado }) {
  const cargarPreguntasExamenFromService = useCourseStore((state) => state.cargarPreguntasExamenFromService);
  const cargarPreguntasExamenProgramadoFromService = useCourseStore((state) => state.cargarPreguntasExamenProgramadoFromService);
  const submitExamenProgramadoAction = useCourseStore((state) => state.submitExamenProgramadoAction);

  const modoProgramado = Boolean(examenProgramado);

  // fase solo se usa en modo programado: intro (pantalla de aviso) -> en-curso -> finalizado
  const [fase, setFase] = useState('intro');
  const [preguntas, setPreguntas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [respuestas, setRespuestas] = useState({});
  const [finalizado, setFinalizado] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [inicioMs, setInicioMs] = useState(null);
  const [infracciones, setInfracciones] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');
  const [segundosRestantes, setSegundosRestantes] = useState(null);

  const respuestasRef = useRef(respuestas);
  respuestasRef.current = respuestas;
  const infraccionesRef = useRef(infracciones);
  infraccionesRef.current = infracciones;
  const inicioMsRef = useRef(inicioMs);
  inicioMsRef.current = inicioMs;
  const entregandoRef = useRef(false);

const normalizarListaPreguntas = (lista) => {
  if (!Array.isArray(lista)) return [];
  return lista.map((p) => {
    let opciones = p.opciones;
    if (typeof opciones === 'string') {
      try {
        opciones = JSON.parse(opciones);
      } catch (e) {
        opciones = [];
      }
    }
    if (!Array.isArray(opciones)) opciones = [];

    const opcionesNorm = opciones.map((op, idx) => {
      if (typeof op === 'string') {
        const id = ['a', 'b', 'c', 'd', 'e'][idx] || String(idx);
        return { id, texto: op };
      }
      const id = String(op?.id || op?.letra || ['a', 'b', 'c', 'd', 'e'][idx] || idx);
      const texto = String(op?.texto || op?.opcion || op?.label || JSON.stringify(op));
      return { id, texto };
    });

    return { ...p, opciones: opcionesNorm };
  });
};

  useEffect(() => {
    if (!isOpen) return;
    setFase('intro');
    setCargando(!modoProgramado);
    setFinalizado(false);
    setResultado(null);
    setRespuestas({});
    setInfracciones([]);
    setErrorCarga('');
    setSegundosRestantes(null);
    entregandoRef.current = false;

    if (!modoProgramado && semana) {
      setInicioMs(Date.now());
      cargarPreguntasExamenFromService(semana.id).then((lista) => {
        setPreguntas(normalizarListaPreguntas(lista));
        setCargando(false);
      });
    }
  }, [isOpen, semana, examenProgramado, modoProgramado, cargarPreguntasExamenFromService]);

  const registrarInfraccion = (tipo) => {
    setInfracciones((prev) => [...prev, { tipo, ts: new Date().toISOString() }]);
  };

  const entregarExamenProgramado = useMemo(() => async () => {
    if (entregandoRef.current) return;
    entregandoRef.current = true;

    const listaPreguntas = preguntas;
    const respuestasFinal = respuestasRef.current;
    const correctas = listaPreguntas.filter((p) => respuestasFinal[p.id] === p.correcta).length;
    const total = listaPreguntas.length;
    const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;
    const nota5 = Math.round(((correctas / (total || 1)) * 5) * 10) / 10;
    const aprobado = porcentaje >= 60;
    const tiempoEmpleadoSeg = Math.round((Date.now() - (inicioMsRef.current || Date.now())) / 1000);

    setResultado({ correctas, total, porcentaje, nota5, aprobado });
    setFinalizado(true);
    setFase('finalizado');

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    try {
      await submitExamenProgramadoAction(examenProgramado.id, {
        respuestas: respuestasFinal,
        nota5,
        porcentaje,
        aprobado,
        tiempoEmpleadoSeg,
        infracciones: infraccionesRef.current
      });
    } catch (err) {
      console.warn('No se pudo registrar el intento programado en el servidor:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preguntas, examenProgramado, submitExamenProgramadoAction]);

  // Listeners de infracción + timer, solo activos durante la fase "en-curso" del modo programado.
  useEffect(() => {
    if (!modoProgramado || fase !== 'en-curso') return;

    const onVisibility = () => { if (document.hidden) registrarInfraccion('visibilitychange'); };
    const onBlur = () => registrarInfraccion('blur');
    const onFullscreenChange = () => { if (!document.fullscreenElement) registrarInfraccion('fullscreen_exit'); };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(intervalo);
          entregarExamenProgramado();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      clearInterval(intervalo);
    };
  }, [modoProgramado, fase, entregarExamenProgramado]);

  const todasRespondidas = useMemo(
    () => preguntas.length > 0 && preguntas.every((p) => respuestas[p.id]),
    [preguntas, respuestas]
  );

  if (!isOpen || (!semana && !examenProgramado)) return null;

  const elegirOpcion = (preguntaId, opcionId) => {
    if (finalizado) return;
    setRespuestas((prev) => ({ ...prev, [preguntaId]: opcionId }));
  };

  const entregarExamen = async () => {
    if (modoProgramado) return entregarExamenProgramado();

    const correctas = preguntas.filter((p) => respuestas[p.id] === p.correcta).length;
    const total = preguntas.length;
    const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;
    const nota5 = Math.round(((correctas / (total || 1)) * 5) * 10) / 10;
    const aprobado = porcentaje >= 60;
    const tiempoEmpleadoSeg = Math.round((Date.now() - inicioMs) / 1000);

    setResultado({ correctas, total, porcentaje, nota5, aprobado });
    setFinalizado(true);

    try {
      await evaluacionesService.submitIntento({
        semanaId: semana.id,
        nota5,
        porcentaje,
        aprobado,
        infraccionIA: false,
        tiempoEmpleadoSeg,
        respuestas
      });
    } catch (err) {
      console.warn('No se pudo registrar el intento en el servidor:', err);
    }
  };

  // Pantalla previa del modo programado: exige un gesto de usuario explícito antes de pedir
  // pantalla completa (los navegadores rechazan requestFullscreen() fuera de un click directo).
  const iniciarExamenProgramado = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.warn('No se pudo activar pantalla completa (el navegador puede haberla bloqueado):', err);
    }

    setCargando(true);
    setErrorCarga('');
    try {
      const data = await cargarPreguntasExamenProgramadoFromService(examenProgramado.id);
      setPreguntas(normalizarListaPreguntas(data?.preguntas));
      setSegundosRestantes((data?.duracionMin || examenProgramado.duracionMin || 15) * 60);
      setInicioMs(Date.now());
      setFase('en-curso');
    } catch (err) {
      setErrorCarga(
        err?.response?.data?.mensaje || err?.response?.data?.message ||
        'No se pudo cargar el examen. Puede que la ventana de disponibilidad ya haya cerrado.'
      );
    } finally {
      setCargando(false);
    }
  };

  const cerrarModal = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    onClose();
  };

  const minutos = segundosRestantes !== null ? Math.floor(segundosRestantes / 60) : null;
  const segundos = segundosRestantes !== null ? segundosRestantes % 60 : null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3 className="modal-header">
          {modoProgramado
            ? `🗓️ ${examenProgramado.titulo}`
            : `📝 Test — Semana ${semana.numero} (${semana.ra})`}
        </h3>

        {/* INTRO DEL MODO PROGRAMADO: aviso + botón que dispara el gesto de usuario */}
        {modoProgramado && fase === 'intro' && (
          <div>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Este examen dura <strong>{examenProgramado.duracionMin} minutos</strong> desde que lo inicies.
              Al comenzar se activará pantalla completa; salir de pantalla completa, cambiar de
              pestaña o minimizar la ventana queda registrado como una posible infracción.
            </p>
            {errorCarga && <p style={{ color: '#f87171', fontSize: '0.85rem' }}>{errorCarga}</p>}
            <div className="modal-actions">
              <button type="button" className="btn-action" onClick={cerrarModal}>
                Cancelar
              </button>
              <button type="button" className="btn-create" onClick={iniciarExamenProgramado} disabled={cargando}>
                {cargando ? 'Cargando...' : 'Comenzar examen (pantalla completa)'}
              </button>
            </div>
          </div>
        )}

        {(!modoProgramado || fase !== 'intro') && cargando && (
          <p style={{ color: '#94a3b8' }}>Cargando preguntas...</p>
        )}

        {!cargando && (!modoProgramado || fase !== 'intro') && preguntas.length === 0 && !finalizado && (
          <p style={{ color: '#94a3b8' }}>
            Todavía no hay preguntas registradas para esta semana.
          </p>
        )}

        {modoProgramado && fase === 'en-curso' && segundosRestantes !== null && (
          <div
            style={{
              position: 'sticky', top: 0, zIndex: 1, marginBottom: '10px', padding: '8px 12px',
              borderRadius: '10px', background: segundosRestantes <= 60 ? '#7f1d1d' : '#0f172a',
              border: `1px solid ${segundosRestantes <= 60 ? '#ef4444' : '#334155'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: 700 }}>
              🛡️ MODO EVALUACIÓN PROTEGIDO
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#f8fafc' }}>
              {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
            </span>
          </div>
        )}

        {!cargando && !finalizado && (!modoProgramado || fase === 'en-curso') && preguntas.map((p, idx) => (
          <div key={p.id} className="p-4 rounded-xl border border-slate-700/60 bg-slate-900/60 mb-4 shadow-lg">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <span className="text-xs font-extrabold text-slate-400">
                PREGUNTA {idx + 1} DE {preguntas.length}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
                {p.tipo === 'teoria' ? '📖 TEORÍA' : '🧮 EJERCICIO'}
              </span>
            </div>
            <div className="text-xs font-medium text-slate-100 mb-3 whitespace-pre-line leading-relaxed">
              {p.pregunta}
            </div>
            <div className="flex flex-col gap-2">
              {p.opciones.map((op) => {
                const estaSeleccionada = respuestas[p.id] === op.id;
                return (
                  <label
                    key={op.id}
                    onClick={() => elegirOpcion(p.id, op.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      estaSeleccionada
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 ring-2 ring-sky-500/60 shadow-md scale-[1.005]'
                        : 'bg-slate-950/80 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`pregunta-${p.id}`}
                      value={op.id}
                      checked={estaSeleccionada}
                      onChange={() => elegirOpcion(p.id, op.id)}
                      className="w-4 h-4 text-sky-500 bg-slate-900 border-slate-700 focus:ring-sky-400 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 leading-relaxed">
                      <strong className="font-extrabold text-sky-300 mr-1.5">{op.id.toUpperCase()})</strong>
                      {op.texto}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {!cargando && !finalizado && (!modoProgramado || fase === 'en-curso') && preguntas.length > 0 && (
          <div className="modal-actions">
            {!modoProgramado && (
              <button type="button" className="btn-action" onClick={onClose}>
                Cancelar
              </button>
            )}
            <button
              type="button"
              className="btn-create"
              disabled={!todasRespondidas}
              onClick={entregarExamen}
            >
              Entregar test
            </button>
          </div>
        )}

        {finalizado && resultado && (
          <div>
            <div
              style={{
                backgroundColor: resultado.aprobado ? '#052e1a' : '#2e0505',
                border: `1px solid ${resultado.aprobado ? '#16a34a' : '#ef4444'}`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#f8fafc' }}>
                Nota: {resultado.nota5} / 5.0 ({resultado.porcentaje}%)
              </div>
              <div style={{ color: resultado.aprobado ? '#4ade80' : '#f87171', fontWeight: '700', marginTop: '4px' }}>
                {resultado.aprobado ? 'Aprobado' : 'No aprobado'} — {resultado.correctas} de {resultado.total} correctas
              </div>
              {modoProgramado && infracciones.length > 0 && (
                <div style={{ color: '#fbbf24', fontSize: '0.75rem', marginTop: '8px' }}>
                  ⚠️ Se registraron {infracciones.length} posible(s) infracción(es) durante la prueba.
                </div>
              )}
            </div>

            {preguntas.map((p, idx) => {
              const esCorrecta = respuestas[p.id] === p.correcta;
              return (
                <div key={p.id} className="question-card" style={{ marginBottom: '12px' }}>
                  <div className="card-top">
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '800' }}>
                      PREGUNTA {idx + 1}
                    </span>
                    <span className="question-type" style={{ background: esCorrecta ? '#16a34a' : '#ef4444' }}>
                      {esCorrecta ? '✔ Correcta' : '✘ Incorrecta'}
                    </span>
                  </div>
                  <div className="question-body" style={{ whiteSpace: 'pre-line' }}>{p.pregunta}</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '8px' }}>
                    💡 <strong>Explicación:</strong> {p.explicacion}
                  </div>
                  {!esCorrecta && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                      📌 <strong>Concepto a reforzar:</strong> {p.falencia}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="modal-actions">
              <button type="button" className="btn-create" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
