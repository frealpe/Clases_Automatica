import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal } from 'react-native';
import SecurityShield from '../components/SecurityShield';
import MathText from '../components/MathText';
import { useExamSecurity } from '../hooks/useExamSecurity';

// examenProgramado, si se pasa, activa el modo "programado" (calendario): mismas medidas de
// seguridad y timer, pero las preguntas/duración vienen del examen programado en vez de la
// semana, y el envío va a /examenes-programados/:id/submit con el array de infracciones.
export default function ExamenScreen({ semana, examenProgramado, onFinalizarExamen, onCancelar }) {
  const modoProgramado = Boolean(examenProgramado);
  const preguntas = modoProgramado ? examenProgramado.preguntas : semana.preguntas;
  const duracionMin = modoProgramado ? examenProgramado.duracionMin : semana.duracionExamenMin;

  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({});
  const [tiempoRestante, setTiempoRestante] = useState(duracionMin * 60);
  const [mostrarModalInfraccion, setMostrarModalInfraccion] = useState(false);
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);
  const [infracciones, setInfracciones] = useState([]);

  // Hook de Seguridad Anti-Trampa / Anti-IA
  const { capturaBloqueada } = useExamSecurity(true, (infraccion) => {
    // Callback cuando se detecta que el alumno cambió de app o la minimizó (ej. abriendo IA)
    setInfracciones((prev) => [...prev, infraccion]);
    setMostrarModalInfraccion(true);
  });

  // Temporizador regresivo
  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto enviar por tiempo agotado
          enviarRespuestasAuto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seleccionarOpcion = (preguntaId, opcionId) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [preguntaId]: opcionId,
    }));
  };

  const enviarRespuestasAuto = () => {
    onFinalizarExamen({
      respuestas: respuestasSeleccionadas,
      tiempoEmpleadoSeg: duracionMin * 60 - tiempoRestante,
      infraccionIA: false,
      infracciones
    });
  };

  const confirmarEnvioManual = () => {
    setMostrarModalConfirmar(true);
  };

  const procesarEnvioFinal = () => {
    setMostrarModalConfirmar(false);
    onFinalizarExamen({
      respuestas: respuestasSeleccionadas,
      tiempoEmpleadoSeg: duracionMin * 60 - tiempoRestante,
      infraccionIA: infracciones.length > 0,
      infracciones
    });
  };

  const procesarInfraccionYTerminar = () => {
    setMostrarModalInfraccion(false);
    onFinalizarExamen({
      respuestas: respuestasSeleccionadas,
      tiempoEmpleadoSeg: duracionMin * 60 - tiempoRestante,
      infraccionIA: true,
      infracciones
    });
  };

  const preguntasRespondidasCount = Object.keys(respuestasSeleccionadas).length;
  const totalPreguntas = preguntas.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Banner de Seguridad Anti-Trampa y Temporizador */}
      <View style={styles.topHeader}>
        <SecurityShield 
          capturaBloqueada={capturaBloqueada} 
          tiempoRestante={tiempoRestante} 
        />
        
        <View style={styles.progressHeader}>
          <Text style={styles.semanaTitle}>
            {modoProgramado ? `🗓️ ${examenProgramado.titulo}` : `Semana ${semana.numero} · ${semana.ra}`}
          </Text>
          <Text style={styles.counterText}>
            Respondidas {preguntasRespondidasCount}/{totalPreguntas}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {preguntas.map((p, index) => {
          const seleccionada = respuestasSeleccionadas[p.id];
          const esTeoria = p.tipo === 'teoria';

          return (
            <View key={p.id} style={styles.preguntaCard}>
              <View style={styles.preguntaHeader}>
                <Text style={styles.numeroPregunta}>Pregunta {index + 1}</Text>
                <View style={[styles.badgeTipo, esTeoria ? styles.badgeTeoria : styles.badgeEjercicio]}>
                  <Text style={styles.badgeTipoText}>
                    {esTeoria ? '📖 TEORÍA' : '🧮 EJERCICIO'}
                  </Text>
                </View>
              </View>

              <MathText text={p.pregunta} style={styles.preguntaTexto} />

              {/* Opciones de Selección Múltiple */}
              <View style={styles.opcionesContainer}>
                {p.opciones.map((opcion) => {
                  const esActiva = seleccionada === opcion.id;

                  return (
                    <TouchableOpacity
                      key={opcion.id}
                      style={[styles.opcionCard, esActiva && styles.opcionCardSeleccionada]}
                      activeOpacity={0.7}
                      onPress={() => seleccionarOpcion(p.id, opcion.id)}
                    >
                      <View style={[styles.radioCircle, esActiva && styles.radioCircleSeleccionado]}>
                        {esActiva && <View style={styles.radioInnerDot} />}
                      </View>
                      <Text style={[styles.opcionLetra, esActiva && styles.opcionLetraSeleccionada]}>
                        {opcion.id.toUpperCase()})
                      </Text>
                      <Text style={[styles.opcionTexto, esActiva && styles.opcionTextoSeleccionada]}>
                        {opcion.texto}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* Botón de Enviar Examen */}
        <TouchableOpacity
          style={[
            styles.envioButton,
            preguntasRespondidasCount === 0 && styles.envioButtonDeshabilitado
          ]}
          activeOpacity={0.8}
          onPress={confirmarEnvioManual}
        >
          <Text style={styles.envioButtonText}>FINALIZAR Y ENVIAR EVALUACIÓN</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Modal Infraccion Anti-IA / Minimizado de App */}
      <Modal visible={mostrarModalInfraccion} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentInfraccion}>
            <Text style={styles.modalIconInfraccion}>🚨</Text>
            <Text style={styles.modalTitleInfraccion}>INFRACCIÓN DE SEGURIDAD DETECTADA</Text>
            <Text style={styles.modalTextInfraccion}>
              Has salido de la aplicación o cambiado de pantalla durante la ejecución del examen. Por protocolo anti-trampa y anti-uso de IA (ChatGPT, etc.), el examen será evaluado inmediatamente con las respuestas registradas hasta este instante.
            </Text>
            <TouchableOpacity 
              style={styles.modalBtnInfraccion} 
              onPress={procesarInfraccionYTerminar}
            >
              <Text style={styles.modalBtnInfraccionText}>Ver Reporte de Infracción</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmar Envío */}
      <Modal visible={mostrarModalConfirmar} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentConfirmar}>
            <Text style={styles.modalTitleConfirmar}>¿Enviar Evaluación?</Text>
            <Text style={styles.modalTextConfirmar}>
              Has respondido {preguntasRespondidasCount} de {totalPreguntas} preguntas. Una vez enviada, recibirás la evaluación de logros y el análisis de falencias.
            </Text>
            <View style={styles.modalRowBtns}>
              <TouchableOpacity 
                style={styles.modalBtnCancelar}
                onPress={() => setMostrarModalConfirmar(false)}
              >
                <Text style={styles.modalBtnCancelarText}>Revisar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalBtnEnviar}
                onPress={procesarEnvioFinal}
              >
                <Text style={styles.modalBtnEnviarText}>Confirmar Envío</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#0f172a',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  semanaTitle: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 13,
  },
  counterText: {
    color: '#38bdf8',
    fontWeight: '800',
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  preguntaCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  preguntaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  numeroPregunta: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeTipo: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeTeoria: {
    backgroundColor: '#0369a1',
  },
  badgeEjercicio: {
    backgroundColor: '#4338ca',
  },
  badgeTipoText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  preguntaTexto: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  opcionesContainer: {
    gap: 8,
    marginTop: 6,
  },
  opcionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  opcionCardSeleccionada: {
    backgroundColor: '#0369a1',
    borderColor: '#38bdf8',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#64748b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioCircleSeleccionado: {
    borderColor: '#ffffff',
  },
  radioInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
  opcionLetra: {
    color: '#94a3b8',
    fontWeight: '800',
    fontSize: 14,
    marginRight: 6,
  },
  opcionLetraSeleccionada: {
    color: '#ffffff',
  },
  opcionTexto: {
    color: '#cbd5e1',
    fontSize: 14,
    flex: 1,
  },
  opcionTextoSeleccionada: {
    color: '#ffffff',
    fontWeight: '600',
  },
  envioButton: {
    backgroundColor: '#16a34a',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  envioButtonDeshabilitado: {
    backgroundColor: '#334155',
    opacity: 0.6,
  },
  envioButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContentInfraccion: {
    backgroundColor: '#1e1b4b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  modalIconInfraccion: {
    fontSize: 40,
    marginBottom: 10,
  },
  modalTitleInfraccion: {
    color: '#f87171',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalTextInfraccion: {
    color: '#cbd5e1',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalBtnInfraccion: {
    backgroundColor: '#dc2626',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalBtnInfraccionText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  modalContentConfirmar: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitleConfirmar: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalTextConfirmar: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalRowBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtnCancelar: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBtnCancelarText: {
    color: '#cbd5e1',
    fontWeight: '700',
  },
  modalBtnEnviar: {
    flex: 1,
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBtnEnviarText: {
    color: '#ffffff',
    fontWeight: '800',
  }
});
