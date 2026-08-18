import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseStore } from '../store/useCourseStore';
import Sidebar from '../components/Sidebar';
import PreguntaModal from '../components/PreguntaModal';
import MateriaModal from '../components/MateriaModal';
import CargaEstudiantesModal from '../components/CargaEstudiantesModal';
import { withAuth } from '../hocs/withAuth';
import { withRole } from '../hocs/withRole';

function DocenteAdminViewBase() {
  const navigate = useNavigate();
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const setMateriaActiva = useCourseStore((state) => state.setMateriaActiva);
  const semanaSeleccionadaId = useCourseStore((state) => state.semanaSeleccionadaId);
  const preguntasMap = useCourseStore((state) => state.preguntasMap);
  const cargarPreguntasFromService = useCourseStore((state) => state.cargarPreguntasFromService);
  const cargarReportesFromService = useCourseStore((state) => state.cargarReportesFromService);
  const reportes = useCourseStore((state) => state.reportes);
  const themeMode = useCourseStore((state) => state.themeMode);

  const [modalPreguntaAbierto, setModalPreguntaAbierto] = useState(false);
  const [modalMateriaAbierto, setModalMateriaAbierto] = useState(false);
  const [preguntaAEditar, setPreguntaAEditar] = useState(null);

  const esLight = themeMode === 'light';

  const acentoCian = esLight ? 'text-sky-700' : 'text-[#38bdf8]';
  const acentoEsmeralda = esLight ? 'text-emerald-700' : 'text-emerald-400';
  const acentoRojo = esLight ? 'text-red-700' : 'text-red-400';
  const textoSecundario = esLight ? 'text-slate-600' : 'text-slate-400';

  const [modalCargaAbierto, setModalCargaAbierto] = useState(false);
  const [materiaParaCarga, setMateriaParaCarga] = useState(null);

  useEffect(() => {
    if (semanaSeleccionadaId) {
      cargarPreguntasFromService(semanaSeleccionadaId);
    }
  }, [semanaSeleccionadaId, cargarPreguntasFromService]);

  useEffect(() => {
    cargarReportesFromService();
  }, [cargarReportesFromService]);

  const materiaActiva = materias.find(m => m.id === materiaActivaId) || materias[0];

  const handleAbrirMateria = (materiaId) => {
    setMateriaActiva(materiaId);
    navigate('/material_apoyo');
  };

  const handleAbrirGestionContenido = (e, m) => {
    e.stopPropagation();
    setMateriaActiva(m.id);
    navigate('/materias/contenido');
  };

  const handleAbrirCargaEstudiantes = (e, m) => {
    e.stopPropagation();
    setMateriaParaCarga(m);
    setModalCargaAbierto(true);
  };

  return (
    <div className="h-full w-full flex gap-6 items-start overflow-hidden">
      {/* SIDEBAR UNIFICADO */}
      <Sidebar />

      {/* ÁREA PRINCIPAL ADMINISTRATIVA EN PANTALLA ÚNICA (SIN SCROLLBAR) */}
      <main className="flex-1 flex flex-col justify-start gap-4 h-full w-full overflow-hidden">

        {/* 1. HEADER SECCIÓN MATERIAS DEL SEMESTRE */}
        <div className="flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Materias del Semestre ({materias.length})</h2>
            <p className={`text-xs mt-0.5 ${textoSecundario}`}>
              Administra el contenido de cada materia o súbelo como temática nueva.
            </p>
          </div>

          <button
            onClick={() => setModalMateriaAbierto(true)}
            className="px-4 py-2 rounded-xl bg-[#38bdf8] text-black font-extrabold text-xs hover:bg-sky-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Agregar Materia</span>
          </button>
        </div>

        {materias.length === 0 && (
          <div className={`p-8 text-center rounded-2xl border shrink-0 ${
            esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}>
            <span className="material-symbols-outlined text-4xl block mb-2">folder_off</span>
            Aún no administras ninguna materia. Usa "+ Agregar Materia" para crear la primera.
          </div>
        )}

        {/* 2. GRID TARJETAS DE MATERIAS CON GESTOR DE CONTENIDO INTEGRADO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          {materias.map((m) => {
            const esActiva = m.id === materiaActivaId;
            return (
              <div
                key={m.id}
                onClick={() => handleAbrirMateria(m.id)}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative group ${
                  esActiva
                    ? esLight
                      ? 'bg-sky-50/90 border-sky-400 shadow-sm ring-2 ring-sky-500/20'
                      : 'bg-slate-900 border-[#38bdf8] shadow-md ring-2 ring-[#38bdf8]/30'
                    : esLight
                    ? 'bg-white border-slate-300 hover:border-slate-400 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                {/* Fila Superior: Título y Subtítulo */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="text-sm font-bold leading-snug">
                      {m.nombre}
                    </h3>
                    <p className={`text-[11px] mt-0.5 font-mono ${textoSecundario}`}>
                      [{m.codigo}] {m.semestre || '2026-1'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                    esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}>
                    {m.numeroSemanas || m.semanasCount || 16} Semanas
                  </span>
                </div>

                {/* Subtítulo descriptor */}
                <p className={`text-xs my-2.5 line-clamp-2 leading-snug ${textoSecundario}`}>
                  {m.descripcion || m.subtitulo || 'Material pedagógico de la asignatura.'}
                </p>

                {/* BOTONES DE ACCIÓN: ADMINISTRAR CONTENIDO Y ABRIR MATERIAL */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-700/30">
                  <button
                    onClick={(e) => handleAbrirGestionContenido(e, m)}
                    className="w-full py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[11px] hover:bg-amber-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Subir o editar el contenido/temática de la materia por semana"
                  >
                    <span className="material-symbols-outlined text-sm">upload_file</span>
                    <span>Administrar Contenido</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMateriaActiva(m.id);
                      navigate('/usuarios', { state: { pestaña: 'matriculas', materiaId: m.id } });
                    }}
                    className="w-full py-1.5 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 font-extrabold text-[11px] hover:bg-sky-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Ver listado completo de estudiantes matriculados en esta asignatura"
                  >
                    <span className="material-symbols-outlined text-sm">groups</span>
                    <span>Ver Estudiantes Inscritos</span>
                  </button>

                  <button
                    onClick={(e) => handleAbrirCargaEstudiantes(e, m)}
                    className="w-full py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-[11px] hover:bg-emerald-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Cargar estudiantes por bloque desde una lista (cédula, nombre, correo)"
                  >
                    <span className="material-symbols-outlined text-sm">group_add</span>
                    <span>Cargar Estudiantes</span>
                  </button>

                  <button
                    onClick={() => handleAbrirMateria(m.id)}
                    className={`w-full py-1.5 rounded-lg font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm ${
                      esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">auto_stories</span>
                    <span>Ver Material →</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. RESUMEN DE REPORTES DOCENTES */}
        <div className={`p-4 rounded-xl border flex flex-col gap-3 ${
          esLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900/80 border-slate-800 shadow-sm'
        }`}>
          <div className="flex justify-between items-center border-b border-slate-700/40 pb-2">
            <div>
              <h3 className="text-sm font-bold">Métrica y Reporte de Asignaturas</h3>
              <p className={`text-xs font-mono ${textoSecundario}`}>Asignatura activa: [{materiaActiva?.codigo}] {materiaActiva?.nombre}</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <span className={acentoEsmeralda}>✓ Evaluaciones: {reportes.totalEvaluaciones}</span>
              <span className={acentoCian}>★ Aprobados: {reportes.aprobadosCount}</span>
              <span className={acentoRojo}>⚠ Infracciones: {reportes.infraccionesCount}</span>
            </div>
          </div>
        </div>

      </main>

      {/* MODAL AGREGAR MATERIA */}
      <MateriaModal
        isOpen={modalMateriaAbierto}
        onClose={() => setModalMateriaAbierto(false)}
      />

      {/* MODAL CARGA MASIVA DE ESTUDIANTES */}
      <CargaEstudiantesModal
        isOpen={modalCargaAbierto}
        materia={materiaParaCarga}
        onClose={() => {
          setModalCargaAbierto(false);
          setMateriaParaCarga(null);
        }}
      />
    </div>
  );
}

export default withAuth(withRole(DocenteAdminViewBase, ['DOCENTE']));
