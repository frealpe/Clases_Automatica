import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { SEMANAS_DATA } from '../data/semanasData';

export default function HomeScreen({ onSelectSemana, resultadosGuardados = {}, onVerExamenesProgramados, materiaActiva }) {
  const totalSemanas = SEMANAS_DATA.length;
  const evaluadas = Object.keys(resultadosGuardados).length;
  const porcentajeProgreso = Math.round((evaluadas / totalSemanas) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Principal */}
        <View style={styles.header}>
          <Text style={styles.univalleBadge}>UNIVERSIDAD DEL CAUCA · 2026</Text>
          <Text style={styles.title}>{materiaActiva?.nombre || 'Automática Industrial'}</Text>
          <Text style={styles.subtitle}>
            {materiaActiva?.codigo ? `[${materiaActiva.codigo}] · ` : ''}Evaluación Móvil de Logros por Sesión/Semana
          </Text>

          {/* Tarjeta de Progreso General */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progreso de Evaluaciones</Text>
              <Text style={styles.progressPercentage}>{porcentajeProgreso}%</Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${porcentajeProgreso}%` }]} />
            </View>
            <Text style={styles.progressSubtext}>
              {evaluadas} de {totalSemanas} semanas evaluadas · Texto base: Grossman (7a/8a ed.)
            </Text>
          </View>
        </View>

        {/* Acceso al calendario de Exámenes Programados */}
        {onVerExamenesProgramados && (
          <TouchableOpacity
            style={styles.examenesProgramadosCard}
            activeOpacity={0.8}
            onPress={onVerExamenesProgramados}
          >
            <Text style={styles.examenesProgramadosIcon}>🗓️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.examenesProgramadosTitle}>Exámenes Programados</Text>
              <Text style={styles.examenesProgramadosSubtitle}>Calendario de pruebas del docente</Text>
            </View>
            <Text style={styles.examenesProgramadosArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Sección Lista de Semanas */}
        <Text style={styles.sectionTitle}>Semanas de Aprendizaje (1 a 16)</Text>

        {SEMANAS_DATA.map((semana) => {
          const resultado = resultadosGuardados[semana.id];
          const evaluada = !!resultado;
          const aprobado = resultado ? resultado.aprobado : false;

          return (
            <TouchableOpacity
              key={semana.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => onSelectSemana(semana)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.badgeSemana}>
                  <Text style={styles.badgeSemanaText}>Semana {semana.numero}</Text>
                </View>
                
                <View style={styles.badgeUnit}>
                  <Text style={styles.badgeUnitText}>Unidad {semana.unidad} · {semana.ra}</Text>
                </View>

                {evaluada && (
                  <View style={[styles.statusBadge, aprobado ? styles.badgeAprobado : styles.badgeReprobado]}>
                    <Text style={styles.statusBadgeText}>
                      {aprobado ? '✓ RA ALCANZADO' : '⚠ REFORZAR'}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.cardTitle}>{semana.unidadNombre}</Text>
              <Text style={styles.cardCapitulo}>{semana.capituloGrossman}</Text>

              {/* Subtemas breves */}
              <View style={styles.subtemasContainer}>
                {semana.subtemas.map((st, idx) => (
                  <Text key={idx} style={styles.subtemaItem} numberOfLines={1}>
                    • {st}
                  </Text>
                ))}
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.timerInfo}>⏱ Test corto: {semana.duracionExamenMin} min</Text>
                <Text style={styles.actionLink}>
                  {evaluada ? 'Ver resultado / Reintentar →' : 'Presentar Examen →'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

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
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  univalleBadge: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    color: '#e2e8f0',
    fontWeight: '700',
    fontSize: 14,
  },
  progressPercentage: {
    color: '#38bdf8',
    fontWeight: '800',
    fontSize: 16,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#38bdf8',
    borderRadius: 4,
  },
  progressSubtext: {
    color: '#64748b',
    fontSize: 11,
  },
  examenesProgramadosCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0c4a6e',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#38bdf8',
    gap: 12,
  },
  examenesProgramadosIcon: {
    fontSize: 24,
  },
  examenesProgramadosTitle: {
    color: '#f0f9ff',
    fontSize: 14,
    fontWeight: '800',
  },
  examenesProgramadosSubtitle: {
    color: '#bae6fd',
    fontSize: 11,
    marginTop: 1,
  },
  examenesProgramadosArrow: {
    color: '#38bdf8',
    fontSize: 20,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  badgeSemana: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeSemanaText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  badgeUnit: {
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeUnitText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  badgeAprobado: {
    backgroundColor: '#065f46',
  },
  badgeReprobado: {
    backgroundColor: '#991b1b',
  },
  statusBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardCapitulo: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 8,
  },
  subtemasContainer: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  subtemaItem: {
    color: '#cbd5e1',
    fontSize: 12,
    marginVertical: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  timerInfo: {
    color: '#94a3b8',
    fontSize: 12,
  },
  actionLink: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
  }
});
