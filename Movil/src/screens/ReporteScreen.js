import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import MathText from '../components/MathText';

export default function ReporteScreen({ semana, resultado, onVolverInicio, onReintentar }) {
  if (!semana || !resultado) return null;

  const { respuestas, tiempoEmpleadoSeg, infraccionIA } = resultado;
  const totalPreguntas = semana.preguntas.length;

  let correctas = 0;
  const falenciasDetectadas = [];
  const detalleRespuestas = [];

  semana.preguntas.forEach((p) => {
    const elegida = respuestas[p.id];
    const esCorrecta = elegida === p.correcta;

    if (esCorrecta) {
      correctas += 1;
    } else {
      falenciasDetectadas.push({
        preguntaId: p.id,
        tipo: p.tipo,
        preguntaTexto: p.pregunta,
        elegidaTexto: p.opciones.find(o => o.id === elegida)?.texto || 'Sin responder',
        correctaTexto: p.opciones.find(o => o.id === p.correcta)?.texto,
        explicacion: p.explicacion,
        falencia: p.falencia
      });
    }

    detalleRespuestas.push({
      ...p,
      elegida,
      esCorrecta
    });
  });

  const porcentaje = Math.round((correctas / totalPreguntas) * 100);
  const nota5 = ((correctas / totalPreguntas) * 5.0).toFixed(1);
  const logroAlcanzado = porcentaje >= 70 && !infraccionIA;

  const minutosEmpleados = Math.floor(tiempoEmpleadoSeg / 60);
  const segundosEmpleados = tiempoEmpleadoSeg % 60;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Banner Veredicto de Logro */}
        <View style={[styles.veredictoCard, logroAlcanzado ? styles.veredictoExito : styles.veredictoAlerta]}>
          <Text style={styles.veredictoIcon}>{logroAlcanzado ? '🎉' : '📚'}</Text>
          <Text style={styles.veredictoTitle}>
            {logroAlcanzado ? '¡LOGRO ALCANZADO CON ÉXITO!' : 'LOGRO EN PROCESO · REQUIERE REFUERZO'}
          </Text>
          <Text style={styles.veredictoRA}>
            {semana.ra}: {semana.raDescripcion}
          </Text>

          {/* Puntaje Destacado */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreValue}>{nota5} / 5.0</Text>
              <Text style={styles.scoreSub}>{porcentaje}% de aciertos</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaText}>⏱ {minutosEmpleados}m {segundosEmpleados}s</Text>
              <Text style={styles.metaText}>
                {correctas} de {totalPreguntas} respuestas correctas
              </Text>
            </View>
          </View>
        </View>

        {/* Mensaje de Felicitación o Recomendación */}
        {infraccionIA ? (
          <View style={styles.cardInfraccionAlert}>
            <Text style={styles.alertTitle}>⚠️ Alerta de Integridad Académica</Text>
            <Text style={styles.alertText}>
              Se registró salida de la aplicación durante la ejecución de la prueba. El resultado ha sido marcado para revisión docente.
            </Text>
          </View>
        ) : logroAlcanzado ? (
          <View style={styles.cardFelicitaciones}>
            <Text style={styles.felicitacionTitle}>🌟 ¡Excelente Desempeño!</Text>
            <Text style={styles.felicitacionText}>
              Demuestras una comprensión sólida de {semana.unidadNombre} ({semana.capituloGrossman}). Has cumplido satisfactoriamente con los criterios de evaluación de la sesión.
            </Text>
          </View>
        ) : (
          <View style={styles.cardRefuerzo}>
            <Text style={styles.refuerzoTitle}>💡 Orientación de Estudio</Text>
            <Text style={styles.refuerzoText}>
              Es necesario revisar y practicar los conceptos clave señalados en el reporte de falencias a continuación antes de avanzar a la siguiente semana.
            </Text>
          </View>
        )}

        {/* Sección de Falencias Detectadas */}
        {falenciasDetectadas.length > 0 && (
          <View style={styles.sectionFalencias}>
            <Text style={styles.sectionTitle}>🔍 Reporte de Falencias y Conceptos a Reforzar</Text>

            {falenciasDetectadas.map((item, idx) => (
              <View key={idx} style={styles.falenciaCard}>
                <View style={styles.falenciaHeader}>
                  <Text style={styles.falenciaTag}>Falencia #{idx + 1}</Text>
                  <Text style={styles.falenciaConcepto}>{item.falencia}</Text>
                </View>

                <MathText text={item.preguntaTexto} style={styles.falenciaPregunta} />

                <View style={styles.comparacionContainer}>
                  <View style={styles.resIncorrectaBox}>
                    <Text style={styles.resLabelText}>Tu respuesta:</Text>
                    <Text style={styles.resIncorrectaText}>{item.elegidaTexto}</Text>
                  </View>
                  <View style={styles.resCorrectaBox}>
                    <Text style={styles.resLabelText}>Respuesta correcta:</Text>
                    <Text style={styles.resCorrectaText}>{item.correctaTexto}</Text>
                  </View>
                </View>

                <View style={styles.explicacionBox}>
                  <Text style={styles.explicacionTitle}>📌 Justificación Pedagógica / Solución:</Text>
                  <Text style={styles.explicacionText}>{item.explicacion}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Acciones */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.btnReintentar} onPress={onReintentar}>
            <Text style={styles.btnReintentarText}>🔄 Reintentar Evaluación</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnInicio} onPress={onVolverInicio}>
            <Text style={styles.btnInicioText}>🏠 Volver al Inicio</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  veredictoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  veredictoExito: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  veredictoAlerta: {
    backgroundColor: '#7c2d12',
    borderColor: '#f97316',
  },
  veredictoIcon: {
    fontSize: 36,
    marginBottom: 6,
  },
  veredictoTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  veredictoRA: {
    color: '#e2e8f0',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  scoreBadge: {
    alignItems: 'flex-start',
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  scoreSub: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  metaBadge: {
    alignItems: 'flex-end',
  },
  metaText: {
    color: '#94a3b8',
    fontSize: 12,
    marginVertical: 1,
  },
  cardFelicitaciones: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  felicitacionTitle: {
    color: '#34d399',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  felicitacionText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
  cardRefuerzo: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f97316',
  },
  refuerzoTitle: {
    color: '#fb923c',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  refuerzoText: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
  },
  cardInfraccionAlert: {
    backgroundColor: '#450a0a',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  alertTitle: {
    color: '#f87171',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  alertText: {
    color: '#fca5a5',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionFalencias: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 12,
  },
  falenciaCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  falenciaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  falenciaTag: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  falenciaConcepto: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  falenciaPregunta: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 10,
  },
  comparacionContainer: {
    gap: 6,
    marginBottom: 10,
  },
  resIncorrectaBox: {
    backgroundColor: '#450a0a',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#991b1b',
  },
  resCorrectaBox: {
    backgroundColor: '#064e3b',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#065f46',
  },
  resLabelText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  resIncorrectaText: {
    color: '#fca5a5',
    fontSize: 13,
    fontWeight: '600',
  },
  resCorrectaText: {
    color: '#6ee7b7',
    fontSize: 13,
    fontWeight: '600',
  },
  explicacionBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
  },
  explicacionTitle: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  explicacionText: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
  },
  actionButtons: {
    gap: 10,
    marginTop: 10,
  },
  btnReintentar: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnReintentarText: {
    color: '#e2e8f0',
    fontWeight: '800',
    fontSize: 14,
  },
  btnInicio: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnInicioText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  }
});
