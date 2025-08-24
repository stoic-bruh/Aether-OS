export const revalidate = 0;
import { supabase } from '@/lib/supabaseClient';
import PomodoroTimer from '@/components/PomodoroTimer';
import EisenhowerMatrix from '@/components/EisenhowerMatrix';
import BrainDump from '@/components/BrainDump';

export default async function UtilitiesPage() {
  // Fetch all incomplete tasks from the database
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('completed', false);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Utilities</h1>
      <p className="text-neutral-400">A collection of tools to enhance your productivity.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <PomodoroTimer />
          <BrainDump />
        </div>
        <div>
          {/* Pass the fetched tasks to the component */}
          <EisenhowerMatrix tasks={tasks || []} />
        </div>
      </div>
    </div>
  );
}
