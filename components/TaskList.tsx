// in app/components/TaskList.tsx
'use client';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
// AFTER: The new import statement
import { Task } from '@/lib/types';


const priorityStyles = {
  1: "border-red-500/80",
  2: "border-yellow-500/80",
  3: "border-blue-500/80",
};
const highlightStyle = "shadow-[0_0_15px_rgba(0,255,255,0.3)] bg-cyan-900/20";

export default function TaskList({ tasks, weakestSubject }: { tasks: Task[], weakestSubject: string }) {
  const router = useRouter();

  // --- ADD THESE FUNCTIONS BACK ---
  const handleToggle = async (id: string, completed: boolean) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    router.refresh();
  };
  // --- END OF FUNCTIONS ---

  return (
    <Card className="bg-neutral-950/50 border-cyan-500/20">
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">Mission Objectives</h2>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div 
              key={task.id} 
              className={cn(
                "flex items-center gap-4 p-4 bg-neutral-900/70 border-l-4 rounded-lg transition-all",
                priorityStyles[task.priority as keyof typeof priorityStyles],
                task.subject && task.subject === weakestSubject && !task.completed ? highlightStyle : "border-neutral-800"
              )}
            >
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => handleToggle(task.id, task.completed)}
              />
              <label
                htmlFor={task.id}
                className={`flex-grow font-medium leading-none ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}
              >
                {task.title}
                {task.subject && <span className="block text-xs text-neutral-400">{task.subject}</span>}
              </label>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(task.id)}>Delete</Button>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 text-center py-4">No active objectives.</p>
        )}
      </div>
    </Card>
  );
}