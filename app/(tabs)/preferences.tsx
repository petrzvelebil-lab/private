import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PartnerPreferences, LoveLanguage } from '../../src/types';

const ACTIVITIES = ['koupel', 'procházka', 'film', 'ticho', 'masáž', 'společný čas', 'vlastní prostor'];
const PMS_ANNOYANCES = ['hluk', 'návštěvy', 'dotazy "co je ti"', 'příliš rady', 'komentáře k náladě'];
const LOVE_LANGUAGES: { value: LoveLanguage; label: string; icon: string }[] = [
  { value: 'physical_touch', label: 'Fyzický kontakt', icon: '🤗' },
  { value: 'words_of_affirmation', label: 'Slova uznání', icon: '💬' },
  { value: 'gifts', label: 'Dárky / pozornosti', icon: '🎁' },
  { value: 'acts_of_service', label: 'Pomoc v domácnosti', icon: '🏠' },
  { value: 'quality_time', label: 'Společný čas', icon: '⏰' },
];

const DEFAULT_PREFS: PartnerPreferences = {
  comfortItems: { tea: '', chocolate: '', snack: '', comfortFood: '', movieGenre: '' },
  soothingActivities: [],
  pmsAnnoyances: [],
  loveLanguage: '',
  customRituals: ['', '', ''],
};

export default function PreferencesScreen() {
  const [prefs, setPrefs] = useState<PartnerPreferences>(DEFAULT_PREFS);
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('@cyklopartner_preferences').then((data) => {
      if (data) setPrefs(JSON.parse(data));
    });
    AsyncStorage.getItem('@cyklopartner_config').then((data) => {
      if (data) setPartnerName(JSON.parse(data).partnerName || '');
    });
  }, []);

  const save = async (updated: PartnerPreferences) => {
    setPrefs(updated);
    await AsyncStorage.setItem('@cyklopartner_preferences', JSON.stringify(updated));
  };

  const toggleActivity = (activity: string) => {
    const current = prefs.soothingActivities;
    const updated = current.includes(activity)
      ? current.filter((a) => a !== activity)
      : [...current, activity];
    save({ ...prefs, soothingActivities: updated });
  };

  const toggleAnnoyance = (item: string) => {
    const current = prefs.pmsAnnoyances;
    const updated = current.includes(item)
      ? current.filter((a) => a !== item)
      : [...current, item];
    save({ ...prefs, pmsAnnoyances: updated });
  };

  const setComfortItem = (key: keyof PartnerPreferences['comfortItems'], value: string) => {
    save({ ...prefs, comfortItems: { ...prefs.comfortItems, [key]: value } });
  };

  const setLoveLanguage = (lang: LoveLanguage) => {
    save({ ...prefs, loveLanguage: lang });
  };

  const setRitual = (index: number, value: string) => {
    const rituals = [...prefs.customRituals];
    rituals[index] = value;
    save({ ...prefs, customRituals: rituals });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Poznej {partnerName || 'svou partnerku'} 💕</Text>
      <Text style={styles.subheader}>
        Vyplň, co má ráda — dostaneš tipy na míru.
      </Text>

      <Text style={styles.sectionTitle}>Oblíbené věci pro pohodu</Text>
      <View style={styles.card}>
        {([
          ['tea', 'Oblíbený čaj / nápoj', 'rooibos s medem'],
          ['chocolate', 'Oblíbená čokoláda', 'Lindt 70%'],
          ['snack', 'Oblíbený snack', 'slané tyčinky'],
          ['comfortFood', 'Comfort food', 'pad thai'],
          ['movieGenre', 'Film / seriál / žánr', 'true crime'],
        ] as const).map(([key, label, placeholder]) => (
          <View key={key} style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
              style={styles.input}
              value={prefs.comfortItems[key]}
              onChangeText={(text) => setComfortItem(key, text)}
              placeholder={placeholder}
              placeholderTextColor="#bbb"
            />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Co ji uklidní / potěší</Text>
      <View style={styles.chipContainer}>
        {ACTIVITIES.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.chip, prefs.soothingActivities.includes(a) && styles.chipActive]}
            onPress={() => toggleActivity(a)}
          >
            <Text style={[styles.chipText, prefs.soothingActivities.includes(a) && styles.chipTextActive]}>
              {a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Co nesnáší při PMS</Text>
      <View style={styles.chipContainer}>
        {PMS_ANNOYANCES.map((a) => (
          <TouchableOpacity
            key={a}
            style={[styles.chip, prefs.pmsAnnoyances.includes(a) && styles.chipActiveRed]}
            onPress={() => toggleAnnoyance(a)}
          >
            <Text style={[styles.chipText, prefs.pmsAnnoyances.includes(a) && styles.chipTextActive]}>
              {a}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Jazyk lásky</Text>
      <View style={styles.card}>
        {LOVE_LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.value}
            style={[styles.langOption, prefs.loveLanguage === lang.value && styles.langOptionActive]}
            onPress={() => setLoveLanguage(lang.value)}
          >
            <Text style={styles.langIcon}>{lang.icon}</Text>
            <Text style={[styles.langLabel, prefs.loveLanguage === lang.value && styles.langLabelActive]}>
              {lang.label}
            </Text>
            {prefs.loveLanguage === lang.value && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Specifické rituály</Text>
      <View style={styles.card}>
        {prefs.customRituals.map((ritual, i) => (
          <TextInput
            key={i}
            style={[styles.input, { marginBottom: 8 }]}
            value={ritual}
            onChangeText={(text) => setRitual(i, text)}
            placeholder={
              i === 0
                ? 'např. vždycky chce pad thai z Wolt'
                : i === 1
                ? 'např. ráda si pouští true crime'
                : 'další rituál...'
            }
            placeholderTextColor="#bbb"
          />
        ))}
      </View>

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
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 15,
    color: '#888',
    marginBottom: 24,
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipActive: {
    backgroundColor: '#4CAF7D',
    borderColor: '#4CAF7D',
  },
  chipActiveRed: {
    backgroundColor: '#E74C6F',
    borderColor: '#E74C6F',
  },
  chipText: {
    fontSize: 14,
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6,
  },
  langOptionActive: {
    backgroundColor: '#E74C6F15',
  },
  langIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  langLabel: {
    flex: 1,
    fontSize: 15,
    color: '#444',
  },
  langLabelActive: {
    color: '#E74C6F',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: '#E74C6F',
    fontWeight: '700',
  },
});
