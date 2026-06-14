import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CyclePhase } from '../types';

interface Props {
  phase: CyclePhase;
  dayInCycle: number;
  cycleLength: number;
  daysUntilNextPhase: number;
  nextPhaseName: string;
}

export function PhaseCard({ phase, dayInCycle, cycleLength, daysUntilNextPhase, nextPhaseName }: Props) {
  const progress = dayInCycle / cycleLength;

  return (
    <View style={[styles.card, { borderLeftColor: phase.color, borderLeftWidth: 5 }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{phase.icon}</Text>
        <View style={styles.headerText}>
          <Text style={[styles.phaseName, { color: phase.color }]}>{phase.name}</Text>
          <Text style={styles.dayText}>
            Den {dayInCycle} z {cycleLength}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: phase.color }]} />
        </View>
      </View>

      <Text style={styles.nextPhase}>
        {daysUntilNextPhase <= 1
          ? `Zítra začíná ${nextPhaseName}`
          : `Za ${daysUntilNextPhase} dní začíná ${nextPhaseName}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  phaseName: {
    fontSize: 22,
    fontWeight: '700',
  },
  dayText: {
    fontSize: 15,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBg: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  nextPhase: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
