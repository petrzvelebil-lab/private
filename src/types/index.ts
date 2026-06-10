export interface AppConfig {
  partnerName: string;
  cycleLength: number;
  lastCycleStart: string;
  notificationsEnabled: boolean;
  dailyTipEnabled: boolean;
  notificationTime: string;
  onboardingComplete: boolean;
}

export interface PartnerPreferences {
  comfortItems: {
    tea: string;
    chocolate: string;
    snack: string;
    comfortFood: string;
    movieGenre: string;
  };
  soothingActivities: string[];
  pmsAnnoyances: string[];
  loveLanguage: LoveLanguage | '';
  customRituals: string[];
}

export type LoveLanguage =
  | 'physical_touch'
  | 'words_of_affirmation'
  | 'gifts'
  | 'acts_of_service'
  | 'quality_time';

export interface CycleRecord {
  id: string;
  startDate: string;
  endDate?: string;
  cycleLength?: number;
  notes?: string;
}

export type PhaseId = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

export interface CyclePhase {
  id: PhaseId;
  name: string;
  dayStart: number;
  dayEnd: number;
  color: string;
  icon: string;
  description: string;
  feelings: string[];
  tips: string[];
  antiTips: string[];
}

export interface DailyInfo {
  dayInCycle: number;
  phase: CyclePhase;
  daysUntilNextPhase: number;
  nextPhaseName: string;
}
