// in app/page.tsx
export const revalidate = 0;
import { supabase } from '@/lib/supabaseClient';
import MotivationCard from '@/components/MotivationCard';
import PrioritiesCard from '@/components/PrioritiesCard';
import DashboardStats from '@/components/DashboardStats';
import ActivityFeed, { ActivityItem } from '@/components/ActivityFeed';
import AnalyticsCarousel from '@/components/AnalyticsCarousel';

type Task = {
  id: string;
  title: string;
  subject: string | null;
  priority: number;
  completed: boolean;
  score?: number;
  created_at: string;
};

type StudyLog = {
  subject: string | null;
  hours: number;
  created_at: string;
  id: string;
};

type JournalEntry = {
  mood: number;
};

export default async function Home() {
  // --- Data Fetching for all dashboard components ---
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const tasksPromise = supabase.from('tasks').select('*');
  const logsPromise = supabase.from('study_logs').select('*, created_at, id').gte('created_at', sevenDaysAgo);
  const journalPromise = supabase.from('journal_entries').select('mood').gte('created_at', sevenDaysAgo);
  const profilePromise = supabase.from('user_profile').select('xp').single();
  
  const [{ data: allTasks }, { data: studyLogs }, { data: journalEntries }, { data: profile }] = await Promise.all([tasksPromise, logsPromise, journalPromise, profilePromise]);

  // --- Calculations for Components ---
  const incompleteTasks = (allTasks as Task[] | null)?.filter(t => !t.completed) || [];
  const completedTasks = (allTasks as Task[] | null)?.filter(t => t.completed) || [];
  const tasksCompletedThisWeek = completedTasks.filter(t => new Date(t.created_at) >= new Date(sevenDaysAgo)).length;
  const hoursStudiedThisWeek = (studyLogs || []).reduce((sum, log) => sum + log.hours, 0);
  const avgMood = (journalEntries || []).length > 0 ? (journalEntries as JournalEntry[]).reduce((sum, entry) => sum + entry.mood, 0) / journalEntries!.length : 3;
  const userXP = profile?.xp || 0;

  // Data for the Performance Triangle
  const performanceData = {
    focus: Math.min(hoursStudiedThisWeek, 10),
    execution: Math.min(tasksCompletedThisWeek, 10),
    wellbeing: avgMood,
  };
  
  // Sorting for Priorities Card
  const sortedIncompleteTasks = incompleteTasks.sort((a, b) => a.priority - b.priority);

  // --- Activity Feed Logic ---
  const activityFeed = [...completedTasks, ...(studyLogs || [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 15)
    .map(item => {
      if ('title' in item) { // It's a task
        return { type: 'task_completed', text: `Completed: "${item.title}"`, timestamp: item.created_at, id: `task-${item.id}` } as ActivityItem;
      } else { // It's a log
        return { type: 'log_created', text: `Logged ${item.hours}h for "${item.subject}"`, timestamp: item.created_at, id: `log-${item.id}` } as ActivityItem;
      }
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Command Center</h1>
        <p className="text-neutral-400">Real-time analysis of your AetherOS workspace.</p>
      </div>
      <DashboardStats xp={userXP} tasksCompleted={completedTasks.length} hoursStudied={hoursStudiedThisWeek} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <MotivationCard />
          <PrioritiesCard tasks={sortedIncompleteTasks} />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <AnalyticsCarousel 
            performanceData={performanceData} 
            studyData={studyLogs || []} 
            taskData={incompleteTasks} 
          />
          <ActivityFeed activities={activityFeed} />
        </div>
      </div>
    </div>
  );
}