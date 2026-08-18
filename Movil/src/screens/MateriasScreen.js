import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { apiService } from '../services/api';

export default function MateriasScreen({ usuario, onVolver, onSelectMateria }) {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const data = await apiService.getMisMaterias();
        setMaterias(data);
      } catch (e) {
        console.log('Error cargando materias');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.cardMateria}
      activeOpacity={0.8}
      onPress={() => onSelectMateria && onSelectMateria(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badgeCodigo}>
          <Text style={styles.codigoText}>{item.codigo}</Text>
        </View>
        <Text style={styles.semestreText}>{item.semestre || '2026-1'}</Text>
      </View>

      <Text style={styles.materiaNombre}>{item.nombre}</Text>
      <Text style={styles.materiaDesc}>{item.descripcion || 'Sin descripción disponible.'}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.semanasText}>📅 {item.numeroSemanas || 16} Semanas / Sesiones</Text>
        <Text style={styles.rolEstado}>
          {usuario?.rol === 'DOCENTE' || usuario?.rol === 'SUPERUSUARIO' ? '👑 A Cargo' : '👨‍🎓 Inscrito'}
        </Text>
      </View>

      <View style={styles.btnIngresarRow}>
        <Text style={styles.btnIngresarMateriaText}>Entrar a Asignatura / Guías →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVolver} onPress={onVolver}>
          <Text style={styles.btnVolverText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📚 Mis Materias Asociadas</Text>
        <Text style={styles.subtitle}>
          {usuario?.rol === 'DOCENTE' || usuario?.rol === 'SUPERUSUARIO'
            ? 'Asignaturas asignadas a tu cargo como docente'
            : 'Asignaturas en las que te encuentras matriculado'}
        </Text>
      </View>

      {cargando ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#38bdf8" />
          <Text style={styles.loaderText}>Cargando materias asociadas...</Text>
        </View>
      ) : materias.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>No tienes materias asociadas registradas.</Text>
        </View>
      ) : (
        <FlatList
          data={materias}
          keyExtractor={(item) => String(item.id)}
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
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  cardMateria: {
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
  badgeCodigo: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  codigoText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
  },
  semestreText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  materiaNombre: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 6,
  },
  materiaDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
    marginBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  semanasText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  rolEstado: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '800',
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
  btnIngresarRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'flex-end',
  },
  btnIngresarMateriaText: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
  },
});
