// A central place for all our data shapes

export type Task = {
  id: string;
  title: string;
  description: string | null;
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

// --- This is the section we are fixing ---
export type JournalEntry = {
  id: string;
  content: string | null; // Can be null for morning entries
  mood: number | null;      // Can be null for morning entries
  created_at: string;
  
  // Add all the new optional fields
  type: 'morning' | 'evening' | 'reflection';
  gratitude?: string | null;
  plan_for_day?: string | null;
  mental_win?: string | null;
  physical_win?: string | null;
  lesson_learned?: string | null;
};
// --- End of fix ---

export type ActivityItem = {
  id: string;
  type: 'task_completed' | 'log_created';
  text: string;
  timestamp: string;
};

export type PlannedEvent = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string; // ISO String
  end_time: string;   // ISO String
  type: string;
  created_at: string;
};

export type Resource = {
  id: string;
  title: string;
  url: string | null;
  content: string | null;
  type: string;
  subject: string | null;
  source?: string | null;
};

