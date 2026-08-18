import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { apiService } from '../services/api';

export default function LoginScreen({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const ingresar = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa tu correo institucional y contraseña.');
      return;
    }
    setCargando(true);
    try {
      const res = await apiService.login(email.trim(), password.trim());
      onLoginExitoso(res.user);
    } catch (err) {
      Alert.alert('Error de Autenticación', err?.response?.data?.message || 'Credenciales inválidas. Revisa tu correo y contraseña.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.header}>
          <Text style={styles.badgeUnivalle}>UNIVERSIDAD DEL CAUCA · 2026</Text>
          <Text style={styles.title}>Automática Industrial</Text>
          <Text style={styles.subtitle}>Plataforma Móvil de Evaluación de Logros</Text>
        </View>

        <View style={styles.cardLogin}>
          <Text style={styles.cardTitle}>Iniciar Sesión</Text>
          <Text style={styles.cardSub}>Ingresa tu correo institucional y contraseña</Text>

          <Text style={styles.label}>Correo Institucional</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="ej. usuario@unicauca.edu.co"
            placeholderTextColor="#64748b"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#64748b"
          />

          <TouchableOpacity 
            style={styles.btnIngresar} 
            onPress={ingresar}
            disabled={cargando}
          >
            <Text style={styles.btnIngresarText}>
              {cargando ? 'Cargando...' : 'ENTRAR A LA PLATAFORMA'}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeUnivalle: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  cardLogin: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '800',
  },
  cardSub: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 16,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  btnIngresar: {
    backgroundColor: '#0284c7',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnIngresarText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
});
