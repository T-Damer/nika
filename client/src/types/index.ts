export interface User {
  name: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  lastPeriodStart: string; // ISO date string
  cycleLength: number;
  periodLength: number;
  symptoms: string[];
  mood: string[];
  contraception: string;
  goals: string[];
  activityLevel: string;
  sleepPatterns: string;
  diet: string[];
  stressLevel: number;
  medicalConditions: string[];
  medications: string[];
  preferences: {
    language: 'en' | 'ru';
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  onboardingCompleted: boolean;
}

export interface CycleDay {
  date: string; // ISO date string
  type: 'period' | 'fertile' | 'ovulation' | 'normal';
  predicted: boolean;
}

export interface CalendarDayState {
  number: number;
  isCurrentMonth: boolean;
  isPeriod: boolean;
  isPredictedPeriod: boolean;
  isFertile: boolean;
  isOvulation: boolean;
  date: Date;
  isToday: boolean;
}

export interface CyclePhase {
  name: string;
  startDay: number;
  endDay: number;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  icon: string;
  forPhase: string;
  highlighted: boolean;
}
