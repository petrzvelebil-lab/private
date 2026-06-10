import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig, PartnerPreferences, PhaseId } from '../src/types';
import { PHASES } from '../src/data/phases';
import { getPersonalizedTips } from '../src/utils/tips';
import { TipsList } from '../src/components/TipsList';

export default function PhaseDetail() {
  const { phaseId } = useLocalSearchParams<{ phaseId: string }>();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [prefs, setPrefs] = useState<PartnerPreferences | null>(null);

  const phase = PHASES.find((p) => p.id === phaseId);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem('@cyklopartner_config'),
      AsyncStorage.getItem('@cyklopartner_preferences'),
    ]).then(([configData, prefsData]) => {
      if (configData) setConfig(JSON.parse(configData));
      if (prefsData) setPrefs(JSON.parse(prefsData));
    });
  }, []);

  if (!phase) return null;

  const personalTips = config
    ? getPersonalizedTips(phase.id as PhaseId, prefs, config.partnerName)
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, { backgroundColor: phase.color + '20' }]}>
        <Text style={styles.icon}>{phase.icon}</Text>
        <Text style={[styles.phaseName, { color: phase.color }]}>{phase.name}</Text>
        <Text style={styles.days}>
          Den {phase.dayStart}–{phase.dayEnd}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Co se děje v těle</Text>
        <Text style={styles.description}>{phase.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Jak se může cítit</Text>
        {phase.feelings.map((f, i) => (
          <View key={i} style={styles.feelingRow}>
            <Text style={styles.feelingDot}>•</Text>
            <Text style={styles.feelingText}>{f}</Text>
          </View>
        ))}
      </View>

      <TipsList title="Co dělat" tips={phase.tips} color={phase.color} icon="✅" />

      {personalTips.length > 0 && (
        <TipsList
          title={`Personalizované tipy${config ? ` pro ${config.partnerName}` : ''}`}
          tips={personalTips}
          color={phase.color}
          icon="💝"
        />
      )}

      <TipsList title="Co nedělat" tips={phase.antiTips} color="#c0392b" icon="❌" />

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 16,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  phaseName: {
    fontSize: 28,
    fontWeight: '700',
  },
  days: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  feelingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  feelingDot: {
    fontSize: 16,
    color: '#888',
    marginRight: 8,
    marginTop: 1,
  },
  feelingText: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    lineHeight: 21,
  },
});
