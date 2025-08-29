export const revalidate = 0; // Ensures data is always fresh on page load
import { supabase } from '@/lib/supabaseClient';
import MotivationCard from '@/components/MotivationCard';
import PrioritiesCard from '@/components/PrioritiesCard';
import DashboardStats from '@/components/DashboardStats';
import ActivityFeed from '@/components/ActivityFeed';
import AnalyticsCarousel from '@/components/AnalyticsCarousel';
import BrainDump from '@/components/BrainDump';
import { Task, StudyLog, JournalEntry, ActivityItem } from '@/lib/types';

export default async function Home() {
  // --- Data Fetching for all dashboard components ---
  // We fetch all data in parallel for maximum performance
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

  // Data for the Analytics Carousel
  const performanceData = {
    focus: Math.min(hoursStudiedThisWeek, 10),
    execution: Math.min(tasksCompletedThisWeek, 10),
    wellbeing: avgMood,
  };
  
  // Sorting for Priorities Card (by priority number, ascending)
  const sortedIncompleteTasks = incompleteTasks.sort((a, b) => a.priority - b.priority);

  // --- Activity Feed Logic ---
  // Combine completed tasks and study logs, sort by date, and take the latest 15
  const activityFeed: ActivityItem[] = [...completedTasks, ...(studyLogs || [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 15)
    .map(item => {
      if ('title' in item) { // This identifies the item as a Task
        return { type: 'task_completed', text: `Completed: "${item.title}"`, timestamp: item.created_at, id: `task-${item.id}` };
      } else { // Otherwise, it's a StudyLog
        return { type: 'log_created', text: `Logged ${item.hours}h for "${item.subject}"`, timestamp: item.created_at, id: `log-${item.id}` };
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
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          <MotivationCard />
          <PrioritiesCard tasks={sortedIncompleteTasks} />
          <BrainDump /> {/* <-- Brain Dump has been moved here */}
        </div>
        {/* Right Column */}
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

