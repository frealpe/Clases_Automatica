import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, TextInput, ActivityIndicator } from 'react-native';
import { apiService } from '../services/api';

function formatearFecha(iso) {
  if (!iso) return 'Reciente';
  const fecha = new Date(iso);
  return fecha.toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function PersonasExamenesScreen({ usuario, onVolver }) {
  const [intentos, setIntentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS'); // 'TODOS' | 'APROBADOS' | 'REPROBADOS'

  useEffect(() => {
    async function cargar() {
      try {
        const data = await apiService.getHistoricoExamenes();
        setIntentos(Array.isArray(data) ? data : []);
      } catch (e) {
        console.log('Error cargando historial de exámenes');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const intentosFiltrados = intentos.filter((item) => {
    const nombreMatch = (item.estudianteNombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                        (item.tituloExamen || '').toLowerCase().includes(busqueda.toLowerCase()) ||
                        (`semana ${item.semanaNumero || ''}`).toLowerCase().includes(busqueda.toLowerCase());
    
    if (!nombreMatch) return false;
    if (filtroEstado === 'APROBADOS') return item.aprobado;
    if (filtroEstado === 'REPROBADOS') return !item.aprobado;
    return true;
  });

  const renderItem = ({ item }) => {
    const esAprobado = item.aprobado;
    const nota5 = item.nota5 || '0.0';
    const porcentaje = item.porcentaje !== undefined ? item.porcentaje : 0;
    const nombreDocente = item.estudianteNombre || 'Estudiante Registrado';
    const tituloPrueba = item.tituloExamen 
      ? item.tituloExamen 
      : item.semanaNumero 
      ? `Evaluación Semanal #${item.semanaNumero}` 
      : 'Evaluación de Logros';

    return (
      <View style={styles.cardIntento}>
        <View style={styles.topRow}>
          <View style={styles.userInfo}>
            <Text style={styles.avatarIcon}>👨‍🎓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.nombreEstudiante}>{nombreDocente}</Text>
              <Text style={styles.tituloPrueba}>{tituloPrueba}</Text>
            </View>
          </View>
          
          <View style={[styles.badgeNota, esAprobado ? styles.badgeAprobado : styles.badgeReprobado]}>
            <Text style={[styles.notaText, esAprobado ? styles.textAprobado : styles.textReprobado]}>
              {nota5} / 5.0
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Porcentaje</Text>
            <Text style={styles.statValue}>{porcentaje}%</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Estado</Text>
            <Text style={[styles.statValue, esAprobado ? { color: '#22c55e' } : { color: '#ef4444' }]}>
              {esAprobado ? '✓ Aprobado' : '✗ No Aprobado'}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Fecha</Text>
            <Text style={styles.statValue}>{formatearFecha(item.fecha)}</Text>
          </View>
        </View>

        {item.infraccionIA && (
          <View style={styles.alertaInfraccion}>
            <Text style={styles.alertaInfraccionText}>⚠️ Infracción de Seguridad / Cambio de Pantalla</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVolver} onPress={onVolver}>
          <Text style={styles.btnVolverText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>👥 Personas que han presentado Exámenes</Text>
        <Text style={styles.subtitle}>Histórico de intentos, resultados y evaluaciones registradas</Text>
      </View>

      {/* Buscador y Filtros */}
      <View style={styles.filterSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar estudiante o examen..."
          placeholderTextColor="#64748b"
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <View style={styles.filterTabs}>
          {['TODOS', 'APROBADOS', 'REPROBADOS'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.tabBtn, filtroEstado === f && styles.tabBtnActive]}
              onPress={() => setFiltroEstado(f)}
            >
              <Text style={[styles.tabBtnText, filtroEstado === f && styles.tabBtnTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {cargando ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loaderText}>Cargando historial de estudiantes...</Text>
        </View>
      ) : intentosFiltrados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>No se encontraron intentos registrados con los filtros seleccionados.</Text>
        </View>
      ) : (
        <FlatList
          data={intentosFiltrados}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  btnVolver: {
    marginBottom: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnVolverText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  filterSection: {
    padding: 16,
    backgroundColor: '#0f172a',
    gap: 10,
  },
  searchInput: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  cardIntento: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  avatarIcon: {
    fontSize: 24,
  },
  nombreEstudiante: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '800',
  },
  tituloPrueba: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  badgeNota: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeAprobado: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  badgeReprobado: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  notaText: {
    fontSize: 13,
    fontWeight: '800',
  },
  textAprobado: {
    color: '#22c55e',
  },
  textReprobado: {
    color: '#ef4444',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  statValue: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '800',
  },
  alertaInfraccion: {
    marginTop: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
  },
  alertaInfraccionText: {
    color: '#fca5a5',
    fontSize: 11,
    fontWeight: '700',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
  },
});
