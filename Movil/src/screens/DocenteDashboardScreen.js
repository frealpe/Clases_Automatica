import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { apiService } from '../services/api';

export default function DocenteDashboardScreen({ usuario, onVolver, onCerrarSesion }) {
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarReporte() {
      try {
        const data = await apiService.getReporteDocente();
        setReporte(data);
      } catch (e) {
        console.log('Error cargando reporte');
      } finally {
        setCargando(false);
      }
    }
    cargarReporte();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header Docente */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Text style={styles.roleBadge}>👑 SUPERUSUARIO · DOCENTE</Text>
            <TouchableOpacity onPress={onCerrarSesion}>
              <Text style={styles.salirText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Panel de Control Docente</Text>
          <Text style={styles.subtitle}>Supervisión Grupal y Análisis de Logros en PostgreSQL</Text>
        </View>

        {/* Tarjetas de Métricas Grupales */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>{reporte?.resumenGrupov?.totalEvaluaciones || 1}</Text>
            <Text style={styles.metricLabel}>Evaluaciones</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={[styles.metricValue, { color: '#34d399' }]}>
              {reporte?.resumenGrupov?.tasaAprobacion || '100%'}
            </Text>
            <Text style={styles.metricLabel}>Aprobación</Text>
          </View>
          <View style={[styles.metricCard, { borderColor: '#ef4444' }]}>
            <Text style={[styles.metricValue, { color: '#f87171' }]}>
              {reporte?.resumenGrupov?.infraccionesCount || 0}
            </Text>
            <Text style={styles.metricLabel}>Alertas Anti-IA</Text>
          </View>
        </View>

        {/* Lista de Estudiantes e Intentos */}
        <Text style={styles.sectionTitle}>Historial de Intentos por Estudiante</Text>

        {(reporte?.intentos || []).map((item, idx) => (
          <View key={idx} style={styles.intentoCard}>
            <View style={styles.intentoHeader}>
              <View>
                <Text style={styles.nombreEstudiante}>{item.estudianteNombre || 'Estudiante Univalle'}</Text>
                <Text style={styles.metaSemana}>Semana {item.semanaNumero} · {item.fecha ? new Date(item.fecha).toLocaleDateString() : 'Hoy'}</Text>
              </View>
              <View style={[styles.notaBadge, item.aprobado ? styles.notaAprobada : styles.notaReprobada]}>
                <Text style={styles.notaText}>{item.nota5 || '5.0'}</Text>
              </View>
            </View>

            {item.infraccionIA && (
              <View style={styles.alertInfraccionBox}>
                <Text style={styles.alertInfraccionText}>🚨 ALERTA: Salida de aplicación o intento de uso de IA detectado.</Text>
              </View>
            )}

            <View style={styles.intentoFooter}>
              <Text style={styles.infoFooter}>⏱ Tiempo: {Math.floor((item.tiempoEmpleadoSeg || 300) / 60)} min</Text>
              <Text style={styles.infoFooter}>Acierto: {item.porcentaje || 100}%</Text>
            </View>
          </View>
        ))}

        {/* Botón Navegación */}
        <TouchableOpacity style={styles.btnVolver} onPress={onVolver}>
          <Text style={styles.btnVolverText}>← Ir a la Vista de Semanas del Semestre</Text>
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
  header: {
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleBadge: {
    color: '#a5b4fc',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#312e81',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  salirText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#38bdf8',
  },
  metricLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 12,
  },
  intentoCard: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  intentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nombreEstudiante: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
  },
  metaSemana: {
    color: '#64748b',
    fontSize: 12,
  },
  notaBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  notaAprobada: {
    backgroundColor: '#065f46',
  },
  notaReprobada: {
    backgroundColor: '#991b1b',
  },
  notaText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  alertInfraccionBox: {
    backgroundColor: '#450a0a',
    borderRadius: 6,
    padding: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  alertInfraccionText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: '700',
  },
  intentoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 8,
    marginTop: 6,
  },
  infoFooter: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  btnVolver: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  btnVolverText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  }
});
