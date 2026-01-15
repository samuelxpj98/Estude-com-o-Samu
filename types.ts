
export enum Screen {
  Welcome = 'welcome',
  Auth = 'auth',
  Topics = 'topics',
  LevelSelect = 'level-select',
  Study = 'study',
  Stats = 'stats',
  Profile = 'profile',
  Ranking = 'ranking'
}

export interface UserProfile {
  id: string;
  name: string;
  church: string;
  role: 'user' | 'admin';
  avatarColor: string;
  isProfileComplete: boolean;
  email?: string;
  phone?: string;
}

export interface SRSData {
  interval: number; // dias
  ease: number; // ease factor (padrão 2.5)
  repetitions: number;
  nextReview: string; // ISO Date
}

export interface TopicStats {
  wrong: number;
  review: number;
  correct: number;
}

export interface Topic {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  total: number;
  stats: TopicStats;
}

export interface Flashcard {
  id: string;
  topicId: string;
  category: string;
  question: string;
  answer: string;
  level: number;
  details?: string;
  status?: 'unused' | 'wrong' | 'review' | 'correct';
}

export interface UserStats {
  streak: number;
  lastLoginDate: string;
  lastAccessTimestamp: number;
  cardsToday: number;
  cardsLifetime: number;
  cardStates: Record<string, SRSData>; // Mapeamento ID do card -> Dados SRS
  activityLog?: Record<string, number>; // Log diário de atividades: "YYYY-MM-DD": count
}

export interface DailyActivity {
  day: string;
  cards: number;
  isToday?: boolean;
}