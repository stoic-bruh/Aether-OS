import { supabase } from '@/lib/supabaseClient';
import { Goal, Skill, Task } from '@/lib/types';
import RoadmapClient from '@/components/RoadmapClient';

export default async function RoadmapPage() {
  // Fetch all the necessary data for the roadmap
  const goalsPromise = supabase.from('goals').select('*').order('created_at', { ascending: false });
  const skillsPromise = supabase.from('skills').select('*').order('created_at', { ascending: true });
  const tasksPromise = supabase.from('tasks').select('*').order('created_at', { ascending: true });

  const [
    { data: goals },
    { data: skills },
    { data: tasks }
  ] = await Promise.all([goalsPromise, skillsPromise, tasksPromise]);

  return (
    <div className="min-h-screen bg-gray-50">
      <RoadmapClient 
        initialGoals={goals as Goal[] || []} 
        initialSkills={skills as Skill[] || []} 
        tasks={tasks as Task[] || []} 
      />
    </div>
  );
}