import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SecurityShield({ capturaBloqueada, tiempoRestante }) {
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;
  const tiempoFormateado = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  
  const tiempoPeligro = tiempoRestante < 180; // Menos de 3 minutos

  return (
    <View style={styles.banner}>
      <View style={styles.leftSection}>
        <View style={styles.shieldBadge}>
          <Text style={styles.shieldIcon}>🔒</Text>
        </View>
        <View>
          <Text style={styles.bannerTitle}>MODO EVALUACIÓN PROTEGIDO</Text>
          <Text style={styles.bannerSubtitle}>
            {capturaBloqueada ? 'Captura de pantalla bloqueada · Anti-IA activo' : 'Supervisión anti-trampa activa'}
          </Text>
        </View>
      </View>

      <View style={[styles.timerBadge, tiempoPeligro && styles.timerBadgePeligro]}>
        <Text style={styles.timerLabel}>TIEMPO</Text>
        <Text style={[styles.timerValue, tiempoPeligro && styles.timerValuePeligro]}>
          {tiempoFormateado}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shieldBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  shieldIcon: {
    fontSize: 16,
  },
  bannerTitle: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 1,
  },
  timerBadge: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
    minWidth: 70,
  },
  timerBadgePeligro: {
    borderColor: '#ef4444',
    backgroundColor: '#450a0a',
  },
  timerLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
  },
  timerValue: {
    color: '#60a5fa',
    fontSize: 15,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  timerValuePeligro: {
    color: '#f87171',
  }
});
