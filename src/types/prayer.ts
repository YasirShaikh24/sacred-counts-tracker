export interface PrayerCard {
  id: string;
  name: string;
  currentCount: number;
  targetCount: number;
  progress: number; // percentage 0-100
}

export interface AppData {
  cards: PrayerCard[];
  adminPin: string;
}