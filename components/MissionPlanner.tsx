'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

// --- Type Definition Fix ---
type Task = {
  id: string;
  title: string;
  priority: number;
  due_date: string | null; // This now correctly allows for null
  completed: boolean;
};
// -------------------------

// Helper to get dates for the next 7 days
const getNextSevenDays = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

export default function MissionPlanner({ tasks }: { tasks: Task[] }) {
  const [newTask, setNewTask] = useState({ title: '', date: new Date() });
  const router = useRouter();

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask.title, due_date: newTask.date.toISOString(), priority: 3 }),
    });
    setNewTask({ title: '', date: new Date() });
    router.refresh();
  };
  
  const days = getNextSevenDays();

  return (
    <div className="card-container space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Plan a new objective for a future date..."
          className="input-field flex-grow"
        />
        <button onClick={handleAddTask} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> Plan Objective
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {days.map(day => {
          const tasksForDay = tasks.filter(t => t.due_date && new Date(t.due_date).toDateString() === day.toDateString());
          return (
            <div key={day.toISOString()} className="bg-neutral-900/50 p-3 rounded-lg min-h-[150px]">
              <p className="font-bold text-center text-sm text-neutral-300 mb-2">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="font-bold text-center text-xl text-white mb-4">
                {day.getDate()}
              </p>
              <div className="space-y-2">
                {tasksForDay.map(task => (
                  <div key={task.id} className="text-xs p-2 bg-neutral-800 rounded text-center text-white truncate">
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
