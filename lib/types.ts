export type Task = {
  id: string; // Must be a string
  title: string;
  subject?: string; // Optional if not all tasks have a subject
  priority: number; // 1=High, 2=Medium, 3=Low
  due_date: string;
  completed: boolean; // Must be a boolean
  created_at: string; // Should be an ISO date string
};