import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  tips: string[];
  color: string;
  icon?: string;
}

export function TipsList({ title, tips, color, icon = '✅' }: Props) {
  if (tips.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>{title}</Text>
      {tips.map((tip, i) => (
        <View key={i} style={styles.tipRow}>
          <Text style={styles.tipIcon}>{icon}</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 1,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 21,
  },
});
