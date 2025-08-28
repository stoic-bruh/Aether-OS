'use client';
import { useRouter } from 'next/navigation';
import { Target } from 'lucide-react';

// AFTER: The new import statement
import { Task } from '@/lib/types';
const priorityStyles: { [key: number]: string } = {
  1: "border-red-500/50 text-red-400",
  2: "border-yellow-500/50 text-yellow-400",
  3: "border-blue-500/50 text-blue-400",
};

export default function PrioritiesCard({ tasks }: { tasks: Task[] }) {
  const router = useRouter();

  const handleToggle = async (id: string, completed: boolean) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    router.refresh();
  };

  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <Target className="text-cyan-400" />
        Today's Priorities
      </h2>
      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="p-4 bg-neutral-900/70 border border-neutral-800 rounded-lg flex items-center gap-4">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id, task.completed)}
                className="h-5 w-5 rounded bg-neutral-800 border-neutral-700 text-cyan-500 focus:ring-cyan-600 cursor-pointer"
              />
              <div className="flex-grow">
                <p className={`text-neutral-200 font-medium ${task.completed ? 'line-through text-neutral-600' : ''}`}>{task.title}</p>
                {task.subject && (
                   <p className="text-xs text-neutral-500">{task.subject}</p>
                )}
              </div>
              <span className={`text-xs font-bold px-2 py-1 border rounded-md ${priorityStyles[task.priority] || priorityStyles[3]}`}>
                P{task.priority}
              </span>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 text-center py-8">No priorities to display. Add some tasks!</p>
        )}
      </div>
    </div>
  );
}
