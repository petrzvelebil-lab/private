import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig, PartnerPreferences, DailyInfo } from '../../src/types';
import { getDailyInfo } from '../../src/utils/cycle';
import { getPersonalizedTips } from '../../src/utils/tips';
import { PhaseCard } from '../../src/components/PhaseCard';
import { TipsList } from '../../src/components/TipsList';

export default function Dashboard() {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [prefs, setPrefs] = useState<PartnerPreferences | null>(null);
  const [info, setInfo] = useState<DailyInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [configData, prefsData] = await Promise.all([
      AsyncStorage.getItem('@cyklopartner_config'),
      AsyncStorage.getItem('@cyklopartner_preferences'),
    ]);
    if (configData) {
      const c: AppConfig = JSON.parse(configData);
      setConfig(c);
      setInfo(getDailyInfo(c.lastCycleStart, c.cycleLength));
    }
    if (prefsData) setPrefs(JSON.parse(prefsData));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (!config || !info) return null;

  const personalTips = getPersonalizedTips(info.phase.id, prefs, config.partnerName);
  const genericTips = info.phase.tips.slice(0, 3);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.greeting}>
        Ahoj! Jak je na tom {config.partnerName} dnes?
      </Text>

      <PhaseCard
        phase={info.phase}
        dayInCycle={info.dayInCycle}
        cycleLength={config.cycleLength}
        daysUntilNextPhase={info.daysUntilNextPhase}
        nextPhaseName={info.nextPhaseName}
      />

      <TouchableOpacity
        style={[styles.detailButton, { backgroundColor: info.phase.color }]}
        onPress={() =>
          router.push({
            pathname: '/phase-detail',
            params: { phaseId: info.phase.id },
          })
        }
      >
        <Text style={styles.detailButtonText}>
          {info.phase.icon} Co pro ni dnes udělat?
        </Text>
      </TouchableOpacity>

      <TipsList
        title="Tipy na dnešek"
        tips={genericTips}
        color={info.phase.color}
      />

      {personalTips.length > 0 && (
        <TipsList
          title={`Speciálně pro ${config.partnerName}`}
          tips={personalTips}
          color={info.phase.color}
          icon="💝"
        />
      )}

      {info.phase.antiTips.length > 0 && (
        <TipsList
          title="Co raději nedělat"
          tips={info.phase.antiTips}
          color="#c0392b"
          icon="❌"
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  detailButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
