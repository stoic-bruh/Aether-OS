'use client';

// AFTER: The new import statement
import { Task } from '@/lib/types';

const Quadrant = ({ title, tasks, color }: { title: string, tasks: Task[], color: string }) => {
  return (
    <div className={`p-4 rounded-lg bg-neutral-900/50 border-t-4 ${color}`}>
      <h3 className="font-bold text-white mb-3">{title}</h3>
      <div className="space-y-2 min-h-[150px]">
        {tasks.map(task => (
          <div key={task.id} className="p-2 bg-neutral-800/50 rounded-md text-sm">
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function EisenhowerMatrix({ tasks }: { tasks: Task[] }) {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const isUrgent = (task: Task) => task.due_date && new Date(task.due_date) <= nextWeek;

  const quadrants = {
    do: tasks.filter(t => isUrgent(t) && t.priority <= 2),
    schedule: tasks.filter(t => !isUrgent(t) && t.priority <= 2),
    delegate: tasks.filter(t => isUrgent(t) && t.priority > 2),
    delete: tasks.filter(t => !isUrgent(t) && t.priority > 2),
  };

  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold mb-4 text-white">Eisenhower Matrix</h2>
      <p className="text-sm text-neutral-400 mb-4">Your tasks, automatically categorized by urgency and importance.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Quadrant title="Urgent & Important (Do)" tasks={quadrants.do} color="border-red-500" />
        <Quadrant title="Not Urgent & Important (Schedule)" tasks={quadrants.schedule} color="border-blue-500" />
        <Quadrant title="Urgent & Not Important (Delegate)" tasks={quadrants.delegate} color="border-yellow-500" />
        <Quadrant title="Not Urgent & Not Important (Delete)" tasks={quadrants.delete} color="border-neutral-500" />
      </div>
    </div>
  );
}
