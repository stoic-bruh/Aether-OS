// in app/tasks/page.tsx
export const revalidate = 0;
import { supabase } from '@/lib/supabaseClient';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default async function TasksPage() {
  // Fetch both tasks and study logs
  const tasksPromise = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  const logsPromise = supabase.from('study_logs').select('subject, hours').gte('log_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const [{ data: tasks }, { data: studyLogs }] = await Promise.all([tasksPromise, logsPromise]);

  // Calculate the weakest subject
  const subjectHours: { [key: string]: number } = {};
  (studyLogs || []).forEach(log => {
    if (log.subject) {
      subjectHours[log.subject] = (subjectHours[log.subject] || 0) + log.hours;
    }
  });
  let weakestSubject = '';
  if (Object.keys(subjectHours).length > 0) {
    weakestSubject = Object.keys(subjectHours).reduce((a, b) => subjectHours[a] < subjectHours[b] ? a : b);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Adaptive Task Hub</h1>
      <TaskForm />
      {/* Pass the weakest subject down to the TaskList */}
      <TaskList tasks={tasks || []} weakestSubject={weakestSubject} />
    </div>
  );
}