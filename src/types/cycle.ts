export type Language = 'en' | 'hi';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface CycleSettings {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLength: number; // typically 21 - 40, default 28
  periodLength: number; // typically 3 - 8, default 5
}

export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface DailyLog {
  date: string; // YYYY-MM-DD
  flow?: FlowLevel;
  symptoms: string[];
  moods: string[];
  energy?: EnergyLevel;
  waterGlasses?: number;
  sleepHours?: number;
  notes?: string;
  updatedAt: string;
}

export interface PeriodProduct {
  id: string;
  nameKey: string;
  categoryKey: string;
  absorbencyMl: string;
  wearTimeHours: string;
  ecoScore: string;
  prosKeys: string[];
  consKeys: string[];
  bestForKey: string;
}

export interface DoctorSpecialist {
  id: string;
  name: string;
  clinic: string;
  city: string;
  qualification: string;
  specialtyKey: string;
  languages: string[];
  consultationTypeKey: string;
  experienceYears: number;
}

export interface ForumReply {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  author: string;
  categoryKey: string;
  titleKey?: string;
  title: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: ForumReply[];
}

export interface CycleBuddyConfig {
  paired: boolean;
  buddyName: string;
  buddyCode: string;
  sharePhase: boolean;
  shareSymptoms: boolean;
}
