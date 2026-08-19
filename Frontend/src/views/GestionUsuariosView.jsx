import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourseStore } from '../store/useCourseStore';
import { usuariosService } from '../services/usuarios.service';
import { estudiantesService } from '../services/estudiantes.service';
import { withRole } from '../hocs/withRole';
import Sidebar from '../components/Sidebar';
import CargaEstudiantesModal from '../components/CargaEstudiantesModal';

function GestionUsuariosView() {
  const location = useLocation();
  const { usuario, esSuperusuario } = useAuth();
  const themeMode = useCourseStore((state) => state.themeMode);
  const materias = useCourseStore((state) => state.materias);
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);

  const esLight = themeMode === 'light';

  // Estilos adaptativos
  const textoTitulo = esLight ? 'text-slate-900' : 'text-white';
  const textoSub = esLight ? 'text-slate-700' : 'text-slate-300';
  const textoMuted = esLight ? 'text-slate-500' : 'text-slate-400';
  const acentoCian = esLight ? 'text-sky-700 font-bold' : 'text-[#38bdf8] font-bold';

  const [pestañaActiva, setPestañaActiva] = useState(
    location.state?.pestaña || (esSuperusuario ? 'superusuarios' : 'estudiantes')
  );

  // Estado Usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [filtroRol, setFiltroRol] = useState('TODOS');
  const [filtroMateriaId, setFiltroMateriaId] = useState('TODAS');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');

  // Modal Crear/Editar Usuario
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null); // null para nuevo
  const [formUsuario, setFormUsuario] = useState({ nombre: '', email: '', documentoIdentidad: '', password: '', rol: 'DOCENTE', materiaIds: [] });
  const [mostrarPasswordModal, setMostrarPasswordModal] = useState(false);
  const [guardandoUsuario, setGuardandoUsuario] = useState(false);
  const [errorModalUsuario, setErrorModalUsuario] = useState('');

  // Estado Matrículas / Estudiantes por Materia
  const [materiaSeleccionadaId, setMateriaSeleccionadaId] = useState(
    location.state?.materiaId || materiaActivaId || materias[0]?.id || 1
  );
  const [estudiantesMateria, setEstudiantesMateria] = useState([]);
  const [cargandoEstudiantes, setCargandoEstudiantes] = useState(false);
  const [formInscribir, setFormInscribir] = useState({ email: '' });
  const [guardandoInscripcion, setGuardandoInscripcion] = useState(false);
  const [modalCargaMasivaAbierto, setModalCargaMasivaAbierto] = useState(false);
  const [mensajeInscripcion, setMensajeInscripcion] = useState({ tipo: '', texto: '' });

  // Listas clasificadas por rol
  const docentes = usuarios.filter((u) => u.rol === 'DOCENTE');
  const estudiantes = usuarios.filter((u) => u.rol === 'ESTUDIANTE');
  const superusuarios = usuarios.filter((u) => u.rol === 'SUPERUSUARIO');

  // Cargar lista de usuarios
  const cargarUsuarios = useCallback(async () => {
    setCargandoUsuarios(true);
    try {
      const data = await usuariosService.getUsuarios();
      setUsuarios(data || []);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    } finally {
      setCargandoUsuarios(false);
    }
  }, []);

  // Cargar estudiantes de la materia seleccionada
  const cargarEstudiantesDeMateria = useCallback(async (mId) => {
    if (!mId) return;
    setCargandoEstudiantes(true);
    try {
      const data = await estudiantesService.getEstudiantes(mId);
      setEstudiantesMateria(data || []);
    } catch (err) {
      console.error('Error cargando estudiantes de materia:', err);
      setEstudiantesMateria([]);
    } finally {
      setCargandoEstudiantes(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  useEffect(() => {
    if (materiaSeleccionadaId) {
      cargarEstudiantesDeMateria(materiaSeleccionadaId);
    }
  }, [materiaSeleccionadaId, cargarEstudiantesDeMateria]);

  // Manejador Guardar Usuario (Crear o Modificar)
  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    setErrorModalUsuario('');
    if (!formUsuario.nombre.trim() || !formUsuario.email.trim()) {
      setErrorModalUsuario('Nombre y correo son requeridos');
      return;
    }
    if (!usuarioEditar && !formUsuario.password.trim()) {
      setErrorModalUsuario('La contraseña es requerida para nuevos usuarios');
      return;
    }

    setGuardandoUsuario(true);
    try {
      if (usuarioEditar) {
        await usuariosService.actualizarUsuario(usuarioEditar.id, {
          nombre: formUsuario.nombre,
          email: formUsuario.email,
          documentoIdentidad: formUsuario.documentoIdentidad,
          rol: formUsuario.rol,
          password: formUsuario.password || undefined,
          materiaIds: formUsuario.materiaIds,
        });
      } else {
        await usuariosService.crearUsuario({
          nombre: formUsuario.nombre,
          email: formUsuario.email,
          documentoIdentidad: formUsuario.documentoIdentidad,
          password: formUsuario.password,
          rol: formUsuario.rol,
          materiaIds: formUsuario.materiaIds,
        });
        if (formUsuario.rol === 'DOCENTE') {
          setMensajeInscripcion({
            tipo: 'exito',
            texto: `✔ Docente ${formUsuario.nombre} creado. ¿Ir a gestor de materias?`
          });
        }
      }
      setModalUsuarioAbierto(false);
      setFormUsuario({ nombre: '', email: '', documentoIdentidad: '', password: '', rol: 'DOCENTE', materiaIds: [] });
      setUsuarioEditar(null);
      await cargarUsuarios();
    } catch (err) {
      setErrorModalUsuario(err?.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setGuardandoUsuario(false);
    }
  };

  // Manejador Eliminar Usuario
  const handleEliminarUsuario = async (u) => {
    if (!window.confirm(`¿Estás seguro de eliminar el usuario "${u.nombre}" (${u.email})?`)) return;
    try {
      await usuariosService.eliminarUsuario(u.id);
      await cargarUsuarios();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  // Manejador Inscribir Estudiante individual
  const handleInscribirEstudiante = async (e) => {
    e.preventDefault();
    setMensajeInscripcion({ tipo: '', texto: '' });
    if (!formInscribir.email.trim()) {
      setMensajeInscripcion({ tipo: 'error', texto: 'Ingresa un correo registrado' });
      return;
    }

    setGuardandoInscripcion(true);
    try {
      await usuariosService.inscribirEstudiante(materiaSeleccionadaId, { email: formInscribir.email.trim() });
      setFormInscribir({ email: '' });
      setMensajeInscripcion({ tipo: 'exito', texto: 'Estudiante matriculado con éxito' });
      await cargarEstudiantesDeMateria(materiaSeleccionadaId);
    } catch (err) {
      setMensajeInscripcion({ tipo: 'error', texto: err?.response?.data?.message || 'Error al matricular el estudiante' });
    } finally {
      setGuardandoInscripcion(false);
    }
  };

  // Manejador Desmatricular Estudiante
  const handleDesmatricularEstudiante = async (est) => {
    if (!window.confirm(`¿Retirar matrícula de "${est.nombre}" en esta asignatura?`)) return;
    try {
      await usuariosService.eliminarInscripcion(materiaSeleccionadaId, est.id);
      await cargarEstudiantesDeMateria(materiaSeleccionadaId);
    } catch (err) {
      alert(err?.response?.data?.message || 'Error al retirar la matrícula');
    }
  };

  // Filtrado dinámico según la pestaña activa y materia asignada
  const getUsuariosFiltrados = () => {
    let base = usuarios;
    if (pestañaActiva === 'docentes') base = docentes;
    else if (pestañaActiva === 'estudiantes') base = estudiantes;
    else if (pestañaActiva === 'superusuarios') base = superusuarios;
    else if (pestañaActiva === 'todos' && filtroRol !== 'TODOS') {
      base = usuarios.filter((u) => u.rol === filtroRol);
    }

    // Filtrar por Materia Asignada
    if (filtroMateriaId === 'SIN_MATERIA') {
      base = base.filter((u) => !u.materiasAsignadas || u.materiasAsignadas.length === 0);
    } else if (filtroMateriaId !== 'TODAS') {
      const mid = Number(filtroMateriaId);
      base = base.filter((u) =>
        u.materiasAsignadas && u.materiasAsignadas.some((m) => m.id === mid)
      );
    }

    const q = busquedaUsuario.toLowerCase();
    if (!q) return base;
    return base.filter(
      (u) =>
        u.nombre.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.documentoIdentidad && u.documentoIdentidad.toLowerCase().includes(q))
    );
  };

  const usuariosFiltrados = getUsuariosFiltrados();
  const materiaObj = materias.find((m) => m.id === Number(materiaSeleccionadaId)) || materias[0];

  const getRolPorPestaña = () => {
    if (pestañaActiva === 'docentes') return 'DOCENTE';
    if (pestañaActiva === 'estudiantes') return 'ESTUDIANTE';
    if (pestañaActiva === 'superusuarios') return 'SUPERUSUARIO';
    return 'DOCENTE';
  };

  const getTituloBotonAlta = () => {
    if (pestañaActiva === 'docentes') return '+ Registrar Docente';
    if (pestañaActiva === 'estudiantes') return '+ Registrar Estudiante';
    if (pestañaActiva === 'superusuarios') return '+ Registrar Superusuario';
    return '+ Registrar Usuario';
  };

  return (
    <div className="h-full w-full flex gap-6 items-start overflow-hidden">
      {/* SIDEBAR UNIFICADO */}
      <Sidebar />

      <div className="flex-1 flex flex-col justify-start h-full overflow-y-auto space-y-4 pr-1">
      {/* HEADER DE LA VISTA */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b pb-4 border-slate-500/20">
        <div>
          <div className={`text-xs font-mono font-bold uppercase tracking-widest ${acentoCian}`}>
            ADMINISTRACIÓN CENTRAL DEL SISTEMA
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${textoTitulo}`}>
            Gestión de Usuarios y Matrículas
          </h1>
        </div>

        {/* NAVEGACIÓN ENTRE PESTAÑAS ORGANIZADAS JERÁRQUICAMENTE */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-500/10 border border-slate-500/20">
          {/* 1. SUPERUSUARIOS (SOLO VISIBLE PARA PERFIL SUPERUSUARIO) */}
          {esSuperusuario && (
            <button
              onClick={() => setPestañaActiva('superusuarios')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                pestañaActiva === 'superusuarios'
                  ? esLight
                    ? 'bg-sky-700 text-white shadow-md'
                    : 'bg-[#38bdf8] text-slate-950 font-extrabold shadow-md'
                  : textoMuted
              }`}
            >
              <span className="material-symbols-outlined text-base">shield</span>
              Superusuarios ({superusuarios.length})
            </button>
          )}

          {/* 2. DOCENTES */}
          <button
            onClick={() => setPestañaActiva('docentes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              pestañaActiva === 'docentes'
                ? esLight
                  ? 'bg-sky-700 text-white shadow-md'
                  : 'bg-[#38bdf8] text-slate-950 font-extrabold shadow-md'
                : textoMuted
            }`}
          >
            <span className="material-symbols-outlined text-base">badge</span>
            Docentes ({docentes.length})
          </button>

          {/* 3. ESTUDIANTES / USUARIOS */}
          <button
            onClick={() => setPestañaActiva('estudiantes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              pestañaActiva === 'estudiantes'
                ? esLight
                  ? 'bg-sky-700 text-white shadow-md'
                  : 'bg-[#38bdf8] text-slate-950 font-extrabold shadow-md'
                : textoMuted
            }`}
          >
            <span className="material-symbols-outlined text-base">person</span>
            Estudiantes / Usuarios ({estudiantes.length})
          </button>

          {/* 4. TODOS */}
          <button
            onClick={() => setPestañaActiva('todos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              pestañaActiva === 'todos'
                ? esLight
                  ? 'bg-sky-700 text-white shadow-md'
                  : 'bg-[#38bdf8] text-slate-950 font-extrabold shadow-md'
                : textoMuted
            }`}
          >
            <span className="material-symbols-outlined text-base">groups</span>
            Todos ({usuarios.length})
          </button>

          {/* 5. ESTUDIANTES ↔ MATERIAS */}
          <button
            onClick={() => setPestañaActiva('matriculas')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              pestañaActiva === 'matriculas'
                ? esLight
                  ? 'bg-sky-700 text-white shadow-md'
                  : 'bg-[#38bdf8] text-slate-950 font-extrabold shadow-md'
                : textoMuted
            }`}
          >
            <span className="material-symbols-outlined text-base">school</span>
            Estudiantes ↔ Materias
          </button>
        </div>
      </div>

      {/* SECCIÓN DE USUARIOS (DOCENTES, ESTUDIANTES, SUPERUSUARIOS, TODOS) */}
      {pestañaActiva !== 'matriculas' && (
        <div className="space-y-4">
          {/* BARRA DE FILTROS Y ACCIÓN DE ALTA */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre, correo o documento..."
                value={busquedaUsuario}
                onChange={(e) => setBusquedaUsuario(e.target.value)}
                className={`px-3 py-2 text-xs border rounded-xl outline-none w-full sm:w-72 ${
                  esLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-900/80 text-white border-slate-700'
                }`}
              />

              {pestañaActiva === 'todos' && (
                <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value)}
                  className={`px-3 py-2 text-xs border rounded-xl outline-none font-bold ${
                    esLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-900/80 text-white border-slate-700'
                  }`}
                >
                  <option value="TODOS">Todos los roles</option>
                  {esSuperusuario && <option value="SUPERUSUARIO">Superusuarios</option>}
                  <option value="DOCENTE">Docentes</option>
                  <option value="ESTUDIANTE">Estudiantes</option>
                </select>
              )}

              {/* Filtro por Materia Asignada */}
              <select
                value={filtroMateriaId}
                onChange={(e) => setFiltroMateriaId(e.target.value)}
                className={`px-3 py-2 text-xs border rounded-xl outline-none font-bold ${
                  esLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-900/80 text-white border-slate-700'
                }`}
                title="Organizar y filtrar usuarios por materia asignada"
              >
                <option value="TODOS">Todas las materias</option>
                {materias.map((m) => (
                  <option key={m.id} value={m.id}>
                    Materia: {m.nombre}
                  </option>
                ))}
                <option value="SIN_MATERIA">Sin materias asignadas</option>
              </select>
            </div>

            <button
              onClick={() => {
                setUsuarioEditar(null);
                setFormUsuario({ nombre: '', email: '', documentoIdentidad: '', password: '', rol: getRolPorPestaña(), materiaIds: [] });
                setErrorModalUsuario('');
                setMostrarPasswordModal(false);
                setModalUsuarioAbierto(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              {getTituloBotonAlta()}
            </button>
          </div>

          {/* TABLA DE USUARIOS */}
          <div className={`rounded-2xl border overflow-hidden shadow-xl ${
            esLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b font-mono uppercase tracking-wider ${
                    esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    <th className="p-3">ID</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Correo Electrónico</th>
                    <th className="p-3">Rol</th>
                    <th className="p-3">Documento</th>
                    <th className="p-3">Materias (Cargo / Inscritas)</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/10">
                  {cargandoUsuarios ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 font-mono">
                        Cargando usuarios registrados...
                      </td>
                    </tr>
                  ) : usuariosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 font-mono">
                        No se encontraron usuarios con los criterios ingresados.
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="p-3 font-mono font-bold">{u.id}</td>
                        <td className={`p-3 font-bold ${textoTitulo}`}>{u.nombre}</td>
                        <td className={`p-3 ${textoSub}`}>{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                            u.rol === 'SUPERUSUARIO'
                              ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                              : u.rol === 'DOCENTE'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                          }`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className={`p-3 font-mono ${textoMuted}`}>{u.documentoIdentidad || 'N/A'}</td>
                        <td className="p-3">
                          {u.materiasAsignadas && u.materiasAsignadas.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {u.materiasAsignadas.map((m) => (
                                <button
                                  key={m.id}
                                  onClick={() => setFiltroMateriaId(m.id)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border hover:opacity-80 cursor-pointer transition-all ${
                                    u.rol === 'DOCENTE'
                                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  }`}
                                  title={`Filtrar tabla por asignatura ${m.nombre}`}
                                >
                                  {m.nombre}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] italic text-amber-500/80">
                              {u.rol === 'ESTUDIANTE' ? 'Sin materias inscritas' : 'Sin materias asignadas'}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setUsuarioEditar(u);
                                  setFormUsuario({
                                    nombre: u.nombre,
                                    email: u.email,
                                    documentoIdentidad: u.documentoIdentidad || '',
                                    password: '',
                                    rol: u.rol,
                                    materiaIds: (u.materiasAsignadas || []).map((m) => m.id),
                                  });
                                  setErrorModalUsuario('');
                                  setMostrarPasswordModal(false);
                                  setModalUsuarioAbierto(true);
                                }}
                                className="p-1.5 rounded-lg border border-slate-500/30 text-slate-400 hover:text-sky-400 hover:border-sky-500/50 cursor-pointer"
                                title="Modificar usuario y asignación de materias"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>
                              {u.id !== usuario?.id && (
                                <button
                                  onClick={() => handleEliminarUsuario(u)}
                                  className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                                  title="Eliminar usuario"
                                >
                                  <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: MATRÍCULAS Y RELACIÓN ESTUDIANTES ↔ MATERIAS */}
      {pestañaActiva === 'matriculas' && (
        <div className="space-y-4">
          {/* SELECTOR DE MATERIA Y ACCIÓN CARGA MASIVA */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold ${textoMuted}`}>Seleccionar Asignatura:</span>
              <select
                value={materiaSeleccionadaId}
                onChange={(e) => setMateriaSeleccionadaId(Number(e.target.value))}
                className={`px-3 py-2 text-xs border rounded-xl outline-none font-bold ${
                  esLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-900/80 text-white border-slate-700'
                }`}
              >
                {materias.map((m) => (
                  <option key={m.id} value={m.id}>
                    [{m.codigo}] {m.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setModalCargaMasivaAbierto(true)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                esLight ? 'bg-sky-700 text-white hover:bg-sky-800' : 'bg-[#38bdf8] text-slate-950 hover:bg-[#0ea5e9]'
              }`}
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              Cargar Estudiantes por Bloque (Masivo)
            </button>
          </div>

          {/* FORMULARIO DE INSCRIPCIÓN INDIVIDUAL */}
          <div className={`p-4 rounded-2xl border shadow-xl ${
            esLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <h3 className={`text-xs font-mono font-bold uppercase mb-2 ${acentoCian}`}>
              Asociar Estudiante a [{materiaObj?.codigo}] {materiaObj?.nombre}
            </h3>
            <form onSubmit={handleInscribirEstudiante} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="email"
                placeholder="Correo registrado del estudiante (ej: estudiante@unicauca.edu.co)..."
                value={formInscribir.email}
                onChange={(e) => setFormInscribir({ email: e.target.value })}
                className={`px-3 py-2 text-xs border rounded-xl outline-none flex-1 ${
                  esLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-700'
                }`}
              />
              <button
                type="submit"
                disabled={guardandoInscripcion}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  esLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-black hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined text-base">person_add</span>
                {guardandoInscripcion ? 'Matriculando...' : 'Matricular Estudiante'}
              </button>
            </form>

            {mensajeInscripcion.texto && (
              <p className={`text-xs mt-2 font-mono font-bold ${
                mensajeInscripcion.tipo === 'exito' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {mensajeInscripcion.texto}
              </p>
            )}
          </div>

          {/* TABLA DE ESTUDIANTES MATRICULADOS */}
          <div className={`rounded-2xl border overflow-hidden shadow-xl ${
            esLight ? 'bg-white/90 border-slate-300' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="p-3 border-b border-slate-500/10 flex justify-between items-center">
              <span className={`text-xs font-mono font-bold ${textoTitulo}`}>
                Estudiantes Inscritos ({estudiantesMateria.length})
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className={`border-b font-mono uppercase tracking-wider ${
                    esLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}>
                    <th className="p-3">Documento</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Correo Electrónico</th>
                    <th className="p-3">Fecha de Matrícula</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/10">
                  {cargandoEstudiantes ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-mono">
                        Cargando estudiantes matriculados...
                      </td>
                    </tr>
                  ) : estudiantesMateria.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400 font-mono">
                        Aún no hay estudiantes matriculados en esta asignatura. Usa la carga masiva o ingresa el correo arriba.
                      </td>
                    </tr>
                  ) : (
                    estudiantesMateria.map((est) => (
                      <tr key={est.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="p-3 font-mono font-bold">{est.documentoIdentidad || 'N/A'}</td>
                        <td className={`p-3 font-bold ${textoTitulo}`}>{est.nombre}</td>
                        <td className={`p-3 ${textoSub}`}>{est.email}</td>
                        <td className={`p-3 font-mono ${textoMuted}`}>
                          {est.inscritoEn ? new Date(est.inscritoEn).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDesmatricularEstudiante(est)}
                            className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
                            title="Retirar matrícula de la asignatura"
                          >
                            <span className="material-symbols-outlined text-base">person_remove</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR USUARIO */}
      {modalUsuarioAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
            esLight ? 'bg-white text-slate-900 border-slate-300' : 'bg-slate-900 text-white border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-500/20">
              <h3 className="text-lg font-bold">
                {usuarioEditar ? 'Modificar Usuario' : 'Registrar Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setModalUsuarioAbierto(false)}
                className="text-slate-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardarUsuario} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono mb-1 font-bold">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={formUsuario.nombre}
                  onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
                  placeholder="Ej: Ing. María Pérez"
                  className={`w-full px-3 py-2 border rounded-xl outline-none ${
                    esLight ? 'bg-slate-50 text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block font-mono mb-1 font-bold">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={formUsuario.email}
                  onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })}
                  placeholder="ejemplo@unicauca.edu.co"
                  className={`w-full px-3 py-2 border rounded-xl outline-none ${
                    esLight ? 'bg-slate-50 text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block font-mono mb-1 font-bold">Documento / Identificación</label>
                <input
                  type="text"
                  value={formUsuario.documentoIdentidad}
                  onChange={(e) => setFormUsuario({ ...formUsuario, documentoIdentidad: e.target.value })}
                  placeholder="Ej: 104726011638 / Cédula / Código"
                  className={`w-full px-3 py-2 border rounded-xl outline-none ${
                    esLight ? 'bg-slate-50 text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block font-mono mb-1 font-bold">
                  Contraseña {usuarioEditar ? '(Opcional, dejar en blanco para conservar)' : '(Requerida)'}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={mostrarPasswordModal ? 'text' : 'password'}
                    value={formUsuario.password}
                    onChange={(e) => setFormUsuario({ ...formUsuario, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full px-3 py-2 pr-10 border rounded-xl outline-none ${
                      esLight ? 'bg-slate-50 text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-700'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPasswordModal(!mostrarPasswordModal)}
                    className="absolute right-3 p-1 text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
                    title={mostrarPasswordModal ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <span className="material-symbols-outlined text-base">
                      {mostrarPasswordModal ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono mb-1 font-bold">Rol en el Sistema</label>
                <select
                  value={formUsuario.rol}
                  onChange={(e) => setFormUsuario({
                    ...formUsuario,
                    rol: e.target.value,
                    // Un SUPERUSUARIO o ESTUDIANTE nunca debe quedar como dueño de materias.
                    materiaIds: (e.target.value === 'DOCENTE' || e.target.value === 'SUPERUSUARIO') ? formUsuario.materiaIds : []
                  })}
                  className={`w-full px-3 py-2 border rounded-xl outline-none font-bold ${
                    esLight ? 'bg-slate-50 text-slate-900 border-slate-300' : 'bg-slate-950 text-white border-slate-700'
                  }`}
                >
                  {esSuperusuario && <option value="SUPERUSUARIO">SUPERUSUARIO</option>}
                  <option value="DOCENTE">DOCENTE</option>
                  <option value="ESTUDIANTE">ESTUDIANTE</option>
                </select>
              </div>

              {formUsuario.rol === 'DOCENTE' && (
                <div>
                  <label className="block font-mono mb-1 font-bold">Materias a Cargo</label>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl border ${
                    esLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
                  }`}>
                    {materias.map((m) => {
                      const estaSeleccionada = (formUsuario.materiaIds || []).includes(m.id);
                      return (
                        <label key={m.id} className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-100">
                          <input
                            type="checkbox"
                            checked={estaSeleccionada}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormUsuario((prev) => {
                                const actual = prev.materiaIds || [];
                                const nuevos = checked
                                  ? [...actual, m.id]
                                  : actual.filter((id) => id !== m.id);
                                return { ...prev, materiaIds: nuevos };
                              });
                            }}
                            className="accent-sky-500 cursor-pointer h-4 w-4 rounded"
                          />
                          <span className="font-bold">[{m.codigo}] {m.nombre}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {errorModalUsuario && (
                <p className="text-red-400 font-mono font-bold">{errorModalUsuario}</p>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-500/20">
                <button
                  type="button"
                  onClick={() => setModalUsuarioAbierto(false)}
                  className="px-4 py-2 rounded-xl border border-slate-500/30 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoUsuario}
                  className={`px-4 py-2 rounded-xl font-bold cursor-pointer ${
                    esLight ? 'bg-sky-700 text-white hover:bg-sky-800' : 'bg-[#38bdf8] text-slate-950 hover:bg-[#0ea5e9]'
                  }`}
                >
                  {guardandoUsuario ? 'Guardando...' : 'Guardar Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CARGA MASIVA ESTUDIANTES */}
      <CargaEstudiantesModal
        isOpen={modalCargaMasivaAbierto}
        onClose={() => {
          setModalCargaMasivaAbierto(false);
          cargarUsuarios();
          cargarEstudiantesDeMateria(materiaSeleccionadaId);
        }}
        materiaId={materiaSeleccionadaId}
      />
      </div>
    </div>
  );
}

export default withRole(GestionUsuariosView, ['SUPERUSUARIO', 'DOCENTE']);
