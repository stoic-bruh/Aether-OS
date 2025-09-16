// A central place for all our data shapes

export type Task = {
  id: string;
  title: string;
  subject: string | null;
  priority: number;
  due_date: string | null;
  completed: boolean;
  created_at: string;
  description?: string;
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
  content: string | null;
  mood: number | null;
  created_at: string;
  type: 'morning' | 'evening';
  gratitude?: string | null;
  plan_for_day?: string | null;
  mental_win?: string | null;
  physical_win?: string | null;
  lesson_learned?: string | null;
};

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
  start_time: string;
  end_time: string;
  type: string;
  created_at: string;
  description?: string;
};

export type Resource = {
  id: string;
  title: string;
  url: string | null;
  content: string | null;
  type: string;
  subject: string | null;
};

// --- This section will be updated ---
export type QuizQuestion = 
  | {
      type: 'mcq';
      question: string;
      options: string[];
      correctAnswerIndex: number;
      correctAnswer: string;
      explanation: string;
    }
  | {
      type: 'true_false';
      question: string;
      correctAnswer: boolean;
      explanation: string;
    }
  | {
      type: 'one_word' | 'short_answer';
      question: string;
      correctAnswer: string;
      explanation: string;
    };

export type Quiz = {
  id: string;
  resource_id: string; // Keep track of which resource this quiz is for
  title: string;
  questions: QuizQuestion[];
};

