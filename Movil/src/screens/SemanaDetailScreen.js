import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export default function SemanaDetailScreen({ semana, onVolver, onIniciarExamen }) {
  if (!semana) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Botón Volver */}
        <TouchableOpacity style={styles.backButton} onPress={onVolver}>
          <Text style={styles.backButtonText}>← Volver al Semestre</Text>
        </TouchableOpacity>

        {/* Encabezado Semana */}
        <View style={styles.header}>
          <View style={styles.headerBadges}>
            <View style={styles.badgeSemana}>
              <Text style={styles.badgeSemanaText}>SEMANA {semana.numero}</Text>
            </View>
            <View style={styles.badgeRA}>
              <Text style={styles.badgeRAText}>{semana.ra}</Text>
            </View>
          </View>

          <Text style={styles.title}>{semana.unidadNombre}</Text>
          <Text style={styles.subtitle}>{semana.capituloGrossman} · Stanley I. Grossman</Text>
        </View>

        {/* Tarjeta de Resultado de Aprendizaje (RA) */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardHeaderTitle}>🎯 Resultado de Aprendizaje (RA)</Text>
          <Text style={styles.cardBodyText}>{semana.raDescripcion}</Text>
        </View>

        {/* Tarjeta de Contenidos Temáticos */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardHeaderTitle}>📚 Contenidos de la Sesión</Text>
          {semana.subtemas.map((st, index) => (
            <View key={index} style={styles.subtemaRow}>
              <Text style={styles.subtemaDot}>•</Text>
              <Text style={styles.subtemaText}>{st}</Text>
            </View>
          ))}
        </View>

        {/* Tarjeta Reglas del Examen y Anti-IA */}
        <View style={[styles.cardInfo, styles.cardSeguridad]}>
          <Text style={styles.securityTitle}>🔒 Protocolo de Evaluación Corta Anti-IA</Text>
          <View style={styles.securityItem}>
            <Text style={styles.securityIcon}>⏱</Text>
            <Text style={styles.securityText}>
              <Text style={styles.bold}>Duración:</Text> Examen de {semana.duracionExamenMin} minutos cronometrados.
            </Text>
          </View>
          <View style={styles.securityItem}>
            <Text style={styles.securityIcon}>📝</Text>
            <Text style={styles.securityText}>
              <Text style={styles.bold}>Contenido:</Text> Preguntas de Teoría y Ejercicios Prácticos con selección múltiple.
            </Text>
          </View>
          <View style={styles.securityItem}>
            <Text style={styles.securityIcon}>🚫</Text>
            <Text style={styles.securityText}>
              <Text style={styles.bold}>Sin capturas ni IA:</Text> La aplicación bloquea capturas de pantalla. Minimizar la app o cambiar de ventana enviará una alerta de infracción.
            </Text>
          </View>
        </View>

        {/* Botón Iniciar Examen */}
        <TouchableOpacity 
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={onIniciarExamen}
        >
          <Text style={styles.startButtonText}>COMENZAR EVALUACIÓN ({semana.duracionExamenMin} MIN)</Text>
        </TouchableOpacity>

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
  backButton: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  backButtonText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
  },
  header: {
    marginBottom: 20,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  badgeSemana: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSemanaText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  badgeRA: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeRAText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  cardInfo: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeaderTitle: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardBodyText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 22,
  },
  subtemaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  subtemaDot: {
    color: '#38bdf8',
    fontSize: 16,
    marginRight: 8,
    marginTop: -2,
  },
  subtemaText: {
    color: '#cbd5e1',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  cardSeguridad: {
    backgroundColor: '#1e1b4b',
    borderColor: '#4338ca',
  },
  securityTitle: {
    color: '#a5b4fc',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 1,
  },
  securityText: {
    color: '#c7d2fe',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '800',
    color: '#ffffff',
  },
  startButton: {
    backgroundColor: '#0284c7',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  }
});
