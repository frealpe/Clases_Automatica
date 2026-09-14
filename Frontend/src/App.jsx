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
import EvaluacionQuicesView from './views/EvaluacionQuicesView';
import { useCourseStore } from './store/useCourseStore';

export default function App() {
  const materiaActivaId = useCourseStore((state) => state.materiaActivaId);
  const themeMode = useCourseStore((state) => state.themeMode);
  const tokenJWT = useCourseStore((state) => state.tokenJWT);
  const cargarMateriasFromService = useCourseStore((state) => state.cargarMateriasFromService);
  const cargarSemanasFromService = useCourseStore((state) => state.cargarSemanasFromService);
  const cargarMateriasPublicasFromService = useCourseStore((state) => state.cargarMateriasPublicasFromService);
  const cargarSemanasPublicasFromService = useCourseStore((state) => state.cargarSemanasPublicasFromService);

  const location = useLocation();
  const esVistaProyectos = location.pathname.startsWith('/labor') ||
                           location.pathname.startsWith('/materias') ||
                           location.pathname.startsWith('/material_apoyo') ||
                           location.pathname.startsWith('/usuarios');

  useEffect(() => {
    document.body.className = themeMode === 'light' ? 'light-mode min-h-screen' : 'dark-mode min-h-screen';
  }, [themeMode]);

  useEffect(() => {
    if (tokenJWT) {
      cargarMateriasFromService();
    } else {
      // Sin sesión iniciada (visitante público o tras cerrar sesión): el catálogo público
      // reemplaza el fallback local, para que la portada muestre docente + materias reales.
      cargarMateriasPublicasFromService();
    }
  }, [tokenJWT, cargarMateriasFromService, cargarMateriasPublicasFromService]);

  useEffect(() => {
    if (tokenJWT) {
      cargarSemanasFromService(materiaActivaId);
    } else {
      cargarSemanasPublicasFromService(materiaActivaId);
    }
  }, [cargarSemanasFromService, cargarSemanasPublicasFromService, materiaActivaId, tokenJWT]);

  const esLight = themeMode === 'light';

  return (
    <div className={`relative min-h-screen w-full overflow-y-auto font-sans antialiased transition-colors duration-300 ${
      esLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0a0a] text-white selection:bg-white/20'
    }`}>
      {/* Background 3D Scroll Video */}
      {!esLight && !esVistaProyectos && <ScrollVideo />}

      {/* Content Wrapper Adaptativo a Móviles y Escritorio */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <Navbar />
        <main className={`flex-1 w-full overflow-y-auto ${
          esVistaProyectos ? 'px-2 sm:px-4 pt-16 md:pt-20 pb-4' : 'max-w-[1600px] mx-auto px-2 sm:px-4 pt-16 md:pt-20 pb-4'
        }`}>
          <Routes>
            <Route path="/" element={<EstudianteView />} />
            <Route path="/labor" element={<MisMateriasView />} />
            <Route path="/materias" element={<DocenteAdminView />} />
            <Route path="/materias/contenido" element={<GestionContenidoView />} />
            <Route path="/materias/examenes" element={<ExamenesCalendarioView />} />
            <Route path="/materias/evaluacion-quices" element={<EvaluacionQuicesView />} />
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

