
export enum Screen {
  Welcome = 'welcome',
  Auth = 'auth',
  Topics = 'topics',
  LevelSelect = 'level-select',
  Study = 'study',
  Stats = 'stats',
  Profile = 'profile',
  AI = 'ai'
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

export interface DailyActivity {
  day: string;
  cards: number;
  isToday?: boolean;
}

export interface UserStats {
  streak: number;
  lastLoginDate: string;
  lastAccessTimestamp: number; // Novo campo para controle de 30min
  cardsToday: number;
  cardsLifetime: number;
}
