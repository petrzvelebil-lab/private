import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AppConfig } from '../../src/types';

export default function SettingsScreen() {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('@cyklopartner_config').then((data) => {
      if (data) setConfig(JSON.parse(data));
    });
  }, []);

  const updateConfig = async (updates: Partial<AppConfig>) => {
    if (!config) return;
    const next = { ...config, ...updates };
    setConfig(next);
    await AsyncStorage.setItem('@cyklopartner_config', JSON.stringify(next));
  };

  const resetApp = () => {
    Alert.alert(
      'Smazat všechna data?',
      'Tato akce je nevratná. Všechna data budou vymazána.',
      [
        { text: 'Zrušit', style: 'cancel' },
        {
          text: 'Smazat',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('@cyklopartner_config');
            await AsyncStorage.removeItem('@cyklopartner_preferences');
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  if (!config) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Základní nastavení</Text>
      <View style={styles.card}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Jméno partnerky</Text>
          <TextInput
            style={styles.input}
            value={config.partnerName}
            onChangeText={(text) => updateConfig({ partnerName: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Délka cyklu (21–35 dní)</Text>
          <TextInput
            style={styles.input}
            value={String(config.cycleLength)}
            onChangeText={(text) => {
              const n = parseInt(text, 10);
              if (!isNaN(n) && n >= 21 && n <= 35) {
                updateConfig({ cycleLength: n });
              }
            }}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Datum začátku posledního cyklu</Text>
          <TextInput
            style={styles.input}
            value={config.lastCycleStart}
            onChangeText={(text) => {
              if (/^\d{4}-\d{2}-\d{2}$/.test(text) && !isNaN(Date.parse(text))) {
                updateConfig({ lastCycleStart: text });
              }
            }}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#bbb"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>O aplikaci</Text>
      <View style={styles.card}>
        <Text style={styles.aboutText}>
          CykloPartner ti pomáhá být lepším partnerem tím, že ti vysvětlí,
          co se děje v průběhu menstruačního cyklu, a dá ti konkrétní tipy,
          co dělat (a co ne).
        </Text>
        <Text style={styles.version}>Verze 1.0.0</Text>
      </View>

      <TouchableOpacity style={styles.dangerButton} onPress={resetApp}>
        <Text style={styles.dangerButtonText}>Smazat všechna data a začít znovu</Text>
      </TouchableOpacity>

      <View style={{ height: 48 }} />
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
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#f7f7f7',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  aboutText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  version: {
    fontSize: 13,
    color: '#aaa',
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginTop: 8,
  },
  dangerButtonText: {
    color: '#e74c3c',
    fontSize: 15,
    fontWeight: '600',
  },
});
