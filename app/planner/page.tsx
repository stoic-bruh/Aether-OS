import MissionPlanner from '@/components/MissionPlanner';
// AFTER: The new import statement
import { Task } from '@/lib/types';

// Update your sample data to include values for the new properties
const sampleTasks: Task[] = [
  { 
    id: '1', // id must be a string
    title: 'Finalize quarterly report', 
    subject: 'Reports',
    priority: 1, // priority must be a number (e.g., 1=High)
    due_date: '2025-09-05',
    completed: false,
    created_at: '2025-08-28T10:00:00Z'
  },
  { 
    id: '2', // id must be a string
    title: 'Deploy Sentinel AI v1.1 update', 
    subject: 'Deployments',
    priority: 1, // priority must be a number
    due_date: '2025-09-10',
    completed: false,
    created_at: '2025-08-27T14:30:00Z'
  },
  { 
    id: '3', // id must be a string
    title: 'Review documentation for Practical 2', 
    subject: 'Documentation',
    priority: 2, // priority must be a number
    due_date: '2025-08-29',
    completed: true,
    created_at: '2025-08-26T11:00:00Z'
  },
];

export default function PlannerPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Mission Planner</h1>
      <p className="text-neutral-400">A tactical overview of your upcoming week.</p>
      <MissionPlanner tasks={sampleTasks} />
    </div>
  );
}