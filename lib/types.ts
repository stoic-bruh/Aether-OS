// This file is the single source of truth for all data shapes in AetherOS.

export type Task = {
  id: string;
  title: string;
  subject: string | null;
  priority: number;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  score?: number; // Optional score for sorting
};

export type StudyLog = {
  id: string;
  subject: string | null;
  hours: number;
  details?: string | null;
  created_at: string;
};

export type JournalEntry = {
  id: string;
  content: string;
  mood: number;
  created_at: string;
};

// This type is specifically for the dashboard's activity feed
export type ActivityItem = {
  id: string;
  type: 'task_completed' | 'log_created';
  text: string;
  timestamp: string;
};

