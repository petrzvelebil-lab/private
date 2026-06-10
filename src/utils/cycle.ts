import { DailyInfo } from '../types';
import { getPhaseForDay, getNextPhase } from '../data/phases';

export function getDayInCycle(lastCycleStart: string, cycleLength: number, date?: Date): number {
  const today = date || new Date();
  const start = new Date(lastCycleStart);
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const dayInCycle = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
  return dayInCycle;
}

export function getDailyInfo(
  lastCycleStart: string,
  cycleLength: number,
  date?: Date
): DailyInfo {
  const dayInCycle = getDayInCycle(lastCycleStart, cycleLength, date);
  const phase = getPhaseForDay(dayInCycle, cycleLength);
  const nextPhase = getNextPhase(phase.id);
  const daysUntilNextPhase = phase.dayEnd - dayInCycle + 1;

  return {
    dayInCycle,
    phase,
    daysUntilNextPhase,
    nextPhaseName: nextPhase.name,
  };
}

export function getPhaseForDate(
  lastCycleStart: string,
  cycleLength: number,
  date: Date
) {
  const dayInCycle = getDayInCycle(lastCycleStart, cycleLength, date);
  return getPhaseForDay(dayInCycle, cycleLength);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function getCurrentCycleStart(lastCycleStart: string, cycleLength: number): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(lastCycleStart);
  start.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const completeCycles = Math.floor(diffDays / cycleLength);
  const currentStart = new Date(start);
  currentStart.setDate(currentStart.getDate() + completeCycles * cycleLength);
  return currentStart.toISOString().split('T')[0];
}
