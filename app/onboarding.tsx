import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEPS = [
  {
    title: 'Jak se jmenuje tvoje partnerka?',
    subtitle: 'Budeme její jméno používat v tipech a doporučeních.',
    placeholder: 'Jméno partnerky',
    key: 'partnerName',
  },
  {
    title: 'Kdy začala poslední menstruace?',
    subtitle: 'První den posledního cyklu. Formát: YYYY-MM-DD',
    placeholder: '2025-06-01',
    key: 'lastCycleStart',
  },
  {
    title: 'Jak dlouhý je její cyklus?',
    subtitle: 'Průměrná délka v dnech (většinou 28). Rozsah 21–35.',
    placeholder: '28',
    key: 'cycleLength',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    partnerName: '',
    lastCycleStart: '',
    cycleLength: '28',
  });

  const current = STEPS[step];

  const canProceed = () => {
    const val = values[current.key as keyof typeof values].trim();
    if (!val) return false;
    if (current.key === 'lastCycleStart') {
      return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val));
    }
    if (current.key === 'cycleLength') {
      const n = parseInt(val, 10);
      return n >= 21 && n <= 35;
    }
    return true;
  };

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    const config = {
      partnerName: values.partnerName.trim(),
      lastCycleStart: values.lastCycleStart.trim(),
      cycleLength: parseInt(values.cycleLength, 10),
      notificationsEnabled: false,
      dailyTipEnabled: false,
      notificationTime: '08:00',
      onboardingComplete: true,
    };

    await AsyncStorage.setItem('@cyklopartner_config', JSON.stringify(config));
    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.progress}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === step && styles.dotActive, i < step && styles.dotDone]}
            />
          ))}
        </View>

        <Text style={styles.emoji}>
          {step === 0 ? '💕' : step === 1 ? '📅' : '🔄'}
        </Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>

        <TextInput
          style={styles.input}
          value={values[current.key as keyof typeof values]}
          onChangeText={(text) => setValues({ ...values, [current.key]: text })}
          placeholder={current.placeholder}
          placeholderTextColor="#aaa"
          keyboardType={current.key === 'cycleLength' ? 'number-pad' : 'default'}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, !canProceed() && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.buttonText}>
            {step === STEPS.length - 1 ? 'Začít' : 'Pokračovat'}
          </Text>
        </TouchableOpacity>

        {step > 0 && (
          <TouchableOpacity onPress={() => setStep(step - 1)}>
            <Text style={styles.backText}>Zpět</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  dotActive: {
    backgroundColor: '#E74C6F',
    width: 24,
  },
  dotDone: {
    backgroundColor: '#4CAF7D',
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#222',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#888',
    marginBottom: 32,
    lineHeight: 21,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E74C6F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});
