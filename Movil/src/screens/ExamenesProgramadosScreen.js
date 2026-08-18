import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { apiService } from '../services/api';

const ESTADO_ETIQUETA = {
  proximo: { texto: 'PRÓXIMO', color: '#38bdf8' },
  activo: { texto: 'ACTIVO AHORA', color: '#22c55e' },
  finalizado: { texto: 'FINALIZADO', color: '#64748b' },
  cancelado: { texto: 'CANCELADO', color: '#ef4444' }
};

function formatearFecha(iso) {
  if (!iso) return '';
  const fecha = new Date(iso);
  return fecha.toLocaleString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function ExamenesProgramadosScreen({ onPresentar, onVolver }) {
  const [examenes, setExamenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const cargar = useCallback(async () => {
    const lista = await apiService.getMisExamenesProgramados();
    setExamenes(Array.isArray(lista) ? lista : []);
  }, []);

  useEffect(() => {
    setCargando(true);
    cargar().finally(() => setCargando(false));
  }, [cargar]);

  const onRefresh = async () => {
    setRefrescando(true);
    await cargar();
    setRefrescando(false);
  };

  const renderItem = ({ item }) => {
    const estado = ESTADO_ETIQUETA[item.estadoCalculado] || ESTADO_ETIQUETA.proximo;
    const activo = item.estadoCalculado === 'activo';
    const temas = (item.semanas || []).map((s) => `Semana ${s.numero}`).join(', ');

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.badgeEstado, { borderColor: estado.color }]}>
            <Text style={[styles.badgeEstadoText, { color: estado.color }]}>{estado.texto}</Text>
          </View>
          <Text style={styles.duracionText}>{item.duracionMin} min</Text>
        </View>

        <Text style={styles.tituloText}>{item.titulo}</Text>
        {item.materiaNombre && <Text style={styles.materiaText}>{item.materiaNombre}</Text>}
        <Text style={styles.ventanaText}>
          {activo ? 'Disponible hasta' : 'Abre'} {formatearFecha(activo ? item.fechaFin : item.fechaInicio)}
        </Text>
        {temas ? <Text style={styles.temasText}>Temas: {temas}</Text> : null}

        <TouchableOpacity
          style={[styles.btnPresentar, !activo && styles.btnPresentarDeshabilitado]}
          activeOpacity={0.8}
          disabled={!activo}
          onPress={() => onPresentar(item)}
        >
          <Text style={styles.btnPresentarText}>
            {activo ? 'Presentar Ahora' : 'Aún no disponible'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onVolver}>
          <Text style={styles.volverText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🗓️ Exámenes Programados</Text>
      </View>

      {!cargando && examenes.length === 0 && (
        <View style={styles.vacioContainer}>
          <Text style={styles.vacioText}>No tienes exámenes programados por ahora.</Text>
        </View>
      )}

      <FlatList
        data={examenes}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} tintColor="#38bdf8" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  volverText: {
    color: '#38bdf8',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
  },
  vacioContainer: {
    padding: 24,
    alignItems: 'center',
  },
  vacioText: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeEstado: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeEstadoText: {
    fontSize: 10,
    fontWeight: '800',
  },
  duracionText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  tituloText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  materiaText: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  ventanaText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  temasText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  btnPresentar: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  btnPresentarDeshabilitado: {
    backgroundColor: '#334155',
  },
  btnPresentarText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  }
});
