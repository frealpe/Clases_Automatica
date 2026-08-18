import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Text, Alert, Modal, Platform, ScrollView } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import SemanaDetailScreen from './src/screens/SemanaDetailScreen';
import ExamenScreen from './src/screens/ExamenScreen';
import ReporteScreen from './src/screens/ReporteScreen';
import LoginScreen from './src/screens/LoginScreen';
import DocenteDashboardScreen from './src/screens/DocenteDashboardScreen';
import ExamenesProgramadosScreen from './src/screens/ExamenesProgramadosScreen';
import MateriasScreen from './src/screens/MateriasScreen';
import PersonasExamenesScreen from './src/screens/PersonasExamenesScreen';
import { localStorageService } from './src/database/localStorage';
import { apiService } from './src/services/api';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  // 'login' | 'home' | 'detalle' | 'examen' | 'reporte' | 'docente' |
  // 'examenesProgramados' | 'examenProgramado' | 'reporteProgramado' | 'materias' | 'personasExamenes'
  const [pantallaActual, setPantallaActual] = useState('home');
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [preguntasSemana, setPreguntasSemana] = useState([]);
  const [resultadoActual, setResultadoActual] = useState(null);
  const [resultadosGuardados, setResultadosGuardados] = useState({});
  const [examenProgramadoActivo, setExamenProgramadoActivo] = useState(null);
  const [materiaActiva, setMateriaActiva] = useState(null);
  const [tema, setTema] = useState('oscuro'); // 'oscuro' | 'claro'

  const esClaro = tema === 'claro';

  const handleSeleccionarMateria = (materia) => {
    setMateriaActiva(materia);
    setPantallaActual('home');
  };

  const alternarTema = () => {
    setTema((prev) => (prev === 'oscuro' ? 'claro' : 'oscuro'));
  };

  useEffect(() => {
    async function verificarSesion() {
      const user = await localStorageService.getUsuarioActual();
      if (user) {
        setUsuario(user);
        if (user.rol === 'DOCENTE' || user.rol === 'SUPERUSUARIO') {
          setPantallaActual('docente');
        } else {
          setPantallaActual('home');
        }
      } else {
        setPantallaActual('login');
      }
    }
    verificarSesion();
  }, []);

  const handleLoginExitoso = (user) => {
    setUsuario(user);
    if (user.rol === 'DOCENTE' || user.rol === 'SUPERUSUARIO') {
      setPantallaActual('docente');
    } else {
      setPantallaActual('home');
    }
  };

  const handleCerrarSesion = async () => {
    setMenuHamburguesaAbierto(false);
    await localStorageService.cerrarSesion();
    setUsuario(null);
    setPantallaActual('login');
  };

  const seleccionarSemana = async (semana) => {
    setSemanaSeleccionada(semana);
    const preguntas = await apiService.getPreguntasSemana(semana.id);
    setPreguntasSemana(preguntas);
    setPantallaActual('detalle');
  };

  const iniciarExamen = () => {
    if (usuario?.rol === 'DOCENTE' || usuario?.rol === 'SUPERUSUARIO') {
      Alert.alert('Acceso restringido', 'Las evaluaciones están destinadas exclusivamente a los estudiantes.');
      return;
    }
    setPantallaActual('examen');
  };

  const finalizarExamen = async (resultado) => {
    const totalPreguntas = preguntasSemana.length || 1;
    let correctas = 0;
    preguntasSemana.forEach((p) => {
      if (resultado.respuestas[p.id] === p.correcta) {
        correctas += 1;
      }
    });

    const porcentaje = Math.round((correctas / totalPreguntas) * 100);
    const nota5 = ((correctas / totalPreguntas) * 5.0).toFixed(1);
    const aprobado = porcentaje >= 70 && !resultado.infraccionIA;

    const nuevoResultado = {
      ...resultado,
      estudianteId: usuario?.id,
      estudianteNombre: usuario?.nombre,
      semanaId: semanaSeleccionada.id,
      semanaNumero: semanaSeleccionada.numero,
      correctas,
      porcentaje,
      nota5,
      aprobado
    };

    // Registrar en Servidor NestJS y Base de Datos Local
    await apiService.submitEvaluacion(nuevoResultado);

    setResultadoActual(nuevoResultado);
    setResultadosGuardados((prev) => ({
      ...prev,
      [semanaSeleccionada.id]: nuevoResultado
    }));

    setPantallaActual('reporte');
  };

  const volverInicio = () => {
    setSemanaSeleccionada(null);
    setResultadoActual(null);
    if (usuario?.rol === 'DOCENTE' || usuario?.rol === 'SUPERUSUARIO') {
      setPantallaActual('docente');
    } else {
      setPantallaActual('home');
    }
  };

  const abrirExamenesProgramados = () => {
    setPantallaActual('examenesProgramados');
  };

  const presentarExamenProgramado = async (examen) => {
    if (usuario?.rol === 'DOCENTE' || usuario?.rol === 'SUPERUSUARIO') {
      Alert.alert('Acceso restringido', 'Los exámenes programados están destinados exclusivamente a los estudiantes.');
      return;
    }
    try {
      const data = await apiService.getPreguntasExamenProgramado(examen.id);
      setExamenProgramadoActivo({ ...examen, preguntas: data.preguntas, duracionMin: data.duracionMin });
      setPantallaActual('examenProgramado');
    } catch (e) {
      Alert.alert(
        'Examen no disponible',
        e?.response?.data?.mensaje || 'No se pudo cargar el examen. Es posible que la ventana de disponibilidad ya haya cerrado.'
      );
    }
  };

  const finalizarExamenProgramado = async (resultado) => {
    const preguntas = examenProgramadoActivo.preguntas;
    const totalPreguntas = preguntas.length || 1;
    let correctas = 0;
    preguntas.forEach((p) => {
      if (resultado.respuestas[p.id] === p.correcta) correctas += 1;
    });

    const porcentaje = Math.round((correctas / totalPreguntas) * 100);
    const nota5 = ((correctas / totalPreguntas) * 5.0).toFixed(1);
    const aprobado = porcentaje >= 70 && !resultado.infraccionIA;

    const nuevoResultado = {
      ...resultado,
      estudianteId: usuario?.id,
      estudianteNombre: usuario?.nombre,
      examenProgramadoId: examenProgramadoActivo.id,
      correctas,
      porcentaje,
      nota5,
      aprobado
    };

    try {
      await apiService.submitExamenProgramado(examenProgramadoActivo.id, {
        respuestas: resultado.respuestas,
        nota5,
        porcentaje,
        aprobado,
        tiempoEmpleadoSeg: resultado.tiempoEmpleadoSeg,
        infracciones: resultado.infracciones || []
      });
    } catch (e) {
      console.log('Error enviando examen programado al backend:', e);
    }

    setResultadoActual(nuevoResultado);
    setPantallaActual('reporteProgramado');
  };

  if (!usuario || pantallaActual === 'login') {
    return <LoginScreen onLoginExitoso={handleLoginExitoso} />;
  }

  const semanaConPreguntas = semanaSeleccionada
    ? { ...semanaSeleccionada, preguntas: preguntasSemana }
    : null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      {/* Top Bar de Usuario */}
      <View style={styles.userBar}>
        <View style={styles.userBarLeft}>
          <View>
            <Text style={styles.userNameText}>{usuario.nombre}</Text>
            <Text style={styles.userRoleText}>
              Perfil: {usuario.rol === 'DOCENTE' || usuario.rol === 'SUPERUSUARIO' ? '👑 Docente' : '👨‍🎓 Estudiante'}
            </Text>
          </View>
        </View>
        
        <View style={styles.userBarActions}>
          <TouchableOpacity 
            style={[styles.btnTema, esClaro && styles.btnTemaClaro]} 
            onPress={alternarTema}
            activeOpacity={0.7}
          >
            <Text style={[styles.btnTemaText, esClaro && styles.btnTemaTextClaro]}>
              {esClaro ? '🌙 Oscuro' : '☀️ Claro'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSalir} onPress={handleCerrarSesion}>
            <Text style={styles.btnSalirText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RENDERIZADO DE PANTALLAS */}
      {pantallaActual === 'docente' && (
        <DocenteDashboardScreen
          usuario={usuario}
          onVolver={volverInicio}
          onCerrarSesion={handleCerrarSesion}
        />
      )}

      {pantallaActual === 'materias' && (
        <MateriasScreen
          usuario={usuario}
          onVolver={volverInicio}
          onSelectMateria={handleSeleccionarMateria}
        />
      )}

      {pantallaActual === 'personasExamenes' && (
        <PersonasExamenesScreen
          usuario={usuario}
          onVolver={volverInicio}
        />
      )}

      {pantallaActual === 'home' && (
        <HomeScreen
          onSelectSemana={seleccionarSemana}
          resultadosGuardados={resultadosGuardados}
          onVerExamenesProgramados={abrirExamenesProgramados}
          materiaActiva={materiaActiva}
        />
      )}

      {pantallaActual === 'examenesProgramados' && (
        <ExamenesProgramadosScreen
          onPresentar={presentarExamenProgramado}
          onVolver={volverInicio}
        />
      )}

      {pantallaActual === 'examenProgramado' && examenProgramadoActivo && (
        <ExamenScreen
          examenProgramado={examenProgramadoActivo}
          onFinalizarExamen={finalizarExamenProgramado}
          onCancelar={() => setPantallaActual('examenesProgramados')}
        />
      )}

      {pantallaActual === 'reporteProgramado' && examenProgramadoActivo && resultadoActual && (
        <ReporteScreen
          semana={{
            preguntas: examenProgramadoActivo.preguntas,
            ra: examenProgramadoActivo.titulo,
            raDescripcion: `Examen programado — ${(examenProgramadoActivo.semanas || []).map((s) => `Semana ${s.numero}`).join(', ')}`,
            unidadNombre: examenProgramadoActivo.titulo,
            capituloGrossman: 'Examen programado'
          }}
          resultado={resultadoActual}
          onVolverInicio={volverInicio}
          onReintentar={() => setPantallaActual('examenesProgramados')}
        />
      )}

      {pantallaActual === 'detalle' && (
        <SemanaDetailScreen
          semana={semanaConPreguntas}
          onVolver={volverInicio}
          onIniciarExamen={iniciarExamen}
        />
      )}

      {pantallaActual === 'examen' && (
        <ExamenScreen
          semana={semanaConPreguntas}
          onFinalizarExamen={finalizarExamen}
          onCancelar={() => setPantallaActual('detalle')}
        />
      )}

      {pantallaActual === 'reporte' && (
        <ReporteScreen
          semana={semanaConPreguntas}
          resultado={resultadoActual}
          onVolverInicio={volverInicio}
          onReintentar={iniciarExamen}
        />
      )}

      {/* BARRA DE NAVEGACIÓN INFERIOR EN CARRUSEL FLOTANTE GIRATORIO */}
      {pantallaActual !== 'examen' && pantallaActual !== 'examenProgramado' && (
        <View style={styles.bottomTabBarContainer}>
          <ScrollView 
            horizontal={true} 
            showsHorizontalScrollIndicator={false}
            snapToInterval={80}
            decelerationRate="fast"
            contentContainerStyle={styles.bottomTabCarouselContent}
          >
            <TouchableOpacity
              style={[
                styles.bottomTabItem,
                (pantallaActual === 'home' || pantallaActual === 'docente') && styles.bottomTabItemActive
              ]}
              onPress={volverInicio}
              activeOpacity={0.75}
            >
              <Text style={styles.bottomTabIcon}>🏠</Text>
              <Text style={[
                styles.bottomTabText,
                (pantallaActual === 'home' || pantallaActual === 'docente') && styles.bottomTabTextActive
              ]}>
                Inicio
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bottomTabItem,
                pantallaActual === 'materias' && styles.bottomTabItemActive
              ]}
              onPress={() => setPantallaActual('materias')}
              activeOpacity={0.75}
            >
              <Text style={styles.bottomTabIcon}>📚</Text>
              <Text style={[
                styles.bottomTabText,
                pantallaActual === 'materias' && styles.bottomTabTextActive
              ]}>
                Mis Materias
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bottomTabItem,
                pantallaActual === 'personasExamenes' && styles.bottomTabItemActive
              ]}
              onPress={() => setPantallaActual('personasExamenes')}
              activeOpacity={0.75}
            >
              <Text style={styles.bottomTabIcon}>👥</Text>
              <Text style={[
                styles.bottomTabText,
                pantallaActual === 'personasExamenes' && styles.bottomTabTextActive
              ]}>
                Exámenes R.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.bottomTabItem,
                pantallaActual === 'examenesProgramados' && styles.bottomTabItemActive
              ]}
              onPress={() => setPantallaActual('examenesProgramados')}
              activeOpacity={0.75}
            >
              <Text style={styles.bottomTabIcon}>🗓️</Text>
              <Text style={[
                styles.bottomTabText,
                pantallaActual === 'examenesProgramados' && styles.bottomTabTextActive
              ]}>
                Calendario
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  userBar: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 36) + 12 : 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  userBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnHamburguesa: {
    backgroundColor: '#334155',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  hamburguesaIcon: {
    color: '#38bdf8',
    fontSize: 22,
    fontWeight: '800',
  },
  userNameText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
  },
  userRoleText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
  userBarActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  btnTema: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  btnTemaText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
  },
  btnTemaClaro: {
    backgroundColor: '#f1f5f9',
    borderColor: '#0284c7',
  },
  btnTemaTextClaro: {
    color: '#0284c7',
  },
  btnPanelDocente: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnPanelDocenteText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  btnSalir: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnSalirText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  // ESTILOS DE MENÚ DE HAMBURGUESA
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#0f172a',
    height: '100%',
    padding: 20,
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderRightColor: '#334155',
  },
  drawerHeader: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 36) + 16 : 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  drawerBadge: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  drawerTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
  },
  drawerUser: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  drawerItems: {
    flex: 1,
    paddingVertical: 20,
    gap: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  drawerItemIcon: {
    fontSize: 18,
  },
  drawerItemText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 10,
  },
  drawerItemDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  drawerItemTextDanger: {
    color: '#ef4444',
  },
  btnCerrarDrawer: {
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnCerrarDrawerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  // ESTILOS DE CARRUSEL NAVEGADOR INFERIOR FLOTANTE CIRCULAR COMPACTO
  bottomTabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 42 : 34,
    left: 14,
    right: 14,
    zIndex: 99999,
    elevation: 35,
    backgroundColor: '#0369a1',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.75,
    shadowRadius: 14,
    overflow: 'hidden',
  },
  bottomTabCarouselContent: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 25,
    backgroundColor: '#0f172a',
    borderWidth: 1.5,
    borderColor: '#0284c7',
    minWidth: 74,
  },
  bottomTabItemActive: {
    backgroundColor: '#38bdf8',
    borderColor: '#ffffff',
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  bottomTabIcon: {
    fontSize: 17,
    marginBottom: 1,
  },
  bottomTabText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  bottomTabTextActive: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '900',
  },
});
