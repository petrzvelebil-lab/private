import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig, PartnerPreferences } from '../types';

const CONFIG_KEY = '@cyklopartner_config';
const PREFS_KEY = '@cyklopartner_preferences';

const DEFAULT_CONFIG: AppConfig = {
  partnerName: '',
  cycleLength: 28,
  lastCycleStart: '',
  notificationsEnabled: false,
  dailyTipEnabled: false,
  notificationTime: '08:00',
  onboardingComplete: false,
};

const DEFAULT_PREFS: PartnerPreferences = {
  comfortItems: {
    tea: '',
    chocolate: '',
    snack: '',
    comfortFood: '',
    movieGenre: '',
  },
  soothingActivities: [],
  pmsAnnoyances: [],
  loveLanguage: '',
  customRituals: ['', '', ''],
};

export function useConfig() {
  const [config, setConfigState] = useState<AppConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CONFIG_KEY).then((data) => {
      if (data) setConfigState(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  const setConfig = useCallback(async (updates: Partial<AppConfig>) => {
    setConfigState((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { config, setConfig, loading };
}

export function usePreferences() {
  const [preferences, setPrefsState] = useState<PartnerPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then((data) => {
      if (data) setPrefsState(JSON.parse(data));
      setLoading(false);
    });
  }, []);

  const setPreferences = useCallback(async (updates: Partial<PartnerPreferences>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { preferences, setPreferences, loading };
}
