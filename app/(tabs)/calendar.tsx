import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AppConfig } from '../../src/types';
import { getPhaseForDate } from '../../src/utils/cycle';
import { PHASES } from '../../src/data/phases';

export default function CalendarScreen() {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('@cyklopartner_config').then((data) => {
      if (data) setConfig(JSON.parse(data));
    });
  }, []);

  const markedDates = useMemo(() => {
    if (!config) return {};
    const marks: Record<string, any> = {};
    const today = new Date();
    const start = new Date(today);
    start.setMonth(start.getMonth() - 1);
    const end = new Date(today);
    end.setMonth(end.getMonth() + 3);

    const current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const phase = getPhaseForDate(config.lastCycleStart, config.cycleLength, new Date(current));
      marks[dateStr] = {
        customStyles: {
          container: { backgroundColor: phase.color + '30', borderRadius: 8 },
          text: { color: '#333' },
        },
      };
      if (selectedDate === dateStr) {
        marks[dateStr].customStyles.container.borderWidth = 2;
        marks[dateStr].customStyles.container.borderColor = phase.color;
      }
      current.setDate(current.getDate() + 1);
    }
    return marks;
  }, [config, selectedDate]);

  const selectedPhase = useMemo(() => {
    if (!config || !selectedDate) return null;
    return getPhaseForDate(config.lastCycleStart, config.cycleLength, new Date(selectedDate));
  }, [config, selectedDate]);

  if (!config) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.legend}>
        {PHASES.map((p) => (
          <View key={p.id} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: p.color }]} />
            <Text style={styles.legendText}>{p.icon} {p.name}</Text>
          </View>
        ))}
      </View>

      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        theme={{
          backgroundColor: '#FAFAFA',
          calendarBackground: '#FAFAFA',
          todayTextColor: '#E74C6F',
          arrowColor: '#E74C6F',
          textDayFontSize: 15,
          textMonthFontSize: 17,
          textMonthFontWeight: '600' as const,
        }}
        firstDay={1}
      />

      {selectedPhase && selectedDate && (
        <View style={[styles.selectedCard, { borderLeftColor: selectedPhase.color, borderLeftWidth: 4 }]}>
          <Text style={styles.selectedDate}>
            {new Date(selectedDate).toLocaleDateString('cs-CZ', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
          <Text style={[styles.selectedPhase, { color: selectedPhase.color }]}>
            {selectedPhase.icon} {selectedPhase.name}
          </Text>
          <Text style={styles.selectedDesc}>{selectedPhase.description}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  selectedCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  selectedPhase: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  selectedDesc: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
