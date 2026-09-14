import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useCourseStore } from '../store/useCourseStore';
import { evaluacionesService } from '../services/evaluaciones.service';
import { usuariosService } from '../services/usuarios.service';
import { estudiantesService } from '../services/estudiantes.service';
import { withAuth } from '../hocs/withAuth';
import { withRole } from '../hocs/withRole';
import { useAuth } from '../context/AuthContext';
import ExamenProgramadoModal from '../components/ExamenProgramadoModal';
import { formatearEnunciado, PRE_CLASS_IMPRESION } from '../utils/formatearEnunciado';

const ESTADO_ETIQUETA = {
  proximo: { texto: 'Próximo', color: '#38bdf8' },
  activo: { texto: 'Activo ahora', color: '#22c55e' },
  finalizado: { texto: 'Finalizado', color: '#94a3b8' },
  cancelado: { texto: 'Cancelado', color: '#ef4444' }
};

function formatearFecha(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('es-CO', {
    weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
  });
}


// Lista de respaldo oficial de 30 estudiantes de Álgebra Lineal (Grossman 2026 - Unicauca)
const ESTUDIANTES_FALLBACK = [
  { id: 101, codigo: '104726011638', nombre: 'BONILLA AYALA DIANA ISABELLA', email: 'dianaibonilla@unicauca.edu.co' },
  { id: 102, codigo: '100626011595', nombre: 'CAMPO CUARÁN CRISTIAN CAMILO', email: 'cristiancam@unicauca.edu.co' },
  { id: 103, codigo: '104724011626', nombre: 'CAMPO NARVAEZ MARIA JOSE', email: 'mariacn@unicauca.edu.co' },
  { id: 104, codigo: '104725021236', nombre: 'CAMPO ZAMBRANO JIMMY ALEJANDRO', email: 'jimmycampo@unicauca.edu.co' },
  { id: 105, codigo: '104726011616', nombre: 'CANDO LOPEZ YEIMI DANIELA', email: 'yeimicando@unicauca.edu.co' },
  { id: 106, codigo: '104725021216', nombre: 'CORREA MIRANDA DENIS SANTIAGO', email: 'deniscorrea@unicauca.edu.co' },
  { id: 107, codigo: '104723020735', nombre: 'CRUZ ERAZO DANIEL ALEJANDRO', email: 'danielce@unicauca.edu.co' },
  { id: 108, codigo: '104725021210', nombre: 'ESPINOSA BOLAÑOS IVAN SANTIAGO', email: 'ivanespinosa@unicauca.edu.co' },
  { id: 109, codigo: '104726011604', nombre: 'FERNÁNDEZ ZAMBRANO YOSETH DAVID', email: 'yoseth@unicauca.edu.co' },
  { id: 110, codigo: '104726011628', nombre: 'FULI LÓPEZ LEIDY ISABELLA', email: 'leidyfuli@unicauca.edu.co' },
  { id: 111, codigo: '104726011605', nombre: 'GARCÍA MORALES JOSE MANUEL', email: 'josemgarcia@unicauca.edu.co' },
  { id: 112, codigo: '100625021172', nombre: 'GUERRERO QUINTO JUAN SEBASTIAN', email: 'juansguerrero@unicauca.edu.co' },
  { id: 113, codigo: '104725021198', nombre: 'JIMENEZ ALZATE JUAN PABLO', email: 'juanja@unicauca.edu.co' },
  { id: 114, codigo: '104725021233', nombre: 'LÓPEZ MUÑOZ JUAN SEBASTIÁN', email: 'juanlopezmu@unicauca.edu.co' },
  { id: 115, codigo: '100626011558', nombre: 'MAMIAN LUNA LUIZA FERNANDA', email: 'luizamamian@unicauca.edu.co' },
  { id: 116, codigo: '104724011609', nombre: 'MANQUILLO JOSE FERNANDO', email: 'josemanquillo@unicauca.edu.co' },
  { id: 117, codigo: '104724021127', nombre: 'MANQUILLO LOPEZ ALEJANDRO', email: 'alejandromanquillo@unicauca.edu.co' },
  { id: 118, codigo: '104726011639', nombre: 'MENA OMEN ALEXANDER', email: 'alexandermena@unicauca.edu.co' },
  { id: 119, codigo: '104724011615', nombre: 'MUÑOZ DAZA YEFERSON', email: 'yefersonm@unicauca.edu.co' },
  { id: 120, codigo: '104724011647', nombre: 'MUÑOZ TORRES MARÍA JULIANA', email: 'mariajmunoz@unicauca.edu.co' },
  { id: 121, codigo: '104725011381', nombre: 'OPOCUE MEDINA JUAN ESTEBAN', email: 'juanopocue@unicauca.edu.co' },
  { id: 122, codigo: '104724011631', nombre: 'ORDOÑEZ HURTADO JUAN CAMILO', email: 'juanoh@unicauca.edu.co' },
  { id: 123, codigo: '100626011586', nombre: 'OROZCO ESPAÑA YEISON ANDRES', email: 'yeisonorozco@unicauca.edu.co' },
  { id: 124, codigo: '104725011382', nombre: 'PINZÓN GARZÓN VICTOR HUGO', email: 'victorpinzon@unicauca.edu.co' },
  { id: 125, codigo: '104725021202', nombre: 'PORRAS BETANCOURT PAULO ALEXANDRO', email: 'paulo@unicauca.edu.co' },
  { id: 126, codigo: '104725011385', nombre: 'REALPE CABRERA KEVIN JHOAN', email: 'kevinrealpe@unicauca.edu.co' },
  { id: 127, codigo: '104726011642', nombre: 'REYES RODRIGUEZ GABRIELA', email: 'gabrielareyes@unicauca.edu.co' },
  { id: 128, codigo: '104726011610', nombre: 'TORO VERGARA JUAN DAVID', email: 'juandtoro@unicauca.edu.co' },
  { id: 129, codigo: '104725011589', nombre: 'TOVAR VELASCO SANTIAGO', email: 'santiagotovar@unicauca.edu.co' },
  { id: 130, codigo: '104725011662', nombre: 'VELASCO MUÑOZ JUAN SEBASTIÁN', email: 'juansvelasco@unicauca.edu.co' }
];

const PLANTILLA_PREGUNTA_EJEMPLO = {
  num: 1,
  titulo: 'Semana 6: Propiedades de los Determinantes',
  ra: 'RA3.1-RA3.3',
  raDescripcion: 'Definiciones y propiedades de los determinantes, regla de Cramer, determinantes e inversas.',
  enunciado: 'Considere la matriz A de 3x3 con det(A) = 5. ¿Cuál es el valor de det(2A)?',
  opciones: [
    { id: 'a', texto: '10' },
    { id: 'b', texto: '40' },
    { id: 'c', texto: '25' },
    { id: 'd', texto: '5' }
  ],
  correcta: 'b',
  explicacion: 'Para una matriz A de n x n, det(c A) = c^n det(A). En este caso n=3 y c=2, por lo que det(2A) = 2^3 * 5 = 8 * 5 = 40.',
  falencia: 'No aplicar la propiedad c^n en el determinante de un escalar por una matriz n x n.'
};

