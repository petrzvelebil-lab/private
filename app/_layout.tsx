import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    AsyncStorage.getItem('@cyklopartner_config').then((data) => {
      if (data) {
        const config = JSON.parse(data);
        setOnboarded(config.onboardingComplete === true);
      }
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboarded && !inOnboarding) {
      router.replace('/onboarding');
    } else if (onboarded && inOnboarding) {
      router.replace('/');
    }
  }, [ready, onboarded, segments]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: '#FAFAFA' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="phase-detail" options={{ title: 'Detail fáze' }} />
      </Stack>
    </>
  );
}
