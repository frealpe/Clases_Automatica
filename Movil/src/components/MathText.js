import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

/**
 * Componente estilizado para formatear preguntas y textos con notación de Álgebra Lineal
 */
export default function MathText({ text, style, highlightMath = true }) {
  if (!text) return null;

  // Si el texto contiene saltos de línea o notación matemática típica como det(A), A x = b, R², R³
  const lines = text.split('\n');

  return (
    <View style={styles.container}>
      {lines.map((line, index) => (
        <Text key={index} style={[styles.text, style]}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  text: {
    fontSize: 16,
    color: '#f8fafc',
    lineHeight: 24,
  }
});
