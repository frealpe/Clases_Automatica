import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollVideo from './components/ScrollVideo';
import MisMateriasView from './views/MisMateriasView';
import DocenteAdminView from './views/DocenteAdminView';
import EstudianteView from './views/EstudianteView';
import MaterialApoyoView from './views/MaterialApoyoView';
import GestionContenidoView from './views/GestionContenidoView';
import GestionUsuariosView from './views/GestionUsuariosView';
import ExamenesCalendarioView from './views/ExamenesCalendarioView';
import { useCourseStore } from './store/useCourseStore';

export default function App() {
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const themeMode = useCourseStore((state) => state.themeMode);
  const tokenJWT = useCourseStore((state) => state.tokenJWT);
  const cargarMateriasFromService = useCourseStore((state) => state.cargarMateriasFromService);
  const cargarSemanasFromService = useCourseStore((state) => state.cargarSemanasFromService);

  const location = useLocation();
  const esVistaProyectos = location.pathname.startsWith('/labor') ||
                           location.pathname.startsWith('/materias') ||
                           location.pathname.startsWith('/material_apoyo') ||
                           location.pathname.startsWith('/usuarios');

  useEffect(() => {
    document.body.className = themeMode === 'light' ? 'light-mode overflow-hidden' : 'dark-mode overflow-hidden';
  }, [themeMode]);

  useEffect(() => {
    // GET /materias ahora exige sesión (se filtra por rol en el backend); sin token, la landing
    // pública (/) sigue mostrando las materias de ejemplo ya presentes en el store.
    if (tokenJWT) {
      cargarMateriasFromService();
    }
  }, [tokenJWT, cargarMateriasFromService]);

  useEffect(() => {
    cargarSemanasFromService(materiaActivaId);
  }, [cargarSemanasFromService, materiaActivaId]);

  const esLight = themeMode === 'light';

  return (
    <div className={`relative h-screen w-screen overflow-hidden font-sans antialiased transition-colors duration-300 ${
      esLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0a0a] text-white selection:bg-white/20'
    }`}>
      {/* Background 3D Scroll Video (SE OCULTA EN VISTAS DE APPLICACIÓN / ADMIN) */}
      {!esLight && !esVistaProyectos && <ScrollVideo />}

      {/* Content Wrapper estricto sin scrollbar vertical */}
      <div className="relative z-10 flex flex-col h-full w-full overflow-hidden">
        <Navbar />
        <main className={`flex-1 w-full overflow-hidden ${esVistaProyectos ? 'px-4 pt-20 pb-3' : 'max-w-[1600px] mx-auto px-4 pt-20 pb-2'}`}>
          <Routes>
            <Route path="/" element={<EstudianteView />} />
            <Route path="/labor" element={<MisMateriasView />} />
            <Route path="/materias" element={<DocenteAdminView />} />
            <Route path="/materias/contenido" element={<GestionContenidoView />} />
            <Route path="/materias/examenes" element={<ExamenesCalendarioView />} />
            <Route path="/usuarios" element={<GestionUsuariosView />} />
            <Route path="/material_apoyo" element={<MaterialApoyoView />} />
            <Route path="/admin" element={<Navigate to="/materias" replace />} />
            <Route path="/proyectos" element={<Navigate to="/labor" replace />} />
            <Route path="/asignaturas" element={<Navigate to="/labor" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
