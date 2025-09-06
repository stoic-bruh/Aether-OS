// A central place for all our data shapes

export type Task = {
  id: string;
  title: string;
  subject: string | null;
  priority: number;
  due_date: string | null;
  completed: boolean;
  created_at: string;
};

export type StudyLog = {
  id: string;
  subject: string | null;
  hours: number;
  details: string | null;
  log_date: string;
  created_at: string;
};

export type JournalEntry = {
  id: string;
  content: string;
  mood: number;
  created_at: string;
};

export type ActivityItem = {
  id: string;
  type: 'task_completed' | 'log_created';
  text: string;
  timestamp: string;
};

// This is the new type we are adding
export type PlannedEvent = {
  id: string;
  user_id: string;
  title: string;
  start_time: string; // ISO String
  end_time: string;   // ISO String
  type: string;
  created_at: string;
};
