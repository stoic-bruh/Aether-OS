// in app/components/TaskList.tsx
'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Task } from '@/lib/types'; // Using our central types file
import { cn } from '@/lib/utils';

const priorityStyles = {
  1: "border-red-500/80",
  2: "border-yellow-500/80",
  3: "border-blue-500/80",
};
const highlightStyle = "shadow-[0_0_15px_rgba(0,255,255,0.3)] bg-cyan-900/20";

export default function TaskList({ tasks, weakestSubject = '' }: { tasks: Task[], weakestSubject?: string }) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const router = useRouter();

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

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditText(task.title);
  };

  const handleSave = async (id: string) => {
    if (!editText.trim()) return; // Don't save if empty
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editText }),
    });
    setEditingTaskId(null);
    router.refresh();
  };

  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-white mb-4">Mission Objectives</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={cn(
              "flex items-center gap-4 p-4 bg-neutral-900/70 border-l-4 rounded-lg transition-all",
              priorityStyles[task.priority as keyof typeof priorityStyles],
              task.subject && task.subject === weakestSubject && !task.completed ? highlightStyle : "border-neutral-800"
            )}
          >
            <input
              type="checkbox"
              id={task.id}
              checked={task.completed}
              onChange={() => handleToggle(task.id, task.completed)}
              className="h-5 w-5 rounded bg-neutral-800 border-neutral-700 text-cyan-500 focus:ring-cyan-600 cursor-pointer"
            />
            <div className="flex-grow cursor-pointer" onClick={() => handleEdit(task)}>
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleSave(task.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSave(task.id) }}
                  className="input-field p-1"
                  autoFocus
                />
              ) : (
                <label
                  htmlFor={task.id}
                  className={`font-medium leading-none ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}
                >
                  {task.title}
                </label>
              )}
            </div>
            <button className="btn-ghost" onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}