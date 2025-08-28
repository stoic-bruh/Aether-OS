import { ListTodo } from 'lucide-react';

// Re-use the Task type definition
// AFTER: The new import statement
import { Task } from '@/lib/types';

export default function RecentTasks({ tasks }: { tasks: Task[] }) {
  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <ListTodo className="text-cyan-400" />
        Active Objectives
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="p-3 bg-neutral-900/70 border-l-2 border-neutral-700 rounded-lg">
              <p className="text-sm text-neutral-200 font-medium">{task.title}</p>
              {task.subject && (
                 <p className="text-xs text-neutral-500">{task.subject}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-neutral-500 text-center py-8">All objectives clear. Well done.</p>
        )}
      </div>
    </div>
  );
}