export function EvaluacionQuicesViewBase({ defaultTab = 'calendario' }) {
  const navigate = useNavigate();
  const { usuario, esEstudiante } = useAuth();
  const themeMode = useCourseStore((state) => state.themeMode);
  const esLight = themeMode === 'light';

  const materiaActivaId = useCourseStore((state) => state.materiaActivaId) || 1;
  const materias = useCourseStore((state) => state.materias) || [];
  const setMateriaActiva = useCourseStore((state) => state.setMateriaActiva);

  const semanas = useCourseStore((state) => state.semanas);
  const examenesProgramados = useCourseStore((state) => state.examenesProgramados);
  const cargarExamenesMateriaFromService = useCourseStore((state) => state.cargarExamenesMateriaFromService);
  const eliminarExamenProgramado = useCourseStore((state) => state.eliminarExamenProgramado);

  const materiaSeleccionadaObj = useMemo(() => {
    return materias.find(m => m.id === Number(materiaActivaId)) || materias[0] || { id: 1, nombre: 'Álgebra Lineal 2026' };
  }, [materias, materiaActivaId]);

  // Navegación por pestañas: 'calendario' | 'calificar' | 'crear' | 'gestionar' | 'parciales' | 'historial'
  const [pestanaActiva, setPestanaActiva] = useState(esEstudiante ? 'historial' : defaultTab);

  useEffect(() => {
    if (esEstudiante && pestanaActiva !== 'historial') {
      setPestanaActiva('historial');
    }
  }, [esEstudiante, pestanaActiva]);

  const [quices, setQuices] = useState([]);
  const [estudiantes, setEstudiantes] = useState(ESTUDIANTES_FALLBACK);
  const [cargando, setCargando] = useState(true);

  // Estados del Modal de Examen Programado
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoPresetInicial, setModoPresetInicial] = useState('quiz');
  const [examenEditar, setExamenEditar] = useState(null);
  const [eliminando, setEliminando] = useState({});

  const examenesOrdenados = useMemo(
    () => [...examenesProgramados].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)),
    [examenesProgramados]
  );

  const abrirModalCreacion = (preset) => {
    setExamenEditar(null);
    setModoPresetInicial(preset);
    setModalAbierto(true);
  };

  const handleEliminarExamenProgramado = async (examen) => {
    const confirmacion = window.confirm(`¿Eliminar/cancelar la evaluación "${examen.titulo}"?`);
    if (!confirmacion) return;
    setEliminando((prev) => ({ ...prev, [examen.id]: true }));
    try {
      await eliminarExamenProgramado(examen.id);
    } catch (err) {
      window.alert(err?.response?.data?.mensaje || err?.response?.data?.message || 'Error al eliminar la evaluación');
    } finally {
      setEliminando((prev) => ({ ...prev, [examen.id]: false }));
    }
  };


  // Estados del Formulario de Calificación
  const [quizSeleccionadoId, setQuizSeleccionadoId] = useState('quiz1_s01_03');
  const [estudianteSeleccionadoId, setEstudianteSeleccionadoId] = useState('');
  const [estudianteManualNombre, setEstudianteManualNombre] = useState('');
  const [busquedaEstudiante, setBusquedaEstudiante] = useState('');
  const [tipoEvaluacion, setTipoEvaluacion] = useState('ordinario');
  const [respuestasDocente, setRespuestasDocente] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [resultadoEvaluacion, setResultadoEvaluacion] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // Estados del Formulario de Creación / Carga de Quiz
  const [nuevoQuizTitulo, setNuevoQuizTitulo] = useState('');
  const [nuevoQuizTipo, setNuevoQuizTipo] = useState('ordinario');
  const [nuevoQuizSemanaNumero, setNuevoQuizSemanaNumero] = useState('06-08');
  const [nuevoQuizSemanaId, setNuevoQuizSemanaId] = useState(6);
  const [nuevoQuizDescripcion, setNuevoQuizDescripcion] = useState('');
  const [preguntasNuevas, setPreguntasNuevas] = useState([{ ...PLANTILLA_PREGUNTA_EJEMPLO }]);
  const [guardandoQuiz, setGuardandoQuiz] = useState(false);
  const [mensajeQuizGlobal, setMensajeQuizGlobal] = useState('');

  // Estados del Generador Aleatorio desde BD
  const [cantPreguntasAleatorias, setCantPreguntasAleatorias] = useState(5);
  const [semanaIdAleatoria, setSemanaIdAleatoria] = useState(1);
  const [tituloAleatorio, setTituloAleatorio] = useState('');
  const [generandoAleatorio, setGenerandoAleatorio] = useState(false);

  // Estados de Parciales Adaptativos por RA (Exámenes Impresos por Estudiante)
  const [parcialTitulo, setParcialTitulo] = useState('Parcial de Recuperación Adaptativo por Objetivos de Aprendizaje (RA)');
  const [parcialCantPreguntas, setParcialCantPreguntas] = useState(5);
  const [parcialEstudiantesSeleccionados, setParcialEstudiantesSeleccionados] = useState([]);
  const [generandoParciales, setGenerandoParciales] = useState(false);
  const [parcialesResultado, setParcialesResultado] = useState(null);

  // Estados de Historial y Lista de Calificaciones
  const [historialIntentos, setHistorialIntentos] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [resumenReporte, setResumenReporte] = useState(null);
  const [busquedaHistorial, setBusquedaHistorial] = useState('');
  const [filtroEstadoHistorial, setFiltroEstadoHistorial] = useState('todos');

  // Modal de Edición de Calificación
  const [intentoEditarModal, setIntentoEditarModal] = useState(null);
  const [notaModalValue, setNotaModalValue] = useState('5.0');
  const [guardandoNotaEdit, setGuardandoNotaEdit] = useState(false);

  // Modal de Informe de Evaluación y Objetivos de Aprendizaje (RA)
  const [informeModal, setInformeModal] = useState(null);

  const construirInformeCompleto = (intento, estObj, quicesList = []) => {
    if (!intento) return null;

    const det = intento.detalle || {};
    const qFound = quicesList.find(
      (q) =>
        q.id === intento.quizId ||
        q.id === det.quizId ||
        (intento.tituloExamen || '').toLowerCase().includes(q.id) ||
        (q.titulo || '').toLowerCase().includes((intento.tituloExamen || '').toLowerCase())
    ) || quicesList[0] || { preguntas: [] };

    const respuestasSelec = det.respuestasSeleccionadas || [];

    let desgloses = det.desgloses || [];
    let fortalezas = det.fortalezas || [];
    let falencias = det.falencias || [];

    if ((!desgloses || desgloses.length === 0) && qFound?.preguntas?.length > 0) {
      desgloses = [];
      fortalezas = [];
      falencias = [];

      qFound.preguntas.forEach((p, idx) => {
        const respEst = (respuestasSelec[idx] || '').toLowerCase().trim();
        const correcta = String(p.correcta || '').toLowerCase().trim();
        const esCorrecta = respEst === correcta && !(intento.noPresento || det.noPresento);

        const respDisplay = (intento.noPresento || det.noPresento)
          ? 'No Presentó (N/R)'
          : respEst
          ? respEst.toUpperCase()
          : 'Sin respuesta (N/R)';

        desgloses.push({
          num: p.num,
          titulo: p.titulo,
          ra: p.ra,
          raDescripcion: p.raDescripcion,
          enunciado: p.enunciado,
          opciones: p.opciones,
          respuestaEstudiante: respDisplay,
          respuestaCorrecta: correcta.toUpperCase(),
          esCorrecta,
          explicacion: p.explicacion,
          falencia: p.falencia
        });

        if (esCorrecta) {
          fortalezas.push(`Demuestra dominio en ${p.titulo} (${p.ra}): ${p.raDescripcion || 'Comprensión precisa de conceptos y operaciones.'}`);
        } else {
          falencias.push({
            num: p.num,
            titulo: p.titulo,
            ra: p.ra,
            enunciado: p.enunciado,
            opciones: p.opciones,
            respuestaEstudiante: respDisplay,
            respuestaCorrecta: correcta.toUpperCase(),
            falencia: (intento.noPresento || det.noPresento)
              ? 'Evaluación no presentada / ausente.'
              : p.falencia || 'Dificultad en el procedimiento o aplicación conceptual.',
            explicacion: p.explicacion || 'Revisar la guía de aprendizaje correspondiente.'
          });
        }
      });
    }

    const totalPreguntas = desgloses.length || qFound.preguntas?.length || 5;
    const aciertos = desgloses.filter((d) => d.esCorrecta).length;

    return {
      intentoId: intento.id,
      estudianteNombre: estObj?.nombre || intento.estudianteNombre || 'Estudiante',
      estudianteCodigo: estObj?.codigo || intento.estudianteCodigo || '',
      quizTitulo: intento.tituloExamen || qFound.titulo || 'Evaluación de Álgebra Lineal',
      nota5: intento.nota5 !== undefined ? intento.nota5 : (intento.noPresento ? 0.0 : Number(((aciertos / totalPreguntas) * 5.0).toFixed(1))),
      porcentaje: intento.porcentaje !== undefined ? intento.porcentaje : (intento.noPresento ? 0 : Math.round((aciertos / totalPreguntas) * 100)),
      aprobado: intento.aprobado !== undefined ? intento.aprobado : (intento.nota5 >= 3.0),
      noPresento: intento.noPresento || det.noPresento || intento.tipoEvaluacion === 'no_presento',
      fecha: intento.fecha,
      aciertos,
      totalPreguntas,
      fortalezas,
      falencias,
      desgloses
    };
  };

  const handleAbrirInformeDetalle = (intento, estItem) => {
    if (!intento) return;
    const inf = construirInformeCompleto(intento, estItem, quices);
    setInformeModal(inf);
    setTimeout(() => {
      const el = document.getElementById('diagnostico-desplegable-ra');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const cargarHistorialCalificaciones = async () => {
    setCargandoHistorial(true);
    try {
      const data = await evaluacionesService.getReporteDocente();
      if (data) {
        setHistorialIntentos(data.intentos || []);
        setResumenReporte(data.resumenGrupov || null);
      }
    } catch (err) {
      console.error('Error cargando historial de calificaciones:', err);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleEliminarIntento = async (item) => {
    if (!window.confirm(`¿Estás seguro de eliminar el registro de calificación de "${item.estudianteNombre}"?`)) return;
    try {
      await evaluacionesService.eliminarIntento(item.id);
      cargarHistorialCalificaciones();
      alert('Registro de calificación eliminado exitosamente de la base de datos.');
    } catch (err) {
      console.error('Error eliminando intento:', err);
      alert('Error eliminando la calificación de la base de datos.');
    }
  };

  const handleAbrirEditarIntento = (item) => {
    setIntentoEditarModal(item);
    setNotaModalValue(String(item.nota5 !== undefined ? item.nota5 : '5.0'));
  };

  const handleGuardarEdicionNota = async () => {
    if (!intentoEditarModal) return;
    const n = Number(notaModalValue);
    if (isNaN(n) || n < 0 || n > 5.0) {
      alert('Por favor ingresa una nota válida entre 0.0 y 5.0');
      return;
    }

    setGuardandoNotaEdit(true);
    try {
      const porc = Math.round((n / 5.0) * 100);
      await evaluacionesService.editarIntento(intentoEditarModal.id, {
        nota5: n,
        porcentaje: porc,
        aprobado: n >= 3.0
      });
      setIntentoEditarModal(null);
      cargarHistorialCalificaciones();
      alert(`¡Calificación de ${intentoEditarModal.estudianteNombre} actualizada a ${n} / 5.0 en PostgreSQL!`);
    } catch (err) {
      console.error('Error actualizando nota:', err);
      alert('Error actualizando la nota en el servidor.');
    } finally {
      setGuardandoNotaEdit(false);
    }
  };

  useEffect(() => {
    if (pestanaActiva === 'historial') {
      cargarHistorialCalificaciones();
    }
  }, [pestanaActiva]);

  const estudiantesConsolidadosHistorial = useMemo(() => {
    if (!Array.isArray(estudiantes)) return [];

    let baseEstudiantes = estudiantes;
    if (esEstudiante && usuario) {
      baseEstudiantes = estudiantes.filter(
        (st) =>
          String(st.id) === String(usuario.id) ||
          (usuario.documentoIdentidad && String(st.codigo) === String(usuario.documentoIdentidad)) ||
          (st.email && (st.email || '').toLowerCase().trim() === (usuario.email || '').toLowerCase().trim()) ||
          (st.nombre && (st.nombre || '').toLowerCase().trim() === (usuario.nombre || '').toLowerCase().trim())
      );
      if (baseEstudiantes.length === 0) {
        baseEstudiantes = [{
          id: usuario.id,
          codigo: usuario.documentoIdentidad || `EST-${usuario.id}`,
          nombre: usuario.nombre,
          email: usuario.email
        }];
      }
    }

    const q1Id = quices[0]?.id;
    const q2Id = quices[1]?.id;

    return baseEstudiantes.map((st) => {
      const intentosEst = historialIntentos.filter(
        (h) =>
          (h.estudianteId && String(h.estudianteId) === String(st.id)) ||
          (h.estudianteCodigo && String(h.estudianteCodigo) === String(st.codigo)) ||
          (h.estudianteEmail && (h.estudianteEmail || '').toLowerCase().trim() === (st.email || '').toLowerCase().trim()) ||
          (h.estudianteNombre && (h.estudianteNombre || '').toLowerCase().trim() === (st.nombre || '').toLowerCase().trim())
      );

      const intentoQ1 = intentosEst.find(
        (i) => (q1Id && i.quizId === q1Id) || (i.tituloExamen || '').toLowerCase().includes('quiz 1') || (i.semanaNumero || '').includes('01') || (i.semanaNumero || '').includes('02')
      ) || intentosEst[0];

      const intentoQ2 = intentosEst.find(
        (i) => (q2Id && i.quizId === q2Id) || (i.tituloExamen || '').toLowerCase().includes('quiz 2') || (i.semanaNumero || '').includes('03') || (i.semanaNumero || '').includes('04') || (i.semanaNumero || '').includes('05')
      ) || (intentosEst.length > 1 && intentosEst[1] !== intentoQ1 ? intentosEst[1] : null);

      return {
        id: st.id,
        nombre: st.nombre,
        codigo: st.codigo,
        email: st.email,
        intentoQ1,
        intentoQ2,
        intentosEst,
        ultimaFecha: intentosEst[0]?.fecha || null
      };
    });
  }, [estudiantes, historialIntentos, quices, esEstudiante, usuario]);

  const historialFiltrado = useMemo(() => {
    return estudiantesConsolidadosHistorial.filter((item) => {
      const query = busquedaHistorial.toLowerCase().trim();
      const cumpleBusqueda =
        !query ||
        (item.nombre || '').toLowerCase().includes(query) ||
        (item.codigo || '').toLowerCase().includes(query) ||
        (item.email || '').toLowerCase().includes(query);

      const q1NP = item.intentoQ1?.noPresento || item.intentoQ1?.tipoEvaluacion === 'no_presento';
      const q2NP = item.intentoQ2?.noPresento || item.intentoQ2?.tipoEvaluacion === 'no_presento';

      const tieneQ1 = !!item.intentoQ1;
      const tieneQ2 = !!item.intentoQ2;

      const q1Aprob = item.intentoQ1?.aprobado && !q1NP;
      const q2Aprob = item.intentoQ2?.aprobado && !q2NP;

      const cumpleEstado =
        filtroEstadoHistorial === 'todos' ||
        (filtroEstadoHistorial === 'aprobado' && (q1Aprob || q2Aprob)) ||
        (filtroEstadoHistorial === 'reprobado' && ((tieneQ1 && !q1Aprob) || (tieneQ2 && !q2Aprob))) ||
        (filtroEstadoHistorial === 'no_presento' && (q1NP || q2NP));

      return cumpleBusqueda && cumpleEstado;
    });
  }, [estudiantesConsolidadosHistorial, busquedaHistorial, filtroEstadoHistorial]);

  const promedioNotasHistorial = useMemo(() => {
    if (historialIntentos.length === 0) return '0.0';
    const suma = historialIntentos.reduce((acc, i) => acc + (Number(i.nota5) || 0), 0);
    return (suma / historialIntentos.length).toFixed(1);
  }, [historialIntentos]);

  const quicesPorSemana = useMemo(() => {
    const con = {};
    (historialIntentos || []).forEach((i) => {
      const sem = i.semanaNumero || 'General';
      con[sem] = (con[sem] || 0) + 1;
    });
    return Object.entries(con).sort((a, b) => a[0].localeCompare(b[0]));
  }, [historialIntentos]);

  const estudiantesPendientesONoPresentaron = useMemo(() => {
    if (!Array.isArray(estudiantes)) return [];

    const result = estudiantes.map(st => {
      const intentosEst = historialIntentos.filter(
        h => String(h.estudianteId) === String(st.id) ||
             (h.estudianteNombre || '').toLowerCase().trim() === (st.nombre || '').toLowerCase().trim()
      );

      const intentoNP = intentosEst.find(i => i.noPresento || i.tipoEvaluacion === 'no_presento');
      const tieneIntentos = intentosEst.length > 0;

      let estadoCalculado = 'pendiente';
      if (intentoNP) {
        estadoCalculado = 'no_presento';
      } else if (tieneIntentos) {
        estadoCalculado = 'evaluado';
      }

      return {
        ...st,
        intentosCount: intentosEst.length,
        intentoNP,
        estadoCalculado
      };
    });

    const sinPresentar = result.filter(st => st.estadoCalculado !== 'evaluado');

    if (!busquedaHistorial.trim()) return sinPresentar;

    const q = busquedaHistorial.toLowerCase().trim();
    return sinPresentar.filter(st =>
      (st.nombre || '').toLowerCase().includes(q) ||
      (st.codigo && st.codigo.toLowerCase().includes(q)) ||
      (st.email && st.email.toLowerCase().includes(q))
    );
  }, [estudiantes, historialIntentos, busquedaHistorial]);

  const handleRegistrarNoPresentoRapido = async (st) => {
    if (!quizActivo) {
      alert('Por favor seleccione primero un quiz en la pestaña "Calificar Quices".');
      return;
    }
    const confirmacion = window.confirm(`¿Registrar inasistencia ("NO PRESENTÓ" - Nota 0.0) para "${st.nombre}" en la base de datos?`);
    if (!confirmacion) return;

    try {
      const respArray = (quizActivo.preguntas || []).map(() => 'np');
      const payload = {
        estudianteId: st.id,
        estudianteNombre: st.nombre,
        quizId: quizActivo.id,
        tipoEvaluacion: 'no_presento',
        noPresento: true,
        respuestas: respArray,
        materiaId: materiaActivaId
      };

      const res = await evaluacionesService.ingresarRespuestasManuales(payload);
      if (res && res.resultado) {
        alert(`¡Inasistencia ("No Presentó") registrada exitosamente para ${st.nombre}!`);
        cargarHistorialCalificaciones();
      }
    } catch (err) {
      console.error('Error registrando No Presentó rápido:', err);
      alert('Error registrando la inasistencia en el servidor.');
    }
  };

  const handleIrAEvaluarEstudiante = (st) => {
    setEstudianteSeleccionadoId(st.id);
    setEstudianteManualNombre(st.nombre);
    setBusquedaEstudiante(`[${st.codigo}] ${st.nombre}`);
    setRespuestasDocente({});
    setResultadoEvaluacion(null);
    setMensajeExito('');
    setPestanaActiva('calificar');
  };

  const handleGenerarParcialesAdaptativos = async () => {
    setGenerandoParciales(true);
    try {
      const payload = {
        materiaId: materiaActivaId,
        estudianteIds: parcialEstudiantesSeleccionados.length > 0 ? parcialEstudiantesSeleccionados : null,
        cantidadPreguntas: parcialCantPreguntas,
        tituloExamen: parcialTitulo
      };

      const res = await evaluacionesService.generarParcialesIndividualesRA(payload);
      if (res && res.status === 'ok') {
        setParcialesResultado(res);
        alert(`¡${res.examenesEstudiantes?.length || 0} parciales adaptativos generados con éxito! Haz clic en "Imprimir / Descargar PDF".`);
      }
    } catch (err) {
      console.error('Error generando parciales adaptativos:', err);
      alert('Error generando los parciales adaptativos desde la base de datos.');
    } finally {
      setGenerandoParciales(false);
    }
  };

  const handleGenerarQuizAleatorio = async () => {
    setGenerandoAleatorio(true);
    try {
      const semIdsDisponibles = (semanas && semanas.length > 0) ? semanas.map(s => s.id) : [1, 2, 3];
      let sIds = semIdsDisponibles.slice(0, 3);
      if (semanaIdAleatoria === 4) sIds = semIdsDisponibles.slice(2, 5);
      else if (semanaIdAleatoria === 6) sIds = semIdsDisponibles.slice(5, 8);
      else if (semanaIdAleatoria === 9) sIds = semIdsDisponibles.slice(8, 16);
      else if (semanaIdAleatoria === 100) sIds = semIdsDisponibles;

      const payload = {
        materiaId: materiaActivaId,
        semanaIds: sIds,
        cantidad: cantPreguntasAleatorias,
        titulo: tituloAleatorio.trim(),
        tipo: nuevoQuizTipo
      };

      const res = await evaluacionesService.generarQuizAleatorio(payload);
      if (res && res.status === 'ok') {
        const qData = await evaluacionesService.getQuicesAlgebra(materiaActivaId);
        if (Array.isArray(qData)) {
          setQuices(qData);
          if (res.quiz?.id) {
            setQuizSeleccionadoId(res.quiz.id);
          }
        }
        alert(`¡Quiz aleatorio "${res.quiz?.titulo || 'generado'}" creado exitosamente con ${res.quiz?.preguntas?.length || cantPreguntasAleatorias} preguntas al azar extraídas del banco de datos PostgreSQL!`);
        setPestanaActiva('calificar');
      }
    } catch (err) {
      console.error('Error generando quiz aleatorio:', err);
      alert('Error consultando el banco de preguntas en la base de datos.');
    } finally {
      setGenerandoAleatorio(false);
    }
  };

  // Cargar quices y estudiantes matriculados en la materia activa de PostgreSQL
  useEffect(() => {
    async function initData() {
      setCargando(true);
      setEstudianteSeleccionadoId('');
      setEstudianteManualNombre('');
      setBusquedaEstudiante('');
      setRespuestasDocente({});
      setResultadoEvaluacion(null);
      setMensajeExito('');
      try {
        if (materiaActivaId) {
          cargarExamenesMateriaFromService(materiaActivaId);
        }
        const [qData, estsMateria] = await Promise.all([
          evaluacionesService.getQuicesAlgebra(materiaActivaId),
          estudiantesService.getEstudiantes(materiaActivaId).catch(() => null)
        ]);


        if (Array.isArray(qData) && qData.length > 0) {
          setQuices(qData);
          if (!qData.some(q => q.id === quizSeleccionadoId)) {
            setQuizSeleccionadoId(qData[0].id);
            setTipoEvaluacion(qData[0].tipo || 'ordinario');
          }
        }

        if (Array.isArray(estsMateria) && estsMateria.length > 0) {
          setEstudiantes(estsMateria.map(u => ({
            id: u.id,
            codigo: u.documentoIdentidad || `EST-${u.id}`,
            nombre: u.nombre,
            email: u.email
          })));
        } else {
          // Fallback
          const uData = await usuariosService.getUsuarios().catch(() => []);
          if (Array.isArray(uData) && uData.length > 0) {
            const estsDB = uData.filter(u => u.rol === 'ESTUDIANTE' || u.documentoIdentidad);
            if (estsDB.length > 0) {
              setEstudiantes(estsDB.map(u => ({
                id: u.id,
                codigo: u.documentoIdentidad || `EST-${u.id}`,
                nombre: u.nombre,
                email: u.email
              })));
            }
          } else {
            setEstudiantes(ESTUDIANTES_FALLBACK);
          }
        }
      } catch (err) {
        console.error('Error cargando quices o estudiantes:', err);
      } finally {
        setCargando(false);
      }
    }

    initData();
  }, [materiaActivaId]);

  const quizActivo = useMemo(() => {
    const qFound = quices.find(q => q.id === quizSeleccionadoId) || quices[0];
    if (!qFound) return null;

    let preguntas = qFound.preguntas;
    if (typeof preguntas === 'string') {
      try {
        preguntas = JSON.parse(preguntas);
      } catch (e) {
        preguntas = [];
      }
    }
    if (!Array.isArray(preguntas)) preguntas = [];

    const preguntasNormalizadas = preguntas.map((p, idx) => {
      let opciones = p.opciones;
      if (typeof opciones === 'string') {
        try {
          opciones = JSON.parse(opciones);
        } catch (e) {
          opciones = [];
        }
      }
      if (!Array.isArray(opciones)) {
        opciones = [];
      }

      const idsPrefijo = ['a', 'b', 'c', 'd', 'e', 'f'];
      const opcionesNormalizadas = opciones.map((op, oIdx) => {
        if (typeof op === 'string') {
          return { id: idsPrefijo[oIdx] || `op_${oIdx}`, texto: op };
        }
        return {
          id: String(op.id || op.clave || idsPrefijo[oIdx] || oIdx).toLowerCase(),
          texto: String(op.texto || op.enunciado || op.label || '')
        };
      });

      return {
        ...p,
        num: p.num || idx + 1,
        titulo: p.titulo || `Pregunta ${idx + 1}`,
        ra: p.ra || 'RA1.1',
        raDescripcion: p.raDescripcion || '',
        enunciado: p.enunciado || '',
        correcta: String(p.correcta || 'a').toLowerCase(),
        explicacion: p.explicacion || '',
        falencia: p.falencia || '',
        opciones: opcionesNormalizadas
      };
    });

    return {
      ...qFound,
      tipo: qFound.tipo || (qFound.id.includes('rquiz') || qFound.id.includes('recuperac') ? 'recuperacion' : 'ordinario'),
      preguntas: preguntasNormalizadas
    };
  }, [quices, quizSeleccionadoId]);

  // Al cambiar de quiz, resetear tipo de evaluación acorde
  const handleCambiarQuiz = (qId) => {
    setQuizSeleccionadoId(qId);
    const qFound = quices.find(q => q.id === qId);
    if (qFound) {
      const esRecup = qFound.tipo === 'recuperacion' || qFound.id.includes('rquiz') || qFound.id.includes('recuperac');
      setTipoEvaluacion(esRecup ? 'recuperacion' : 'ordinario');
    }
    setRespuestasDocente({});
    setResultadoEvaluacion(null);
  };

  const estudiantesFiltrados = useMemo(() => {
    const q = (busquedaEstudiante || estudianteManualNombre || '').trim().toLowerCase();
    if (!q) return estudiantes;
    return estudiantes.filter(
      e => e.nombre.toLowerCase().includes(q) || (e.codigo && e.codigo.toLowerCase().includes(q))
    );
  }, [estudiantes, busquedaEstudiante, estudianteManualNombre]);


  const estudianteSeleccionadoObj = useMemo(() => {
    return estudiantes.find(e => String(e.id) === String(estudianteSeleccionadoId));
  }, [estudiantes, estudianteSeleccionadoId]);

  const handleSeleccionarRespuesta = (preguntaIdx, opcionId) => {
    setRespuestasDocente(prev => {
      // Si la opción ya estaba seleccionada, al hacer clic se desmarca para corregir errores
      if (prev[preguntaIdx] === opcionId) {
        const copia = { ...prev };
        delete copia[preguntaIdx];
        return copia;
      }
      return {
        ...prev,
        [preguntaIdx]: opcionId
      };
    });
  };

  const handleMarcarTodasSinRespuesta = () => {
    if (!quizActivo) return;
    const nrObj = {};
    quizActivo.preguntas.forEach((_, idx) => {
      nrObj[idx] = 'nr';
    });
    setRespuestasDocente(nrObj);
  };

  const handleMarcarTodasNoPresento = () => {
    if (!quizActivo) return;
    const npObj = {};
    quizActivo.preguntas.forEach((_, idx) => {
      npObj[idx] = 'np';
    });
    setRespuestasDocente(npObj);
    setTipoEvaluacion('no_presento');
  };

  const handleLimpiarRespuestas = () => {
    setRespuestasDocente({});
    setResultadoEvaluacion(null);
  };

  const handleLimpiarSeleccionEstudianteYCampos = () => {
    setEstudianteSeleccionadoId('');
    setEstudianteManualNombre('');
    setBusquedaEstudiante('');
    setRespuestasDocente({});
    setResultadoEvaluacion(null);
    setMensajeExito('');
    setMostrarSugerencias(false);
  };

  const respuestasCompletasCount = useMemo(() => {
    return Object.keys(respuestasDocente).length;
  }, [respuestasDocente]);

  const handleCalcularYEvaluar = async (e) => {
    e.preventDefault();
    if (!quizActivo) return;

    const nombreFinal = estudianteSeleccionadoObj
      ? estudianteSeleccionadoObj.nombre
      : estudianteManualNombre.trim() || 'Estudiante Evaluado';

    const respArray = quizActivo.preguntas.map((_, idx) => respuestasDocente[idx] || '');

    setProcesando(true);
    setMensajeExito('');

    try {
      const payload = {
        estudianteId: estudianteSeleccionadoObj ? estudianteSeleccionadoObj.id : 0,
        estudianteNombre: nombreFinal,
        quizId: quizActivo.id,
        tipoEvaluacion,
        respuestas: respArray,
        materiaId: materiaActivaId
      };

      const res = await evaluacionesService.ingresarRespuestasManuales(payload);
      if (res && res.resultado) {
        setResultadoEvaluacion(res.resultado);
        setMensajeExito(`Evaluación registrada correctamente para ${nombreFinal}.`);
        cargarHistorialCalificaciones();
      }
    } catch (err) {
      console.error('Error enviando respuestas:', err);
      // Fallback local
      let aciertos = 0;
      const desgloses = [];
      const fortalezasSet = new Set();
      const falenciasList = [];

      quizActivo.preguntas.forEach((p, idx) => {
        const respEst = (respuestasDocente[idx] || '').toLowerCase();
        const esCorrecta = respEst === p.correcta.toLowerCase();
        if (esCorrecta) {
          aciertos++;
          fortalezasSet.add(`${p.ra}: ${p.raDescripcion}`);
        } else {
          falenciasList.push({
            num: p.num,
            titulo: p.titulo,
            ra: p.ra,
            raDescripcion: p.raDescripcion,
            respuestaEstudiante: respEst.toUpperCase() || 'SIN RESPUESTA',
            respuestaCorrecta: p.correcta.toUpperCase(),
            explicacion: p.explicacion,
            falencia: p.falencia,
            recomendacion: `Reforzar la temática de ${p.titulo} (${p.ra}). Repasar notas de clase.`
          });
        }
        desgloses.push({
          num: p.num,
          titulo: p.titulo,
          ra: p.ra,
          respuestaEstudiante: respEst.toUpperCase() || 'N/A',
          respuestaCorrecta: p.correcta.toUpperCase(),
          esCorrecta
        });
      });

      const totalPreguntas = quizActivo.preguntas.length;
      const porcentaje = Math.round((aciertos / (totalPreguntas || 1)) * 100);
      const nota5 = Number(((aciertos / (totalPreguntas || 1)) * 5.0).toFixed(1));

      setResultadoEvaluacion({
        estudianteNombre: nombreFinal,
        quizTitulo: quizActivo.titulo,
        tipoEvaluacion,
        semanaNumero: quizActivo.semanaNumero,
        aciertos,
        totalPreguntas,
        porcentaje,
        nota5,
        aprobado: nota5 >= 3.0,
        fecha: new Date().toISOString(),
        desgloses,
        fortalezas: Array.from(fortalezasSet),
        falencias: falenciasList
      });
      setMensajeExito('Calificación procesada localmente.');
    } finally {
      setProcesando(false);
    }
  };

  const handleCopiarReporte = () => {
    if (!resultadoEvaluacion) return;
    const r = resultadoEvaluacion;
    let texto = `========================================================\n`;
    texto += `INFORME DE EVALUACIÓN POR OBJETIVOS DE APRENDIZAJE\n`;
    texto += `Universidad del Cauca — ${materiaSeleccionadaObj.nombre}\n`;
    texto += `========================================================\n`;
    texto += `Estudiante: ${r.estudianteNombre}\n`;
    texto += `Quiz: ${r.quizTitulo}\n`;
    texto += `Tipo de Evaluación: ${r.tipoEvaluacion?.toUpperCase()}\n`;
    texto += `Calificación: ${r.nota5} / 5.0 (${r.porcentaje}% de aciertos) — ${r.aprobado ? 'APROBADO' : 'REPROBADO / REQUIERE REFUERZO'}\n`;
    texto += `Aciertos: ${r.aciertos} de ${r.totalPreguntas} preguntas\n\n`;

    texto += `--- OBJETIVOS DE APRENDIZAJE LOGRADOS ---\n`;
    if (r.fortalezas.length > 0) {
      r.fortalezas.forEach(f => { texto += `✓ ${f}\n`; });
    } else {
      texto += `Ningún objetivo logrado completamente en esta oportunidad.\n`;
    }
    texto += `\n--- OBSERVACIONES Y RECOMENDACIONES DE REFUERZO ---\n`;
    if (r.falencias.length > 0) {
      r.falencias.forEach(f => {
        texto += `• Pregunta ${f.num} [${f.ra} - ${f.titulo}]:\n`;
        texto += `  - Respuesta Estudiante: ${f.respuestaEstudiante} | Respuesta Correcta: ${f.respuestaCorrecta}\n`;
        texto += `  - Falencia: ${f.falencia}\n`;
        texto += `  - Explicación: ${f.explicacion}\n`;
        texto += `  - Recomendación: ${f.recomendacion}\n\n`;
      });
    } else {
      texto += `¡Excelente desempeño! El estudiante ha respondido correctamente todas las preguntas.\n`;
    }

    navigator.clipboard.writeText(texto);
    alert('¡Reporte copiado al portapapeles en formato de texto!');
  };

  const handleImprimir = () => {
    window.print();
  };

  // --- LÓGICA DE CREACIÓN Y CARGA DE QUIZ POR EL DOCENTE ---
  const handleAgregarPreguntaNueva = () => {
    const numActual = preguntasNuevas.length + 1;
    setPreguntasNuevas(prev => [
      ...prev,
      {
        num: numActual,
        titulo: `Semana ${nuevoQuizSemanaId}: Nuevo Tema de Evaluación`,
        ra: `RA${nuevoQuizSemanaId}.1`,
        raDescripcion: 'Descripción del resultado de aprendizaje',
        enunciado: '',
        opciones: [
          { id: 'a', texto: '' },
          { id: 'b', texto: '' },
          { id: 'c', texto: '' },
          { id: 'd', texto: '' }
        ],
        correcta: 'a',
        explicacion: '',
        falencia: ''
      }
    ]);
  };

  const handleEliminarPreguntaNueva = (idx) => {
    if (preguntasNuevas.length <= 1) {
      alert('El quiz debe contener al menos 1 pregunta.');
      return;
    }
    setPreguntasNuevas(prev => {
      const filtradas = prev.filter((_, i) => i !== idx);
      return filtradas.map((p, i) => ({ ...p, num: i + 1 }));
    });
  };

  const handleCambiarCampoPregunta = (idx, campo, valor) => {
    setPreguntasNuevas(prev => {
      const copia = [...prev];
      copia[idx] = { ...copia[idx], [campo]: valor };
      return copia;
    });
  };

  const handleCambiarOpcionTexto = (qIdx, oIdx, texto) => {
    setPreguntasNuevas(prev => {
      const copia = [...prev];
      const opcionesCopia = [...copia[qIdx].opciones];
      opcionesCopia[oIdx] = { ...opcionesCopia[oIdx], texto };
      copia[qIdx] = { ...copia[qIdx], opciones: opcionesCopia };
      return copia;
    });
  };

  // Descargar Plantilla JSON de Ejemplo
  const handleDescargarPlantilla = () => {
    const plantilla = {
      titulo: 'Quiz 3 — Semanas 06 a 08 (Determinantes, Adjunta y Regla de Cramer)',
      tipo: 'ordinario',
      semanaNumero: '06-08',
      semanaId: 6,
      descripcion: 'Quiz oficial de prueba para evaluar la unidad de Determinantes y Regla de Cramer.',
      preguntas: [PLANTILLA_PREGUNTA_EJEMPLO]
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plantilla, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'plantilla_quiz_ejemplo.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Subir Archivo JSON de Quiz
  const handleSubirArchivoJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.titulo) setNuevoQuizTitulo(parsed.titulo);
        if (parsed.tipo) setNuevoQuizTipo(parsed.tipo);
        if (parsed.semanaNumero) setNuevoQuizSemanaNumero(parsed.semanaNumero);
        if (parsed.semanaId) setNuevoQuizSemanaId(Number(parsed.semanaId));
        if (parsed.descripcion) setNuevoQuizDescripcion(parsed.descripcion);
        if (Array.isArray(parsed.preguntas) && parsed.preguntas.length > 0) {
          setPreguntasNuevas(parsed.preguntas.map((p, idx) => ({
            num: idx + 1,
            titulo: p.titulo || `Pregunta ${idx + 1}`,
            ra: p.ra || `RA${parsed.semanaId || 1}.1`,
            raDescripcion: p.raDescripcion || '',
            enunciado: p.enunciado || '',
            opciones: Array.isArray(p.opciones) ? p.opciones : [
              { id: 'a', texto: '' }, { id: 'b', texto: '' }, { id: 'c', texto: '' }, { id: 'd', texto: '' }
            ],
            correcta: p.correcta || 'a',
            explicacion: p.explicacion || '',
            falencia: p.falencia || ''
          })));
        }
        setMensajeQuizGlobal('¡Archivo JSON cargado exitosamente! Revisa y presiona "Guardar y Publicar Quiz".');
      } catch (err) {
        alert('Error leyendo el archivo JSON. Asegúrate de que sea un JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  // Guardar Quiz en PostgreSQL mediante el backend
  const handleGuardarNuevoQuiz = async (e) => {
    e.preventDefault();
    if (!nuevoQuizTitulo.trim()) {
      alert('Ingresa el título del Quiz.');
      return;
    }

    if (preguntasNuevas.some(p => !p.enunciado.trim())) {
      alert('Todas las preguntas deben tener un enunciado.');
      return;
    }

    setGuardandoQuiz(true);
    setMensajeQuizGlobal('');

    try {
      const payload = {
        materiaId: materiaActivaId,
        titulo: nuevoQuizTitulo.trim(),
        tipo: nuevoQuizTipo,
        semanaNumero: nuevoQuizSemanaNumero.trim(),
        semanaId: Number(nuevoQuizSemanaId),
        descripcion: nuevoQuizDescripcion.trim(),
        preguntas: preguntasNuevas
      };

      const res = await evaluacionesService.crearQuiz(payload);
      if (res && res.status === 'ok') {
        const qData = await evaluacionesService.getQuicesAlgebra(materiaActivaId);
        if (Array.isArray(qData) && qData.length > 0) {
          setQuices(qData);
          if (res.quiz?.id) {
            setQuizSeleccionadoId(res.quiz.id);
          }
        }

        alert(`¡Quiz "${nuevoQuizTitulo}" guardado exitosamente en PostgreSQL!`);
        setPestanaActiva('calificar');

        // Limpiar formulario
        setNuevoQuizTitulo('');
        setNuevoQuizDescripcion('');
        setPreguntasNuevas([{ ...PLANTILLA_PREGUNTA_EJEMPLO }]);
      }
    } catch (err) {
      console.error('Error guardando quiz:', err);
      alert('Error guardando el quiz. Verifica la conexión con el servidor.');
    } finally {
      setGuardandoQuiz(false);
    }
  };

  const handleEliminarQuizCustom = async (qId, qTitulo) => {
    if (!window.confirm(`¿Estás seguro de eliminar el quiz "${qTitulo}"?`)) return;

    try {
      await evaluacionesService.eliminarQuiz(qId);
      const qData = await evaluacionesService.getQuicesAlgebra(materiaActivaId);
      if (Array.isArray(qData)) {
        setQuices(qData);
        if (quizSeleccionadoId === qId && qData.length > 0) {
          setQuizSeleccionadoId(qData[0].id);
        }
      }
      alert('Quiz eliminado exitosamente.');
    } catch (err) {
      console.error('Error eliminando quiz:', err);
      alert('Error eliminando el quiz.');
    }
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6 items-start">
      <Sidebar />

      <main className="flex-1 flex flex-col w-full overflow-y-auto gap-4">
        {/* HEADER PRINCIPAL DE LA SECCIÓN */}
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
                PARÁMETROS Y EVALUACIONES — [{materiaSeleccionadaObj.codigo || materiaSeleccionadaObj.nombre.toUpperCase()}]
              </div>
              <h1 className="text-xl font-extrabold leading-tight">
                Módulo Integrado de Gestión, Programación, Calificación y Parciales Adaptativos
              </h1>
            </div>
          </div>

          {/* Selector de Materia */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Materia:</span>
            <select
              value={materiaActivaId}
              onChange={(e) => setMateriaActiva(Number(e.target.value))}
              className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold outline-none ${
                esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
              }`}
            >
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.codigo} — {m.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS (TABS) */}
        <div className="flex flex-wrap gap-2 border-b border-slate-700/40 pb-2">
          {!esEstudiante && (
            <>
              <button
                onClick={() => setPestanaActiva('calendario')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  pestanaActiva === 'calendario'
                    ? 'bg-sky-600 text-white shadow-md'
                    : esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-base">calendar_month</span>
                <span>📅 Programación y Calendario ({examenesOrdenados.length})</span>
              </button>

              <button
                onClick={() => setPestanaActiva('calificar')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  pestanaActiva === 'calificar'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-base">how_to_reg</span>
                <span>📝 Calificar Quices (RA)</span>
              </button>

              <button
                onClick={() => setPestanaActiva('crear')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  pestanaActiva === 'crear'
                    ? 'bg-blue-600 text-white shadow-md'
                    : esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>⚡ Crear / Cargar Quiz por Semanas</span>
              </button>

              <button
                onClick={() => setPestanaActiva('gestionar')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                  pestanaActiva === 'gestionar'
                    ? 'bg-amber-600 text-white shadow-md'
                    : esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-base">quiz</span>
                <span>📚 Catálogo de Quices ({quices.length})</span>
              </button>
            </>
          )}

          <button
            onClick={() => setPestanaActiva('historial')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              pestanaActiva === 'historial'
                ? 'bg-cyan-600 text-white shadow-md'
                : esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-base">assessment</span>
            <span>{esEstudiante ? '📊 Mis Calificaciones de Quices' : `📊 Lista de Calificaciones (${historialIntentos.length > 0 ? historialIntentos.length : 'BD'})`}</span>
          </button>

          {!esEstudiante && (
            <button
              onClick={() => setPestanaActiva('parciales')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                pestanaActiva === 'parciales'
                  ? 'bg-purple-600 text-white shadow-md'
                  : esLight ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>📄 Parciales Adaptativos por RA (PDF)</span>
            </button>
          )}
        </div>

        {/* PESTAÑA: HISTORIAL Y LISTA DE CALIFICACIONES DE ESTUDIANTES */}
        {pestanaActiva === 'historial' && (
          <div className={`p-5 rounded-xl border flex flex-col gap-5 ${
            esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3 border-slate-500/20">
              <div>
                <h2 className="text-base font-black flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-500">analytics</span>
                  <span>{esEstudiante ? 'Mi Registro de Calificaciones' : 'Lista y Registro General de Calificaciones'}</span>
                </h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {esEstudiante
                    ? 'Consulta tus notas oficiales de quices, tu progreso y el diagnóstico por Objetivos de Aprendizaje (RA).'
                    : 'Consulte las notas, porcentajes y desempeño por estudiante registrados en la base de datos PostgreSQL.'}
                </p>
              </div>

              <button
                onClick={cargarHistorialCalificaciones}
                disabled={cargandoHistorial}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                <span>{cargandoHistorial ? 'Cargando...' : 'Actualizar Notas'}</span>
              </button>
            </div>

            {/* TARJETAS RESUMEN DE RENDIMIENTO GRUPAL (SOLO DOCENTE / SUPERUSUARIO) */}
            {!esEstudiante && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl border bg-slate-800/40 border-slate-700 flex flex-col justify-center">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Evaluaciones Registradas</span>
                  <span className="text-2xl font-black text-sky-400 my-1">{historialIntentos.length}</span>
                  <span className="text-xs text-slate-400 font-medium">Intentos presentados</span>
                </div>

                <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 flex flex-col justify-center">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Tasa de Aprobación</span>
                  <span className="text-2xl font-black text-emerald-400 my-1">
                    {resumenReporte?.tasaAprobacion || '0%'}
                  </span>
                  <span className="text-xs text-emerald-300 font-medium">
                    {resumenReporte?.aprobadosCount || 0} estudiantes aprobaron (≥ 3.0)
                  </span>
                </div>

                <div className="p-4 rounded-xl border bg-slate-800/40 border-slate-700 flex flex-col justify-center">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Promedio Grupal</span>
                  <span className="text-2xl font-black text-amber-400 my-1">{promedioNotasHistorial} / 5.0</span>
                  <span className="text-xs text-slate-400 font-medium">Promedio general de notas</span>
                </div>

                <div className="p-4 rounded-xl border bg-purple-500/10 border-purple-500/30 flex flex-col justify-center">
                  <span className="text-[10px] font-mono font-bold text-purple-300 uppercase">Supervisión e Infracciones</span>
                  <span className="text-2xl font-black text-purple-300 my-1">
                    {resumenReporte?.infraccionesCount || 0}
                  </span>
                  <span className="text-xs text-purple-400 font-medium">Alertas de salida de pantalla</span>
                </div>
              </div>
            )}

            {/* TARJETAS RESUMEN DE RENDIMIENTO PERSONAL (SOLO ESTUDIANTE) */}
            {esEstudiante && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. INGRESOS A LA CUENTA PERSONAL */}
                <div className="p-4 rounded-xl border bg-sky-500/10 border-sky-500/30 flex flex-col justify-center">
                  <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">login</span>
                    <span>Ingresos a Cuenta Personal</span>
                  </span>
                  <span className="text-3xl font-black text-sky-400 my-1">
                    {resumenReporte?.totalIngresos || usuario?.totalIngresos || 1} accesos
                  </span>
                  <span className="text-xs text-sky-300 font-medium">
                    Inicios de sesión registrados en la plataforma
                  </span>
                </div>

                {/* 2. QUICES VIRTUALES PRESENTADOS POR SEMANA */}
                <div className="p-4 rounded-xl border bg-purple-500/10 border-purple-500/30 flex flex-col justify-center">
                  <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">quiz</span>
                    <span>Quices Virtuales por Semana</span>
                  </span>
                  <span className="text-3xl font-black text-purple-300 my-1">
                    {historialIntentos.length} {historialIntentos.length === 1 ? 'Quiz' : 'Quices'}
                  </span>
                  <div className="text-[11px] font-mono text-purple-200 flex flex-wrap gap-1 mt-1">
                    {quicesPorSemana.length > 0 ? (
                      quicesPorSemana.map(([sem, cant]) => (
                        <span key={sem} className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 font-bold">
                          Sem {sem}: {cant} {cant === 1 ? 'quiz' : 'quices'}
                        </span>
                      ))
                    ) : (
                      <span className="italic opacity-70">Sin quices virtuales registrados</span>
                    )}
                  </div>
                </div>

                {/* 3. PROMEDIO DE NOTAS ACUMULADO */}
                <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30 flex flex-col justify-center">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">grade</span>
                    <span>Promedio Personal de Quices</span>
                  </span>
                  <span className="text-3xl font-black text-emerald-400 my-1">
                    {promedioNotasHistorial} / 5.0
                  </span>
                  <span className="text-xs text-emerald-300 font-medium">
                    Promedio acumulado de evaluaciones
                  </span>
                </div>
              </div>
            )}

            {/* BARRA DE BÚSQUEDA Y FILTRO (SOLO DOCENTE / SUPERUSUARIO) */}
            {!esEstudiante && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                <div className="w-full sm:w-72 relative">
                  <input
                    type="text"
                    placeholder="Buscar estudiante o examen..."
                    value={busquedaHistorial}
                    onChange={(e) => setBusquedaHistorial(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-lg text-xs border outline-none font-bold ${
                      esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs font-bold text-slate-400">Filtrar Estado:</span>
                  <select
                    value={filtroEstadoHistorial}
                    onChange={(e) => setFiltroEstadoHistorial(e.target.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs border outline-none font-bold ${
                      esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="todos">Todos ({historialIntentos.length})</option>
                    <option value="aprobado">Solo Aprobados (≥ 3.0)</option>
                    <option value="reprobado">Solo Reprobados (&lt; 3.0)</option>
                    <option value="no_presento">Solo No Presentó (NP)</option>
                  </select>
                </div>
              </div>
            )}

            {/* TABLA DE CALIFICACIONES DE ESTUDIANTES */}
            {cargandoHistorial ? (
              <div className="p-8 text-center text-xs text-slate-400 font-bold">
                Cargando lista de calificaciones desde PostgreSQL...
              </div>
            ) : historialFiltrado.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-medium border rounded-xl border-dashed border-slate-700">
                No se encontraron calificaciones registradas con el filtro seleccionado.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-700/60 shadow">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b font-extrabold uppercase text-[10px] tracking-wider ${
                      esLight ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      <th className="p-3 text-center font-mono w-10">#</th>
                      <th className="p-3">Estudiante</th>
                      <th className="p-3 font-mono">Código</th>
                      <th className="p-3 text-center">Quiz 1 (1ra Nota)</th>
                      <th className="p-3 text-center">Quiz 2 (2da Nota)</th>
                      <th className="p-3 text-center">Diagnóstico RA / Informe</th>
                      <th className="p-3 font-mono text-center">Último Registro</th>
                      {!esEstudiante && <th className="p-3 text-center">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40">
                    {historialFiltrado.map((item, idx) => {
                      const q1 = item.intentoQ1;
                      const q2 = item.intentoQ2;

                      const q1NP = q1?.noPresento || q1?.tipoEvaluacion === 'no_presento';
                      const q2NP = q2?.noPresento || q2?.tipoEvaluacion === 'no_presento';

                      return (
                        <tr key={item.id || idx} className={`transition-all ${
                          esLight ? 'hover:bg-slate-50 text-slate-800' : 'hover:bg-slate-800/40 text-slate-200'
                        }`}>
                          <td className="p-3 text-center font-mono font-extrabold text-sky-400">{idx + 1}</td>
                          <td className="p-3 font-extrabold">
                            <span className="block text-sky-400">{item.nombre}</span>
                            <span className="text-[10px] font-mono text-slate-400">{item.email}</span>
                          </td>
                          <td className="p-3 font-mono text-xs font-bold">{item.codigo}</td>

                          {/* ── QUIZ 1 (PRIMERA CALIFICACIÓN) ────────── */}
                          <td className="p-3 text-center">
                            {q1 ? (
                              <div className="flex items-center justify-center gap-1">
                                <span
                                  onClick={() => handleAbrirInformeDetalle(q1, item)}
                                  className={`inline-block px-2.5 py-0.5 rounded-lg font-mono font-black text-xs border cursor-pointer hover:scale-105 transition-all ${
                                    q1NP
                                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                                      : q1.aprobado
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                                  }`}
                                  title="Haz clic para ver diagnóstico de RA y comparación con el Quiz"
                                >
                                  {q1NP ? '0.0 (NP)' : q1.nota5}
                                </span>
                                {!esEstudiante && (
                                  <button
                                    type="button"
                                    onClick={() => handleAbrirEditarIntento(q1)}
                                    className="p-0.5 text-slate-400 hover:text-sky-400 text-xs cursor-pointer"
                                    title="Editar Quiz 1"
                                  >
                                    <span className="material-symbols-outlined text-xs">edit</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 font-mono text-xs italic">—</span>
                            )}
                          </td>

                          {/* ── QUIZ 2 (SEGUNDA CALIFICACIÓN) ────────── */}
                          <td className="p-3 text-center">
                            {q2 ? (
                              <div className="flex items-center justify-center gap-1">
                                <span
                                  onClick={() => handleAbrirInformeDetalle(q2, item)}
                                  className={`inline-block px-2.5 py-0.5 rounded-lg font-mono font-black text-xs border cursor-pointer hover:scale-105 transition-all ${
                                    q2NP
                                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                                      : q2.aprobado
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500/30'
                                  }`}
                                  title="Haz clic para ver diagnóstico de RA y comparación con el Quiz"
                                >
                                  {q2NP ? '0.0 (NP)' : q2.nota5}
                                </span>
                                {!esEstudiante && (
                                  <button
                                    type="button"
                                    onClick={() => handleAbrirEditarIntento(q2)}
                                    className="p-0.5 text-slate-400 hover:text-sky-400 text-xs cursor-pointer"
                                    title="Editar Quiz 2"
                                  >
                                    <span className="material-symbols-outlined text-xs">edit</span>
                                  </button>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-500 font-mono text-xs italic">—</span>
                            )}
                          </td>

                          {/* ── DIAGNÓSTICO RA / INFORME ────────── */}
                          <td className="p-3 text-center">
                            {q1 || q2 ? (
                              <button
                                type="button"
                                onClick={() => handleAbrirInformeDetalle(q1 || q2, item)}
                                className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1 cursor-pointer shadow-sm mx-auto transition-all"
                                title="Ver resultado, comparación con el quiz y observaciones por Objetivos de Aprendizaje (RA)"
                              >
                                <span className="material-symbols-outlined text-xs">analytics</span>
                                <span>Ver Diagnóstico RA</span>
                              </button>
                            ) : (
                              <span className="text-slate-500 font-mono text-xs italic">Pendiente</span>
                            )}
                          </td>

                          {/* ── ÚLTIMA FECHA DE REGISTRO ────────── */}
                          <td className="p-3 text-center font-mono text-[11px] text-slate-400">
                            {item.ultimaFecha ? formatearFecha(item.ultimaFecha) : 'Sin evaluaciones'}
                          </td>

                          {/* ── ACCIONES (SOLO VISIBLE PARA DOCENTE / SUPERUSUARIO) ────────── */}
                          {!esEstudiante && (
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleIrAEvaluarEstudiante(item)}
                                  className="px-2 py-1 rounded text-[11px] font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1 cursor-pointer shadow-xs"
                                  title="Evaluar a este estudiante"
                                >
                                  <span className="material-symbols-outlined text-xs">edit_note</span>
                                  <span>Evaluar</span>
                                </button>
                                {q1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleEliminarIntento(q1)}
                                    className="px-1.5 py-1 rounded text-[11px] font-bold border border-red-500/30 text-red-400 hover:bg-red-500/20 cursor-pointer"
                                    title="Eliminar registro Q1"
                                  >
                                    <span className="material-symbols-outlined text-xs">delete</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* PANEL DE DIAGNÓSTICO DESPLEGADO DIRECTAMENTE HACIA ABAJO DE LA TABLA */}
            {informeModal && (
              <div id="diagnostico-desplegable-ra" className={`mt-4 p-5 rounded-2xl border flex flex-col gap-4 shadow-xl animate-fadeIn scroll-mt-6 ${
                esLight ? 'bg-slate-50 border-sky-300 text-slate-900' : 'bg-slate-950 border-sky-500/40 text-white'
              }`}>
                {/* Encabezado del Diagnóstico Desplegado */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3 border-slate-500/20">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
                      DIAGNÓSTICO AUTOMÁTICO DE DESEMPEÑO Y RESULTADOS DE APRENDIZAJE (RA)
                    </span>
                    <h3 className="text-xl font-black">{informeModal.estudianteNombre}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{informeModal.quizTitulo}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const texto = `INFORME DE EVALUACIÓN: ${informeModal.quizTitulo}\nEstudiante: ${informeModal.estudianteNombre}\nNota: ${informeModal.nota5}/5.0 (${informeModal.porcentaje}%)\nFortalezas: ${informeModal.fortalezas.join('; ')}\nFalencias: ${informeModal.falencias.map(f => `[${f.ra}] ${f.falencia}`).join('; ')}`;
                        navigator.clipboard.writeText(texto);
                        alert('¡Informe copiado al portapapeles!');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold border border-slate-700 flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      <span>Copiar Informe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">print</span>
                      <span>Imprimir</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setInformeModal(null)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600/30 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all"
                      title="Ocultar diagnóstico desplegado"
                    >
                      <span className="material-symbols-outlined text-sm">expand_less</span>
                      <span>Ocultar Diagnóstico ↑</span>
                    </button>
                  </div>
                </div>

                {/* Tarjetas Resumen de Nota */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={`p-4 rounded-xl border text-center flex flex-col justify-center ${
                    informeModal.noPresento
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : informeModal.aprobado
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    <span className="text-[10px] font-mono font-bold uppercase">Calificación Final (0 - 5.0)</span>
                    <span className="text-3xl font-black my-1">
                      {informeModal.noPresento ? '0.0 (NP)' : informeModal.nota5}
                    </span>
                    <span className="text-xs font-extrabold">
                      {informeModal.noPresento
                        ? '❌ NO PRESENTÓ'
                        : informeModal.aprobado
                        ? '¡APROBADO!'
                        : 'REQUIERE REFUERZO'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border bg-slate-800/40 border-slate-700 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Porcentaje de Aciertos</span>
                    <span className="text-3xl font-black text-sky-400 my-1">{informeModal.porcentaje}%</span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {informeModal.aciertos} de {informeModal.totalPreguntas} aciertos
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border bg-slate-800/40 border-slate-700 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Fecha de Registro</span>
                    <span className="text-xs font-black text-slate-200 my-1">
                      {informeModal.fecha ? formatearFecha(informeModal.fecha) : 'Reciente'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID #{informeModal.intentoId || 'BD'}
                    </span>
                  </div>
                </div>

                {/* SECCIÓN 1: FORTALEZAS Y OBJETIVOS DE APRENDIZAJE ALCANZADOS */}
                <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
                  <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>Fortalezas y Objetivos de Aprendizaje Alcanzados</span>
                  </h4>
                  {informeModal.fortalezas.length > 0 ? (
                    <ul className="flex flex-col gap-1.5">
                      {informeModal.fortalezas.map((f, i) => (
                        <li key={i} className="text-xs text-slate-300 font-medium flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No se registraron aciertos en esta evaluación.</p>
                  )}
                </div>

                {/* SECCIÓN 2: FALENCIAS IDENTIFICADAS Y RECOMENDACIONES PEDAGÓGICAS */}
                {informeModal.falencias.length > 0 && (
                  <div className="p-4 rounded-xl border bg-rose-500/5 border-rose-500/20 flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">warning</span>
                      <span>Falencias Identificadas y Recomendaciones Pedagógicas ({informeModal.falencias.length})</span>
                    </h4>

                    <div className="flex flex-col gap-3">
                      {informeModal.falencias.map((f, i) => (
                        <div key={i} className="p-3.5 rounded-xl border border-rose-500/20 bg-slate-900/60 flex flex-col gap-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-rose-300">
                              Pregunta {f.num} — {f.titulo}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                              {f.ra}
                            </span>
                          </div>

                          {f.enunciado && (
                            <p className="text-xs text-slate-300 italic font-mono bg-slate-950/80 p-2 rounded border border-slate-800">
                              "{f.enunciado}"
                            </p>
                          )}

                          <div className="text-xs font-mono text-slate-300">
                            Respuesta del Estudiante: <span className="text-rose-400 font-bold">{f.respuestaEstudiante}</span> | Respuesta Correcta: <span className="text-emerald-400 font-bold">{f.respuestaCorrecta}</span>
                          </div>

                          <p className="text-xs text-slate-400 font-medium">
                            <strong className="text-slate-200">Observación / Falencia:</strong> {f.falencia}
                          </p>

                          {f.explicacion && (
                            <div className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                              <strong className="text-sky-400 block mb-0.5">💡 Explicación Paso a Paso:</strong>
                              <span>{f.explicacion}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECCIÓN 3: COMPARACIÓN COMPLETA PREGUNTA A PREGUNTA CON EL QUIZ */}
                {informeModal.desgloses.length > 0 && (
                  <div className="p-4 rounded-xl border bg-slate-900/80 border-slate-800 flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold text-sky-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">fact_check</span>
                      <span>Comparación Completa de Respuestas con el Quiz ({informeModal.desgloses.length} Preguntas)</span>
                    </h4>

                    <div className="flex flex-col gap-3">
                      {informeModal.desgloses.map((d, i) => (
                        <div
                          key={i}
                          className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                            d.esCorrecta
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : 'bg-rose-500/5 border-rose-500/20'
                          }`}
                        >
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold flex items-center gap-1.5">
                              {d.esCorrecta ? (
                                <span className="text-emerald-400 font-extrabold">✓ Pregunta {d.num}</span>
                              ) : (
                                <span className="text-rose-400 font-extrabold">✕ Pregunta {d.num}</span>
                              )}
                              <span>— {d.titulo}</span>
                            </span>
                            <span className="font-mono text-[10px] text-sky-300 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30">
                              {d.ra}
                            </span>
                          </div>

                          {d.enunciado && (
                            <p className="text-xs text-slate-300 font-medium">
                              {d.enunciado}
                            </p>
                          )}

                          {/* Opciones */}
                          {Array.isArray(d.opciones) && d.opciones.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 my-1">
                              {d.opciones.map((op) => {
                                const esOpcionEstudiante = (d.respuestaEstudiante || '').toLowerCase() === op.id.toLowerCase();
                                const esOpcionCorrecta = (d.respuestaCorrecta || '').toLowerCase() === op.id.toLowerCase();

                                let estiloOp = 'bg-slate-900/60 border-slate-800 text-slate-400';
                                if (esOpcionCorrecta) {
                                  estiloOp = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold';
                                } else if (esOpcionEstudiante && !d.esCorrecta) {
                                  estiloOp = 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold';
                                }

                                return (
                                  <div key={op.id} className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${estiloOp}`}>
                                    <span className="font-mono font-black uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-700">
                                      {op.id}
                                    </span>
                                    <span>{op.texto}</span>
                                    {esOpcionCorrecta && <span className="text-emerald-400 text-[10px] font-bold ml-auto">(Correcta)</span>}
                                    {esOpcionEstudiante && !esOpcionCorrecta && <span className="text-rose-400 text-[10px] font-bold ml-auto">(Tu Respuesta)</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {d.explicacion && (
                            <div className="text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                              <strong className="text-sky-400">💡 Explicación del ejercicio:</strong> {d.explicacion}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECCIÓN ABAJO: ESTUDIANTES PENDIENTES O QUE NO PRESENTARON EVALUACIÓN */}
            {!esEstudiante && (
              <div className="mt-4 pt-4 border-t border-slate-700/40 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="text-sm font-black text-rose-400 flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-500">person_off</span>
                      <span>Estudiantes Ausentes o Pendientes de Evaluación ({estudiantesPendientesONoPresentaron.length})</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Estudiantes de <strong className="text-slate-200">{materiaSeleccionadaObj.nombre}</strong> que no se presentaron o no tienen evaluación registrada.
                    </p>
                  </div>

                  <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30">
                    {quizActivo ? `Quiz Activo: ${quizActivo.titulo}` : 'Seleccione un Quiz para acciones rápidas'}
                  </span>
                </div>

                {estudiantesPendientesONoPresentaron.length === 0 ? (
                  <div className="p-4 text-center text-xs text-emerald-400 font-bold border rounded-xl border-emerald-500/30 bg-emerald-500/10">
                    ✓ Todos los estudiantes matriculados han presentado sus evaluaciones.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-rose-500/30 shadow-md">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className={`border-b font-extrabold uppercase text-[10px] tracking-wider ${
                          esLight ? 'bg-rose-50 text-rose-900 border-rose-200' : 'bg-rose-950/60 text-rose-300 border-rose-900/60'
                        }`}>
                          <th className="p-3">Código</th>
                          <th className="p-3">Estudiante Matriculado</th>
                          <th className="p-3">Correo Institucional</th>
                          <th className="p-3 text-center">Estado Registrado</th>
                          <th className="p-3 text-center">Acciones Rápidas</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/40">
                        {estudiantesPendientesONoPresentaron.map((st) => (
                          <tr key={st.id} className={`transition-all ${
                            esLight ? 'hover:bg-rose-50/40 text-slate-800' : 'hover:bg-slate-800/40 text-slate-200'
                          }`}>
                            <td className="p-3 font-mono font-bold text-sky-400">{st.codigo}</td>
                            <td className="p-3 font-extrabold">{st.nombre}</td>
                            <td className="p-3 font-mono text-[11px] text-slate-400">{st.email || 'N/A'}</td>
                            <td className="p-3 text-center">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${
                                st.estadoCalculado === 'no_presento'
                                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              }`}>
                                {st.estadoCalculado === 'no_presento' ? '❌ NO PRESENTÓ (NP)' : '⏳ PENDIENTE'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleIrAEvaluarEstudiante(st)}
                                  className="px-2.5 py-1 rounded text-[11px] font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1 cursor-pointer shadow-sm"
                                  title="Abrir formulario para evaluar a este estudiante"
                                >
                                  <span className="material-symbols-outlined text-xs">edit_note</span>
                                  <span>Calificar</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleRegistrarNoPresentoRapido(st)}
                                  className="px-2.5 py-1 rounded text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1 cursor-pointer shadow-sm"
                                  title="Registrar inmediatamente como No Presentó (Nota 0.0)"
                                >
                                  <span className="material-symbols-outlined text-xs">block</span>
                                  <span>Marcar NP</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}
        {pestanaActiva === 'calendario' && (
          <div className="flex flex-col gap-4">
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
              esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-sm'
            }`}>
              <div>
                <h2 className="text-sm font-black flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-500">calendar_month</span>
                  <span>Programación y Fechas de Evaluaciones Oficiales</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gestiona las fechas activas y límites de disponibilidad para Quices y Parciales en el sistema.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => abrirModalCreacion('quiz')}
                  className="px-3.5 py-2 rounded-xl bg-sky-500/20 text-[#38bdf8] border border-sky-500/40 font-extrabold text-xs hover:bg-sky-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-base">bolt</span>
                  <span>+ Programar Quiz</span>
                </button>

                <button
                  onClick={() => abrirModalCreacion('parcial')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold text-xs hover:bg-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-base">description</span>
                  <span>+ Programar Parcial</span>
                </button>
              </div>
            </div>

            {/* AGENDA DE EXÁMENES Y QUICES */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
              {examenesOrdenados.length === 0 && (
                <div className={`p-8 text-center font-mono text-xs rounded-2xl border ${
                  esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/80 border-slate-700 text-slate-300'
                }`}>
                  <span className="material-symbols-outlined text-4xl block mb-2 text-sky-400">event_busy</span>
                  No hay quices o parciales programados actualmente para esta materia.
                  <div className="mt-3 flex justify-center gap-2">
                    <button
                      onClick={() => abrirModalCreacion('quiz')}
                      className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-[#38bdf8] border border-sky-500/40 font-bold text-xs cursor-pointer"
                    >
                      ⚡ Crear primer Quiz
                    </button>
                    <button
                      onClick={() => abrirModalCreacion('parcial')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs cursor-pointer"
                    >
                      📝 Crear primer Parcial
                    </button>
                  </div>
                </div>
              )}

              {examenesOrdenados.map((ex) => {
                const estado = ESTADO_ETIQUETA[ex.estadoCalculado] || ESTADO_ETIQUETA.proximo;
                const tLow = (ex.titulo || '').toLowerCase();
                const esParcial = tLow.includes('parcial') || tLow.includes('examen final');
                const esRecuperacion = tLow.includes('recuperac') || tLow.includes('rquiz');

                return (
                  <div
                    key={ex.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                      esLight ? 'bg-white border-slate-300 shadow-sm hover:border-slate-400' : 'bg-slate-900/60 border-slate-800 shadow-sm hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {/* Badge Tipo Evaluacion */}
                        {esParcial ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            📝 PARCIAL
                          </span>
                        ) : esRecuperacion ? (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 border border-orange-500/40">
                            🔄 RECUPERACIÓN / RQUIZ
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-sky-500/20 text-[#38bdf8] border border-sky-500/40">
                            ⚡ QUIZ
                          </span>
                        )}

                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                          style={{ color: estado.color, borderColor: estado.color }}
                        >
                          {estado.texto}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400">
                          ⏱️ {ex.duracionMin} min · {ex.cantidadTeoria} teoría + {ex.cantidadEjercicio} ejercicio
                        </span>
                      </div>

                      <h3 className="text-sm font-black tracking-tight">{ex.titulo}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-sky-400">schedule</span>
                        {formatearFecha(ex.fechaInicio)} → {formatearFecha(ex.fechaFin)}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        📚 Temas: {(ex.semanas || []).map((s) => `Semana ${s.numero}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => { setExamenEditar(ex); setModalAbierto(true); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer transition-all ${
                          esLight ? 'border-slate-300 hover:bg-slate-100' : 'border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminarExamenProgramado(ex)}
                        disabled={eliminando[ex.id] || ex.estadoCalculado === 'cancelado'}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-500/50 text-red-400 hover:bg-red-500/10 cursor-pointer disabled:opacity-40"
                      >
                        {eliminando[ex.id] ? '...' : ex.estadoCalculado === 'cancelado' ? 'Cancelado' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {/* PESTAÑA 1: CALIFICAR / EVALUAR QUIZ */}
        {pestanaActiva === 'calificar' && (
          <>
            {/* 1. SELECCIÓN DE QUIZ */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
              esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-sm'
            }`}>
              <div className="flex justify-between items-center border-b pb-2 border-slate-500/20">
                <h2 className="text-sm font-black flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-500">assignment</span>
                  <span>Paso 1: Seleccione el Quiz o Examen a Calificar</span>
                </h2>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {quices.length} Evaluaciones Disponibles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {quices.map((q) => {
                  const esSeleccionado = q.id === quizSeleccionadoId;
                  const esRecuperacion = q.tipo === 'recuperacion' || q.id.includes('rquiz');
                  const esCustom = q.esPersonalizado;
                  return (
                    <div
                      key={q.id}
                      onClick={() => handleCambiarQuiz(q.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                        esSeleccionado
                          ? esLight
                            ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/30 text-slate-950 shadow-md'
                            : 'bg-slate-800 border-[#38bdf8] ring-2 ring-[#38bdf8]/30 text-white shadow-md'
                          : esLight
                          ? 'bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-800'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-1.5 gap-1">
                          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border uppercase ${
                            esRecuperacion
                              ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                              : 'bg-sky-500/20 text-sky-500 border-sky-500/40'
                          }`}>
                            {esRecuperacion ? 'Recuperación' : 'Ordinario'}
                          </span>
                          {esCustom && (
                            <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                              Personalizado BD
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-slate-400 font-bold">
                            {q.preguntas?.length || 7} Preguntas
                          </span>
                        </div>

                        <h3 className="text-xs font-black leading-snug">{q.titulo}</h3>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{q.descripcion}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-500/20 flex justify-between items-center text-[11px] font-mono font-bold">
                        <span className={esSeleccionado ? 'text-sky-400' : 'text-slate-500'}>
                          {esSeleccionado ? '✓ Seleccionado' : 'Hacer clic para seleccionar'}
                        </span>
                        <span className="text-slate-400">Semanas {q.semanaNumero}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. FORMULARIO PRINCIPAL: ESTUDIANTE + RESPUESTAS DE LA PRUEBA */}
            <form onSubmit={handleCalcularYEvaluar} className="flex flex-col gap-4">
              <div className={`p-4 rounded-xl border flex flex-col gap-4 ${
                esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-sm'
              }`}>
                <div className="flex justify-between items-center border-b pb-2 border-slate-500/20">
                  <h2 className="text-sm font-black flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500">person_search</span>
                    <span>Paso 2: Datos del Estudiante y Tipo de Evaluación</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    {(busquedaEstudiante || estudianteSeleccionadoId || estudianteManualNombre || Object.keys(respuestasDocente).length > 0 || resultadoEvaluacion) && (
                      <button
                        type="button"
                        onClick={handleLimpiarSeleccionEstudianteYCampos}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-bold hover:bg-rose-500/20 cursor-pointer flex items-center gap-1 transition-all"
                        title="Limpiar estudiante seleccionado y matriz de respuestas"
                      >
                        <span className="material-symbols-outlined text-xs">delete_sweep</span>
                        <span>Limpiar Campos</span>
                      </button>
                    )}
                    <span className="text-xs font-mono font-bold text-sky-400">
                      Materia: {materiaSeleccionadaObj.nombre}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* FILA 1: BÚSQUEDA RÁPIDA Y SELECCIÓN DE ESTUDIANTE DE LA MATERIA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-xs font-extrabold flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm text-sky-400">search</span>
                          Buscar Estudiante por Código o Nombre
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-normal">Sugerencias en vivo</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type="text"
                          placeholder="Escriba código o nombre para buscar..."
                          value={busquedaEstudiante}
                          onFocus={() => setMostrarSugerencias(true)}
                          onChange={(e) => {
                            setBusquedaEstudiante(e.target.value);
                            setMostrarSugerencias(true);
                            setRespuestasDocente({});
                            setResultadoEvaluacion(null);
                            setMensajeExito('');
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                            esLight
                              ? 'bg-slate-100 border-slate-300 text-slate-900 focus:border-sky-500'
                              : 'bg-slate-950 border-slate-700 text-white focus:border-sky-400'
                          }`}
                        />
                        {busquedaEstudiante && (
                          <button
                            type="button"
                            onClick={handleLimpiarSeleccionEstudianteYCampos}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-bold cursor-pointer"
                          >
                            ✕
                          </button>
                        )}

                        {/* POPOVER DE SUGERENCIAS FLOTANTES EN VIVO */}
                        {mostrarSugerencias && busquedaEstudiante.trim().length > 0 && (
                          <div className={`absolute left-0 right-0 top-full mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl border shadow-2xl p-1.5 ${
                            esLight ? 'bg-white border-slate-300 shadow-slate-300/50' : 'bg-slate-900 border-slate-700 shadow-black/80'
                          }`}>
                            <div className="px-2 py-1 text-[10px] font-mono font-bold text-slate-400 uppercase border-b border-slate-700/40 mb-1 flex justify-between">
                              <span>Estudiantes Coincidentes ({estudiantesFiltrados.length})</span>
                              <button type="button" onClick={() => setMostrarSugerencias(false)} className="hover:text-slate-200">Cerrar ✕</button>
                            </div>

                            {estudiantesFiltrados.length === 0 ? (
                              <div className="p-3 text-xs text-slate-400 text-center font-semibold">
                                No se encontraron estudiantes con "{busquedaEstudiante}"
                              </div>
                            ) : (
                              estudiantesFiltrados.map((st) => {
                                const esSelec = String(estudianteSeleccionadoId) === String(st.id);
                                return (
                                  <div
                                    key={st.id}
                                    onClick={() => {
                                      setEstudianteSeleccionadoId(st.id);
                                      setBusquedaEstudiante(`[${st.codigo}] ${st.nombre}`);
                                      setEstudianteManualNombre(st.nombre);
                                      setRespuestasDocente({});
                                      setResultadoEvaluacion(null);
                                      setMensajeExito('');
                                      setMostrarSugerencias(false);
                                    }}
                                    className={`p-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center justify-between gap-2 my-0.5 ${
                                      esSelec
                                        ? 'bg-sky-600 text-white'
                                        : esLight
                                        ? 'hover:bg-slate-100 text-slate-800'
                                        : 'hover:bg-slate-800/90 text-slate-200'
                                    }`}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-extrabold">{st.nombre}</span>
                                      <span className={`text-[10px] font-mono ${esSelec ? 'text-sky-100' : 'text-sky-400'}`}>
                                        Código: {st.codigo} {st.email ? `· ${st.email}` : ''}
                                      </span>
                                    </div>
                                    {esSelec && <span className="material-symbols-outlined text-base text-white">check_circle</span>}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold flex justify-between items-center">
                        <span>Estudiante Matriculado ({estudiantesFiltrados.length})</span>
                        <span className="text-[11px] font-mono text-sky-400 font-bold">{materiaSeleccionadaObj.codigo}</span>
                      </label>
                      <select
                        value={estudianteSeleccionadoId}
                        onChange={(e) => {
                          setEstudianteSeleccionadoId(e.target.value);
                          if (e.target.value) {
                            const stEncontrado = estudiantes.find(st => String(st.id) === String(e.target.value));
                            if (stEncontrado) setBusquedaEstudiante(`[${stEncontrado.codigo}] ${stEncontrado.nombre}`);
                            setEstudianteManualNombre('');
                          } else {
                            setBusquedaEstudiante('');
                          }
                          setRespuestasDocente({});
                          setResultadoEvaluacion(null);
                          setMensajeExito('');
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                          esLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-sky-500'
                            : 'bg-slate-950 border-slate-700 text-white focus:border-sky-400'
                        }`}
                      >
                        <option value="">-- Seleccionar de la lista de matriculados ({estudiantes.length}) --</option>
                        {estudiantesFiltrados.map((st) => (
                          <option key={st.id} value={st.id}>
                            [{st.codigo}] {st.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* FILA 2: INGRESO MANUAL DE ESTUDIANTE Y MODALIDAD DE EVALUACIÓN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-3 border-t border-slate-500/20">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold flex justify-between items-center">
                        <span>O bien, Nombre Manual del Estudiante</span>
                        <span className="text-[11px] font-mono text-slate-400 font-normal">Estudiante no matriculado</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Escriba el nombre del estudiante si no está en la lista..."
                        value={estudianteManualNombre}
                        onChange={(e) => {
                          setEstudianteManualNombre(e.target.value);
                          if (e.target.value) setEstudianteSeleccionadoId('');
                          setRespuestasDocente({});
                          setResultadoEvaluacion(null);
                          setMensajeExito('');
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                          esLight
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500'
                            : 'bg-slate-950 border-slate-700 text-white focus:border-sky-400'
                        }`}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-extrabold flex justify-between items-center">
                        <span>Modalidad de Evaluación</span>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">Tipo de Prueba</span>
                      </label>
                      <select
                        value={tipoEvaluacion}
                        onChange={(e) => setTipoEvaluacion(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                          esLight
                            ? 'bg-white border-slate-300 text-slate-900'
                            : 'bg-slate-950 border-slate-700 text-white'
                        }`}
                      >
                        <option value="ordinario">Quiz Ordinario (Primera Oportunidad)</option>
                        <option value="recuperacion">Quiz de Recuperación (RQuiz / Reposición)</option>
                        <option value="no_presento">❌ No Presentó (Ausente - Nota 0.0 / NP)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. MATRIZ DE RESPUESTAS DEL QUIZ */}
              {quizActivo && (
                <div id="paso3-matriz-respuestas" className={`p-4 rounded-xl border flex flex-col gap-4 scroll-mt-6 ${
                  esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-sm'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-2 border-slate-500/20">
                    <div>
                      <h2 className="text-sm font-black flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500">rule</span>
                        <span>Paso 3: Matriz de Respuestas Físicas ({quizActivo.preguntas.length} Preguntas)</span>
                      </h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {quizActivo.titulo} — <span className="text-amber-400 font-semibold">Haz clic en una opción para seleccionar. Para cambiar o corregir un error, haz clic sobre la opción nuevamente para desmarcarla.</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleMarcarTodasSinRespuesta}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold hover:bg-amber-500/30 cursor-pointer"
                      >
                        🚫 Marcar Todas N/R
                      </button>
                      <button
                        type="button"
                        onClick={handleMarcarTodasNoPresento}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] font-bold hover:bg-rose-500/30 cursor-pointer"
                      >
                        ❌ Marcar No Presentó (NP)
                      </button>
                      <button
                        type="button"
                        onClick={handleLimpiarRespuestas}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${
                          esLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        🧹 Desmarcar Todo
                      </button>
                      <span className="text-xs font-mono font-extrabold text-sky-400 block px-2">
                        {respuestasCompletasCount} / {quizActivo.preguntas.length} Seleccionadas
                      </span>
                    </div>
                  </div>

                  {/* PREGUNTAS DEL QUIZ */}
                  <div className="grid grid-cols-1 gap-3">
                    {quizActivo.preguntas.map((p, idx) => {
                      const seleccionada = respuestasDocente[idx];
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition-all ${
                            seleccionada
                              ? esLight
                                ? 'bg-sky-50/50 border-sky-300'
                                : 'bg-slate-800/60 border-slate-700'
                              : esLight
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-slate-950/40 border-slate-800'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-sky-500 text-white font-mono text-xs font-black flex items-center justify-center shrink-0">
                                {p.num || (idx + 1)}
                              </span>
                              <div>
                                <span className="text-xs font-bold block">{p.titulo}</span>
                                <span className="text-[10px] font-mono text-sky-400 font-semibold">{p.ra}: {p.raDescripcion}</span>
                              </div>
                            </div>

                            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
                              Clave: {p.correcta.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-xs text-slate-300 font-medium mb-3 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/60">
                            {formatearEnunciado(p.enunciado)}
                          </div>

                          {/* ALTERNATIVAS A, B, C, D Y OPCIONES N/R Y NP (NO PRESENTÓ) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2">
                            {p.opciones.map((op) => {
                              const esCheck = respuestasDocente[idx] === op.id;
                              return (
                                <button
                                  type="button"
                                  key={op.id}
                                  onClick={() => handleSeleccionarRespuesta(idx, op.id)}
                                  className={`p-2 rounded-lg text-left text-xs transition-all border flex items-start gap-2 cursor-pointer ${
                                    esCheck
                                      ? 'bg-sky-600 text-white border-sky-400 font-extrabold ring-2 ring-sky-300/40 shadow-sm'
                                      : esLight
                                      ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100'
                                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded font-mono text-xs font-black flex items-center justify-center shrink-0 border ${
                                    esCheck ? 'bg-white text-sky-700 border-white' : 'bg-slate-800 text-slate-300 border-slate-700'
                                  }`}>
                                    {op.id.toUpperCase()}
                                  </span>
                                  <span className="text-[11px] leading-tight line-clamp-2">{op.texto}</span>
                                </button>
                              );
                            })}

                            {/* CAMPO ESPECÍFICO SIN RESPUESTA (N/R) */}
                            {(() => {
                              const esNR = respuestasDocente[idx] === 'nr';
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleSeleccionarRespuesta(idx, 'nr')}
                                  className={`p-2 rounded-lg text-left text-xs transition-all border flex items-start gap-2 cursor-pointer ${
                                    esNR
                                      ? 'bg-amber-600 text-white border-amber-400 font-extrabold ring-2 ring-amber-300/40 shadow-sm'
                                      : esLight
                                      ? 'bg-amber-50/60 border-amber-200 text-amber-900 hover:bg-amber-100'
                                      : 'bg-amber-950/40 border-amber-900/60 text-amber-300 hover:bg-amber-900/60'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded font-mono text-xs font-black flex items-center justify-center shrink-0 border ${
                                    esNR ? 'bg-white text-amber-700 border-white' : 'bg-amber-900/50 text-amber-200 border-amber-700'
                                  }`}>
                                    N/R
                                  </span>
                                  <span className="text-[11px] leading-tight font-extrabold">Sin Respuesta (N/R)</span>
                                </button>
                              );
                            })()}

                            {/* CAMPO ESPECÍFICO NO PRESENTÓ (NP) */}
                            {(() => {
                              const esNP = respuestasDocente[idx] === 'np';
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleSeleccionarRespuesta(idx, 'np')}
                                  className={`p-2 rounded-lg text-left text-xs transition-all border flex items-start gap-2 cursor-pointer ${
                                    esNP
                                      ? 'bg-rose-600 text-white border-rose-400 font-extrabold ring-2 ring-rose-300/40 shadow-sm'
                                      : esLight
                                      ? 'bg-rose-50/60 border-rose-200 text-rose-900 hover:bg-rose-100'
                                      : 'bg-rose-950/40 border-rose-900/60 text-rose-300 hover:bg-rose-900/60'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded font-mono text-xs font-black flex items-center justify-center shrink-0 border ${
                                    esNP ? 'bg-white text-rose-700 border-white' : 'bg-rose-900/50 text-rose-200 border-rose-700'
                                  }`}>
                                    NP
                                  </span>
                                  <span className="text-[11px] leading-tight font-extrabold">No Presentó (NP)</span>
                                </button>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* BOTÓN PROCESAR EVALUACIÓN */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-500/20">
                    <button
                      type="submit"
                      disabled={procesando}
                      className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                        procesando
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-600/30'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">analytics</span>
                      <span>
                        {procesando
                          ? 'Procesando Diagnóstico...'
                          : `Calcular Nota y Diagnóstico por RA (${respuestasCompletasCount}/${quizActivo.preguntas.length} marcadas)`}
                      </span>
                    </button>
                  </div>
                </div>

              )}
            </form>

            {/* 4. RESULTADO E INFORME PEDAGÓGICO DE LA EVALUACIÓN */}
            {resultadoEvaluacion && (
              <div className={`p-5 rounded-xl border flex flex-col gap-4 shadow-xl ${
                esLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3 border-slate-500/20">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
                      DIAGNÓSTICO AUTOMÁTICO DE DESEMPEÑO POR RESULTADOS DE APRENDIZAJE (RA)
                    </span>
                    <h3 className="text-lg font-black">{resultadoEvaluacion.estudianteNombre}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{resultadoEvaluacion.quizTitulo}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const paso3 = document.getElementById('paso3-matriz-respuestas');
                        if (paso3) paso3.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold shadow flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                      <span>Editar Respuestas</span>
                    </button>
                    <button
                      onClick={handleCopiarReporte}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold border border-slate-700 flex items-center gap-1.5 shadow"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      <span>Copiar Informe</span>
                    </button>
                    <button
                      onClick={handleImprimir}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow"
                    >
                      <span className="material-symbols-outlined text-sm">print</span>
                      <span>Imprimir</span>
                    </button>
                  </div>
                </div>

                {/* TARJETAS RESUMEN DE NOTA */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className={`p-4 rounded-xl border text-center flex flex-col justify-center ${
                    resultadoEvaluacion.noPresento || resultadoEvaluacion.tipoEvaluacion === 'no_presento'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : resultadoEvaluacion.aprobado
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                    <span className="text-[10px] font-mono font-bold uppercase">Calificación Final (0 - 5.0)</span>
                    <span className="text-3xl font-black my-1">
                      {resultadoEvaluacion.noPresento || resultadoEvaluacion.tipoEvaluacion === 'no_presento' ? '0.0 (NP)' : resultadoEvaluacion.nota5}
                    </span>
                    <span className="text-xs font-extrabold">
                      {resultadoEvaluacion.noPresento || resultadoEvaluacion.tipoEvaluacion === 'no_presento'
                        ? '❌ NO PRESENTÓ (AUSENTE)'
                        : resultadoEvaluacion.aprobado
                        ? '¡APROBADO!'
                        : 'REQUIERE REFUERZO'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border bg-slate-800/40 border-slate-700 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Porcentaje de Aciertos</span>
                    <span className="text-3xl font-black text-sky-400 my-1">{resultadoEvaluacion.porcentaje}%</span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {resultadoEvaluacion.aciertos} de {resultadoEvaluacion.totalPreguntas} correctas
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border bg-slate-800/40 border-slate-700 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Estado de Persistencia</span>
                    <span className="text-sm font-black text-emerald-400 my-1">
                      {resultadoEvaluacion.intentoId ? `Registrado (ID #${resultadoEvaluacion.intentoId})` : 'Guardado en PostgreSQL'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(resultadoEvaluacion.fecha).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* OBJETIVOS LOGRADOS */}
                <div className="p-3.5 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
                  <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Fortalezas y Objetivos de Aprendizaje Alcanzados</span>
                  </h4>
                  {resultadoEvaluacion.fortalezas.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {resultadoEvaluacion.fortalezas.map((f, i) => (
                        <li key={i} className="text-xs text-slate-300 font-medium flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No se registraron aciertos en esta evaluación.</p>
                  )}
                </div>

                {/* FALENCIAS Y RECOMENDACIONES */}
                {resultadoEvaluacion.falencias.length > 0 && (
                  <div className="p-3.5 rounded-xl border bg-rose-500/5 border-rose-500/20 flex flex-col gap-3">
                    <h4 className="text-xs font-extrabold text-rose-400 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      <span>Falencias Identificadas y Recomendaciones Pedagógicas ({resultadoEvaluacion.falencias.length})</span>
                    </h4>

                    <div className="flex flex-col gap-2.5">
                      {resultadoEvaluacion.falencias.map((f, i) => (
                        <div key={i} className="p-3 rounded-lg border border-rose-500/20 bg-slate-900/60 flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-rose-300">
                              Pregunta {f.num} — {f.titulo}
                            </span>
                            <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                              {f.ra}
                            </span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-300">
                            Respuesta Ingresada: <span className="text-rose-400 font-bold">{f.respuestaEstudiante}</span> | Correcta: <span className="text-emerald-400 font-bold">{f.respuestaCorrecta}</span>
                          </div>

                          <p className="text-xs text-slate-400 font-medium">
                            <strong className="text-slate-300">Falencia detectada:</strong> {f.falencia}
                          </p>

                          <p className="text-xs text-slate-300 bg-slate-800/60 p-2 rounded border border-slate-700">
                            <strong className="text-sky-400">Explicación:</strong> {f.explicacion}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* PESTAÑA 2: CREAR / CARGAR QUIZ POR SEMANAS */}
        {pestanaActiva === 'crear' && (
          <div className="flex flex-col gap-4">
            {/* PANEL DE GENERACIÓN ALEATORIA DESDE EL BANCO DE DATOS (POSTGRESQL) */}
            <div className={`p-4 rounded-xl border flex flex-col gap-3 shadow-md ${
              esLight ? 'bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-300' : 'bg-slate-950 border-sky-500/30'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-2 border-slate-500/20">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-sky-400">casino</span>
                  <div>
                    <h3 className="text-xs font-black uppercase text-sky-400 tracking-wider">
                      Generador Automático de Quiz Aleatorio (Desde Banco de Preguntas en BD)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Selecciona la cantidad de preguntas y las semanas; el sistema extraerá preguntas al azar de PostgreSQL.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGenerarQuizAleatorio}
                  disabled={generandoAleatorio}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all ${
                    generandoAleatorio ? 'bg-slate-700 text-slate-400' : 'bg-sky-600 hover:bg-sky-500 text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">casino</span>
                  <span>{generandoAleatorio ? 'Generando Quiz...' : '🎲 Generar y Publicar Quiz Aleatorio BD'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-extrabold text-slate-300">Cantidad de Preguntas al Azar *</label>
                  <select
                    value={cantPreguntasAleatorias}
                    onChange={(e) => setCantPreguntasAleatorias(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                      esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value={3}>3 Preguntas al azar</option>
                    <option value={5}>5 Preguntas al azar (Estándar)</option>
                    <option value={7}>7 Preguntas al azar</option>
                    <option value={10}>10 Preguntas al azar</option>
                    <option value={15}>15 Preguntas al azar</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1">
                  <label className="text-[11px] font-extrabold text-slate-300">Título Personalizado (Opcional)</label>
                  <input
                    type="text"
                    placeholder="ej. Quiz Aleatorio — 5 Preguntas del Banco BD"
                    value={tituloAleatorio}
                    onChange={(e) => setTituloAleatorio(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                      esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-extrabold text-slate-300">Semanas a Evaluar</label>
                  <select
                    value={semanaIdAleatoria}
                    onChange={(e) => setSemanaIdAleatoria(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                      esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value={1}>Semanas 01 a 03 (Sistemas y Matrices)</option>
                    <option value={4}>Semanas 03 a 05 (Inversas y LU)</option>
                    <option value={6}>Semanas 06 a 08 (Determinantes y Vectores)</option>
                    <option value={9}>Semanas 09 a 16 (Espacios Vectoriales)</option>
                    <option value={100}>Todas las Semanas del Curso (01 a 16)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex flex-col gap-4 ${
              esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-sm'
            }`}>
              <div className="flex justify-between items-center border-b pb-2 border-slate-500/20">
                <div>
                  <h2 className="text-sm font-black flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-500">add_task</span>
                    <span>Constructor Manual o Carga por Archivo ({materiaSeleccionadaObj.nombre})</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Diseña un quiz manualmente o carga un archivo JSON estructurado para añadirlo a la base de datos PostgreSQL.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDescargarPlantilla}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold border border-slate-700 flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <span className="material-symbols-outlined text-sm">download</span>
                    <span>Descargar Plantilla JSON</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow">
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    <span>Cargar JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleSubirArchivoJSON}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {mensajeQuizGlobal && (
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">info</span>
                  <span>{mensajeQuizGlobal}</span>
                </div>
              )}

              <form onSubmit={handleGuardarNuevoQuiz} className="flex flex-col gap-4">
                {/* DATOS GENERALES DEL QUIZ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-extrabold">Título del Quiz *</label>
                    <input
                      type="text"
                      required
                      placeholder="ej. Quiz 3 — Semanas 06 a 08 (Determinantes y Regla de Cramer)"
                      value={nuevoQuizTitulo}
                      onChange={(e) => setNuevoQuizTitulo(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                        esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-extrabold">Tipo de Quiz</label>
                    <select
                      value={nuevoQuizTipo}
                      onChange={(e) => setNuevoQuizTipo(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                        esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    >
                      <option value="ordinario">Quiz Ordinario</option>
                      <option value="recuperacion">Quiz de Recuperación (RQuiz)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-extrabold">Semanas que abarca</label>
                    <input
                      type="text"
                      placeholder="ej. 06-08"
                      value={nuevoQuizSemanaNumero}
                      onChange={(e) => setNuevoQuizSemanaNumero(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                        esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-extrabold">Semana de Referencia Principal</label>
                    <select
                      value={nuevoQuizSemanaId}
                      onChange={(e) => setNuevoQuizSemanaId(Number(e.target.value))}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                        esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    >
                      {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>Semana {String(n).padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-extrabold">Descripción Breve</label>
                    <input
                      type="text"
                      placeholder="ej. Quiz de 5 preguntas sobre determinantes, matriz adjunta y Cramer."
                      value={nuevoQuizDescripcion}
                      onChange={(e) => setNuevoQuizDescripcion(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                        esLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* CONSTRUCTOR DE PREGUNTAS */}
                <div className="flex justify-between items-center pt-3 border-t border-slate-500/20">
                  <h3 className="text-xs font-black uppercase text-sky-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">format_list_bulleted</span>
                    <span>Preguntas del Quiz ({preguntasNuevas.length})</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleAgregarPreguntaNueva}
                    className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Agregar Pregunta</span>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {preguntasNuevas.map((p, qIdx) => (
                    <div
                      key={qIdx}
                      className={`p-4 rounded-xl border flex flex-col gap-3 relative ${
                        esLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950/80 border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-center border-b pb-2 border-slate-500/20">
                        <span className="text-xs font-black text-emerald-400 font-mono">
                          Pregunta #{qIdx + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleEliminarPreguntaNueva(qIdx)}
                          className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                          <span>Eliminar</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2 flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-400">Título del Tema / Semana</label>
                          <input
                            type="text"
                            placeholder="ej. Semana 6: Propiedades de los Determinantes"
                            value={p.titulo}
                            onChange={(e) => handleCambiarCampoPregunta(qIdx, 'titulo', e.target.value)}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-xs border outline-none ${
                              esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                            }`}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-400">Código RA (Resultado de Aprendizaje)</label>
                          <input
                            type="text"
                            placeholder="ej. RA3.1-RA3.3"
                            value={p.ra}
                            onChange={(e) => handleCambiarCampoPregunta(qIdx, 'ra', e.target.value)}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-xs border outline-none font-mono ${
                              esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-400">Descripción del Resultado de Aprendizaje (RA)</label>
                        <input
                          type="text"
                          placeholder="ej. Definiciones y propiedades de los determinantes..."
                          value={p.raDescripcion}
                          onChange={(e) => handleCambiarCampoPregunta(qIdx, 'raDescripcion', e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-xs border outline-none ${
                            esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-slate-400">Enunciado de la Pregunta *</label>
                        <textarea
                          rows={2}
                          required
                          placeholder="Escribe la pregunta o problema..."
                          value={p.enunciado}
                          onChange={(e) => handleCambiarCampoPregunta(qIdx, 'enunciado', e.target.value)}
                          className={`w-full px-2.5 py-1.5 rounded-lg text-xs border outline-none ${
                            esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                          }`}
                        />
                      </div>

                      {/* OPCIONES DE RESPUESTA A, B, C, D */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-400">Opciones de Respuesta y Clave Correcta *</label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {p.opciones.map((op, oIdx) => (
                            <div key={op.id} className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-lg border border-slate-800">
                              <input
                                type="radio"
                                name={`correcta_${qIdx}`}
                                checked={p.correcta === op.id}
                                onChange={() => handleCambiarCampoPregunta(qIdx, 'correcta', op.id)}
                                className="accent-sky-500 cursor-pointer"
                              />
                              <span className="w-5 h-5 rounded bg-slate-800 text-sky-400 font-mono text-xs font-black flex items-center justify-center shrink-0">
                                {op.id.toUpperCase()}
                              </span>
                              <input
                                type="text"
                                required
                                placeholder={`Texto opción ${op.id.toUpperCase()}`}
                                value={op.texto}
                                onChange={(e) => handleCambiarOpcionTexto(qIdx, oIdx, e.target.value)}
                                className={`flex-1 px-2 py-1 rounded text-xs border outline-none ${
                                  esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                                }`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-400">Explicación de la Respuesta Correcta</label>
                          <textarea
                            rows={2}
                            placeholder="Explicación detallada del procedimiento..."
                            value={p.explicacion}
                            onChange={(e) => handleCambiarCampoPregunta(qIdx, 'explicacion', e.target.value)}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-xs border outline-none ${
                              esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                            }`}
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-bold text-slate-400">Falencia Pedagógica Frecuente</label>
                          <textarea
                            rows={2}
                            placeholder="Descripción de la falla común cuando se responde mal..."
                            value={p.falencia}
                            onChange={(e) => handleCambiarCampoPregunta(qIdx, 'falencia', e.target.value)}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-xs border outline-none ${
                              esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-500/20">
                  <button
                    type="submit"
                    disabled={guardandoQuiz}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">save</span>
                    <span>{guardandoQuiz ? 'Guardando en PostgreSQL...' : '💾 Guardar y Publicar Quiz en la BD'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: GESTIONAR QUICES EXISTENTES */}
        {pestanaActiva === 'gestionar' && (
          <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
            esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-sm'
          }`}>
            <div className="flex justify-between items-center border-b pb-2 border-slate-500/20">
              <h2 className="text-sm font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">quiz</span>
                <span>Catálogo de Evaluaciones Registradas ({quices.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quices.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                    esLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border uppercase ${
                          q.tipo === 'recuperacion'
                            ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                            : 'bg-sky-500/20 text-sky-500 border-sky-500/40'
                        }`}>
                          {q.tipo === 'recuperacion' ? 'Recuperación' : 'Ordinario'}
                        </span>
                        {q.esPersonalizado && (
                          <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded border bg-emerald-500/20 text-emerald-400 border-emerald-500/40">
                            Personalizado BD
                          </span>
                        )}
                      </div>

                      {q.esPersonalizado && (
                        <button
                          type="button"
                          onClick={() => handleEliminarQuizCustom(q.id, q.titulo)}
                          className="px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs">delete</span>
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>

                    <h3 className="text-sm font-black leading-snug">{q.titulo}</h3>
                    <p className="text-xs text-slate-400 mt-1">{q.descripcion}</p>
                    <div className="text-[11px] font-mono text-sky-400 mt-2 font-bold">
                      Semanas {q.semanaNumero} — {q.preguntas?.length || 0} Preguntas
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-500/20 flex justify-between items-center">
                    <button
                      onClick={() => {
                        handleCambiarQuiz(q.id);
                        setPestanaActiva('calificar');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xs">edit_square</span>
                      <span>Calificar este Quiz</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 4: PARCIALES ADAPTATIVOS E IMPRESIÓN PDF POR ESTUDIANTE */}
        {pestanaActiva === 'parciales' && (
          <div className="flex flex-col gap-6">
            {/* CONFIGURACIÓN Y GENERACIÓN (Oculto en impresión) */}
            <div className={`p-4 rounded-xl border flex flex-col gap-4 no-print ${
              esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/70 border-slate-800 shadow-sm'
            }`}>
              <div className="flex justify-between items-center border-b pb-3 border-slate-500/20">
                <div>
                  <h2 className="text-sm font-black flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">psychology</span>
                    <span>Generador de Parciales Adaptativos e Individuales por RA</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Analiza los quices presentados en PostgreSQL por cada estudiante, detecta sus Objetivos de Aprendizaje (RA) no superados y genera un examen personalizado descargable/impreso en PDF.
                  </p>
                </div>

                {parcialesResultado && (
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <span className="material-symbols-outlined text-base">print</span>
                    <span>🖨️ Imprimir / Descargar PDF de Parciales</span>
                  </button>
                )}
              </div>

              {/* CONTROLES */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold">Título del Parcial / Evaluación</label>
                  <input
                    type="text"
                    value={parcialTitulo}
                    onChange={(e) => setParcialTitulo(e.target.value)}
                    placeholder="ej. Parcial 1 de Recuperación Adaptativo por RA"
                    className={`px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                      esLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold">Cantidad de Preguntas por Estudiante</label>
                  <select
                    value={parcialCantPreguntas}
                    onChange={(e) => setParcialCantPreguntas(Number(e.target.value))}
                    className={`px-3 py-2 rounded-xl text-xs border outline-none font-bold ${
                      esLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value={3}>3 Preguntas por Estudiante</option>
                    <option value={5}>5 Preguntas por Estudiante</option>
                    <option value={7}>7 Preguntas por Estudiante</option>
                    <option value={10}>10 Preguntas por Estudiante</option>
                  </select>
                </div>
              </div>

              {/* SELECCIÓN DE ESTUDIANTES */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold text-slate-300 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-sky-400">group</span>
                    <span>Estudiantes Seleccionados ({parcialEstudiantesSeleccionados.length === 0 ? `Todos (${estudiantes.length})` : `${parcialEstudiantesSeleccionados.length} de ${estudiantes.length}`})</span>
                  </span>

                  <div className="flex items-center gap-2 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setParcialEstudiantesSeleccionados(estudiantes.map(e => e.id))}
                      className="text-sky-400 hover:underline cursor-pointer"
                    >
                      Seleccionar Todos
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => setParcialEstudiantesSeleccionados([])}
                      className="text-slate-400 hover:underline cursor-pointer"
                    >
                      Deseleccionar Todos
                    </button>
                  </div>
                </div>

                <div className="max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2 rounded-xl border border-slate-800 bg-slate-950/40">
                  {estudiantes.map((est) => {
                    const estaSeleccionado = parcialEstudiantesSeleccionados.length === 0 || parcialEstudiantesSeleccionados.includes(est.id);
                    return (
                      <label
                        key={est.id}
                        className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                          estaSeleccionado
                            ? 'bg-purple-950/40 border-purple-500/50 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={estaSeleccionado}
                          onChange={() => {
                            if (parcialEstudiantesSeleccionados.length === 0) {
                              setParcialEstudiantesSeleccionados(estudiantes.map(e => e.id).filter(id => id !== est.id));
                            } else if (parcialEstudiantesSeleccionados.includes(est.id)) {
                              setParcialEstudiantesSeleccionados(parcialEstudiantesSeleccionados.filter(id => id !== est.id));
                            } else {
                              setParcialEstudiantesSeleccionados([...parcialEstudiantesSeleccionados, est.id]);
                            }
                          }}
                          className="accent-purple-500"
                        />
                        <div className="truncate">
                          <div className="font-bold truncate">{est.nombre}</div>
                          <div className="text-[10px] font-mono text-slate-400">{est.codigo}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleGenerarParcialesAdaptativos}
                  disabled={generandoParciales}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  <span>{generandoParciales ? 'Analizando RAs y Generando Exámenes...' : '⚡ Generar Parciales Individuales Adaptativos'}</span>
                </button>
              </div>
            </div>

            {/* VISTA PREVIA Y DOCUMENTO IMPRESO EN PDF */}
            {parcialesResultado && (
              <div className="flex flex-col gap-8">
                <style>{`
                  @media print {
                    body * {
                      visibility: hidden;
                    }
                    .no-print, nav, header, sidebar, footer {
                      display: none !important;
                    }
                    .area-impresion-parciales, .area-impresion-parciales * {
                      visibility: visible;
                    }
                    .area-impresion-parciales {
                      position: absolute;
                      left: 0;
                      top: 0;
                      width: 100%;
                    }
                    .hoja-parcial {
                      page-break-after: always !important;
                      break-after: page !important;
                      padding: 2.5cm 2cm !important;
                      margin: 0 !important;
                      background: #ffffff !important;
                      color: #000000 !important;
                      border: none !important;
                      box-shadow: none !important;
                    }
                    .hoja-parcial * {
                      color: #000000 !important;
                      border-color: #333333 !important;
                    }
                  }
                `}</style>

                <div className="area-impresion-parciales flex flex-col gap-8">
                  {parcialesResultado.examenesEstudiantes.map((ex, idx) => (
                    <div
                      key={ex.estudianteId || idx}
                      className="hoja-parcial bg-white text-slate-900 p-8 rounded-xl border border-slate-300 shadow-lg flex flex-col justify-between min-h-[1050px]"
                    >
                      <div>
                        {/* ENCABEZADO INSTITUCIONAL UNICAUCA (FORMATO OFICIAL CARÁTULA LATEX) */}
                        <div className="border-b-2 border-[#005A3C] pb-3 mb-4 flex justify-between items-center">
                          <div className="flex flex-col">
                            <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">UNIVERSIDAD DEL CAUCA</h2>
                            <h3 className="text-xs font-bold text-slate-700 uppercase">Facultad de Ingeniería Electrónica y Telecomunicaciones</h3>
                            <h4 className="text-xs font-semibold text-slate-600">Departamento de Automática / Ciencias Básicas</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-black text-[#005A3C] uppercase">{parcialesResultado.tituloExamen}</div>
                            <div className="text-xs font-bold text-slate-800">{parcialesResultado.materiaNombre} — 2026</div>
                          </div>
                        </div>

                        {/* TABLA OFICIAL DE DATOS DEL ESTUDIANTE (MARCADA CON NOMBRE Y CÓDIGO) */}
                        <table className="w-full border-collapse border border-slate-900 text-xs mb-4">
                          <tbody>
                            <tr>
                              <td className="font-bold bg-slate-100 border border-slate-400 p-1.5 w-44">Nombre del Estudiante:</td>
                              <td className="font-extrabold text-sm border border-slate-400 p-1.5 uppercase text-slate-900">{ex.estudianteNombre}</td>
                            </tr>
                            <tr>
                              <td className="font-bold bg-slate-100 border border-slate-400 p-1.5">Código / Documento:</td>
                              <td className="font-mono font-extrabold border border-slate-400 p-1.5 text-slate-900">{ex.estudianteCodigo}</td>
                            </tr>
                            <tr>
                              <td className="font-bold bg-slate-100 border border-slate-400 p-1.5">Asignatura:</td>
                              <td className="font-bold border border-slate-400 p-1.5">{parcialesResultado.materiaNombre}</td>
                            </tr>
                            <tr>
                              <td className="font-bold bg-slate-100 border border-slate-400 p-1.5">Evaluación / Modalidad:</td>
                              <td className="font-extrabold border border-slate-400 p-1.5">{parcialesResultado.tituloExamen} (Individual, sin apunte ni calculadora)</td>
                            </tr>
                            <tr>
                              <td className="font-bold bg-slate-100 border border-slate-400 p-1.5">Fecha & Docente:</td>
                              <td className="border border-slate-400 p-1.5 flex justify-between items-center">
                                <span>Fecha: <strong>{new Date(parcialesResultado.fechaGeneracion).toLocaleDateString('es-CO')}</strong></span>
                                <span>Docente: <strong>Ing. Fabio Hernán Realpe</strong></span>
                              </td>
                            </tr>
                            <tr>
                              <td className="font-bold bg-slate-100 border border-slate-400 p-1.5">Calificación / Nota:</td>
                              <td className="font-mono font-bold border border-slate-400 p-1.5 text-slate-900">__________________________ / 5.0 (100 Puntos)</td>
                            </tr>
                          </tbody>
                        </table>

                        {/* CUADRO DE INSTRUCCIONES OFICIALES (IGUAL AL QUIZ LATEX) */}
                        <div className="mb-4 p-3 rounded border border-[#005A3C] bg-[#005A3C]/5 text-xs">
                          <div className="font-black text-[#005A3C] uppercase tracking-wide mb-1">
                            📋 Instrucciones Generales del Examen:
                          </div>
                          <ul className="list-disc pl-4 space-y-1 text-slate-800 text-[11px]">
                            <li>Escriba con bolígrafo de tinta oscura. En preguntas de selección múltiple, marque una sola opción y adjunte la breve justificación.</li>
                            <li>En las preguntas de desarrollo, se evalúa el procedimiento completo con su respectiva verificación.</li>
                            <li>No se permite el uso de calculadora programable, teléfonos móviles ni apuntes personales.</li>
                          </ul>
                        </div>

                        {/* CUADRO DE OBJETIVOS DE APRENDIZAJE A REFORZAR (RA) */}
                        <div className="mb-5 p-3 rounded-lg border border-amber-300 bg-amber-50 text-xs">
                          <div className="font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                            🎯 Objetivos de Aprendizaje (RA) a Evaluar / Reforzar:
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {ex.rasParaReforzar.map((raCode, rIdx) => (
                              <span key={rIdx} className="px-2 py-0.5 rounded bg-white border border-amber-400 font-mono font-bold text-amber-900 text-[11px]">
                                {raCode}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CUESTIONARIO IMPRESO */}
                        <div className="flex flex-col gap-5">
                          {ex.preguntas.map((preg) => (
                            <div key={preg.num} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col gap-2.5">
                              <div className="flex justify-between items-start gap-2">
                                <div className="font-black text-xs text-slate-900 font-mono">
                                  PREGUNTA #{preg.num} <span className="font-normal text-slate-600">[{preg.ra}]</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-500 italic">
                                  {preg.titulo}
                                </span>
                              </div>

                              <div className="text-xs font-bold text-slate-800 leading-relaxed">
                                {formatearEnunciado(preg.enunciado, PRE_CLASS_IMPRESION)}
                              </div>

                              {/* OPCIONES DE RESPUESTA A, B, C, D */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                {preg.opciones.map((op) => (
                                  <div key={op.id} className="flex items-center gap-2 p-2 rounded border border-slate-300 bg-white text-xs">
                                    <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                                      {op.id.toUpperCase()}
                                    </div>
                                    <span className="font-medium text-slate-900">{op.texto}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PIE DE PÁGINA Y FIRMAS */}
                      <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-xs text-slate-600">
                        <div className="flex flex-col gap-8 w-64">
                          <div className="border-b border-slate-800"></div>
                          <div className="text-center font-bold text-[11px]">
                            Firma del Estudiante ({ex.estudianteCodigo})
                          </div>
                        </div>

                        <div className="flex flex-col gap-8 w-64">
                          <div className="border-b border-slate-800"></div>
                          <div className="text-center font-bold text-[11px]">
                            Firma / Calificación del Docente
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* HOJA DE CLAVES Y RESPUESTAS PARA EL DOCENTE */}
                  <div className="hoja-parcial bg-white text-slate-900 p-8 rounded-xl border border-slate-400 shadow-lg flex flex-col justify-between min-h-[1050px]">
                    <div>
                      <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-center">
                        <div>
                          <h2 className="text-base font-black uppercase text-slate-900">HOJA DE CLAVES Y RESPUESTAS DEL DOCENTE</h2>
                          <h3 className="text-xs font-extrabold text-purple-900">{parcialesResultado.tituloExamen}</h3>
                        </div>
                        <span className="text-xs font-mono font-bold px-3 py-1 bg-purple-100 text-purple-900 rounded border border-purple-300">
                          USO EXCLUSIVO DOCENTE
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {parcialesResultado.examenesEstudiantes.map((ex, idx) => (
                          <div key={idx} className="p-3 rounded-lg border border-slate-300 bg-slate-50 text-xs flex flex-col gap-2">
                            <div className="font-black text-slate-900 border-b border-slate-200 pb-1 flex justify-between">
                              <span>{idx + 1}. {ex.estudianteNombre}</span>
                              <span className="font-mono text-slate-600 text-[11px]">{ex.estudianteCodigo}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-1">
                              {ex.preguntas.map((p) => (
                                <div key={p.num} className="px-2 py-1 rounded bg-white border border-slate-300 font-mono text-[11px]">
                                  <strong>P{p.num}:</strong> <span className="font-black text-emerald-700">{p.correcta.toUpperCase()}</span>{' '}
                                  <span className="text-slate-500">({p.ra})</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 text-center text-xs font-mono text-slate-500 border-t pt-2">
                      Documento generado automáticamente por el Módulo de Evaluación de la Universidad del Cauca.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL EDICIÓN RÁPIDA DE CALIFICACIÓN */}
      {intentoEditarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl flex flex-col gap-4 ${
            esLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
          }`}>
            <div className="flex justify-between items-center border-b pb-3 border-slate-500/20">
              <h3 className="text-sm font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">edit_note</span>
                <span>Editar Calificación en PostgreSQL</span>
              </h3>
              <button
                type="button"
                onClick={() => setIntentoEditarModal(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Estudiante</span>
                <span className="font-extrabold text-sky-400 text-sm">{intentoEditarModal.estudianteNombre}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Examen: {intentoEditarModal.tituloExamen || `Quiz Semanal (${intentoEditarModal.semanaNumero || 'General'})`}
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold flex justify-between">
                  <span>Nueva Calificación (0.0 - 5.0):</span>
                  <span className="font-mono text-sky-400 font-bold">{Number(notaModalValue) >= 3.0 ? '✓ Aprobado' : '❌ Reprobado'}</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.0"
                  max="5.0"
                  value={notaModalValue}
                  onChange={(e) => setNotaModalValue(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-extrabold outline-none ${
                    esLight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' : 'bg-slate-950 border-slate-700 text-white focus:border-sky-400'
                  }`}
                />
                <span className="text-[11px] font-mono text-slate-400">
                  Porcentaje equivalente: {Math.round((Math.max(0, Math.min(5, Number(notaModalValue) || 0)) / 5.0) * 100)}%
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-500/20 mt-2">
              <button
                type="button"
                onClick={() => setIntentoEditarModal(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                  esLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGuardarEdicionNota}
                disabled={guardandoNotaEdit}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md disabled:opacity-50 cursor-pointer"
              >
                {guardandoNotaEdit ? 'Guardando...' : 'Guardar Cambios BD'}
              </button>
            </div>
          </div>
        </div>
      )}



      <ExamenProgramadoModal
        isOpen={modalAbierto}
        onClose={() => { setModalAbierto(false); setExamenEditar(null); }}
        materiaId={materiaActivaId}
        semanas={semanas}
        examen={examenEditar}
        modoPresetInicial={modoPresetInicial}
      />
    </div>
  );
}

const EvaluacionQuicesView = withAuth(withRole(EvaluacionQuicesViewBase, ['DOCENTE', 'SUPERUSUARIO', 'ESTUDIANTE']));
export default EvaluacionQuicesView;

