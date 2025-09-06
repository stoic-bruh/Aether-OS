export const revalidate = 0;
import { supabase } from '@/lib/supabaseClient';
import DayPlanner from '@/components/DayPlanner';
import { Task, PlannedEvent } from '@/lib/types';
import { startOfTomorrow } from 'date-fns';

export default async function PlannerPage() {
  const tomorrow = startOfTomorrow();
  const tomorrowStart = tomorrow.toISOString();
  const tomorrowEnd = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString();

  const { data: events } = await supabase
    .from('planned_events')
    .select('*')
    .gte('start_time', tomorrowStart)
    .lte('end_time', tomorrowEnd)
    .order('start_time', { ascending: true });
    
  const { data: tasks } = await supabase.from('tasks').select('*').eq('completed', false);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Tomorrow's Mission Plan</h1>
        <p className="text-neutral-400">Time-block your day for maximum productivity.</p>
      </div>
      {/* This page now uses your new interactive DayPlanner component */}
      <DayPlanner initialEvents={events || []} incompleteTasks={tasks || []} selectedDate={tomorrow} />
    </div>
  );
}