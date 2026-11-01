export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'NEEDS_REVISION';

export interface NoteImage {
  id: string;
  url: string; // Base64 data URL or external URL (Cloudinary/Supabase)
  caption?: string;
  createdAt: string;
}

export interface TopicNote {
  id: string;
  topicId: string;
  markdown: string;
  keyTakeaways: string[];
  relatedTopics: string[];
  images: NoteImage[];
  lastUpdated: string;
}

export interface TopicResource {
  title: string;
  url?: string;
}

export interface Topic {
  id: string;
  sectionId: string;
  title: string;
  description?: string;
  dayRange?: string; // e.g., "Day 1", "Days 1–3"
  resources?: TopicResource[];
  order: number;
  status: TopicStatus;
  note?: TopicNote;
  lastStudied?: string;
  createdAt: string;
}

export interface Section {
  id: string;
  trackId: string;
  parentId?: string | null;
  title: string;
  description?: string;
  order: number;
  isComingSoon: boolean;
  subsections?: Section[];
  topics?: Topic[];
}

export interface Track {
  id: string;
  slug: 'dsa' | 'development' | 'ai-ml' | 'system-design' | 'devops' | 'core-subjects' | string;
  name: string;
  description: string;
  estimatedHours: number;
  iconName: string;
  badgeColor: string;
  sections: Section[];
  isExternal?: boolean;
  externalUrl?: string;
}

export interface DailyActivity {
  id: string;
  date: string; // YYYY-MM-DD
  trackSlug: string;
  trackName: string;
  topicId?: string;
  topicTitle: string;
  minutesSpent: number;
  topicsCompleted: number;
  remarks: string;
  createdAt: string;
}

export interface DailyGoal {
  date: string; // YYYY-MM-DD
  targetMinutes: number;
  targetTopics: number;
  isCompleted: boolean;
  remarks?: string;
}

export interface TrackStats {
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  needsRevisionTopics: number;
  pendingTopics: number;
  progressPercentage: number;
  lastStudiedDate?: string;
  estimatedHours: number;
}

export interface DashboardStats {
  totalTracks: number;
  totalTopics: number;
  completedTopics: number;
  inProgressTopics: number;
  pendingTopics: number;
  overallPercentage: number;
  totalLearningHours: number;
  currentStreak: number;
  longestStreak: number;
  todayMinutes: number;
  todayCompletedCount: number;
}
