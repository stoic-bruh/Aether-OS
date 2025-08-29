'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Task = {
  id: string;
  title: string;
  priority: number;
  due_date: string;
};

const getWeekDays = (start: Date) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    days.push(date);
  }
  return days;
};

export default function MissionPlanner({ tasks }: { tasks: Task[] }) {
  const [weekStart, setWeekStart] = useState(new Date());
  const router = useRouter();
  const weekDays = getWeekDays(weekStart);

  const addTask = async (date: Date) => {
    const title = prompt("Enter new task title for " + date.toLocaleDateString());
    if (title) {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority: 3, due_date: date.toISOString() }),
      });
      router.refresh();
    }
  };

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.due_date).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="card-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Weekly Mission Planner</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekStart(d => new Date(d.setDate(d.getDate() - 7)))} className="btn-ghost p-2"><ChevronLeft /></button>
          <span className="font-semibold text-sm md:text-base">{weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setWeekStart(d => new Date(d.setDate(d.getDate() + 7)))} className="btn-ghost p-2"><ChevronRight /></button>
        </div>
      </div>
      
      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-7 gap-2">
        {weekDays.map(day => (
          <div key={day.toISOString()} className="bg-neutral-900/50 rounded-lg p-2 min-h-[200px] flex flex-col">
            <p className="text-center font-bold text-sm text-neutral-300">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p className="text-center text-xs text-neutral-500 mb-2">{day.getDate()}</p>
            <div className="space-y-2 flex-grow">
              {(tasksByDate[day.toISOString().split('T')[0]] || []).map(event => (
                <div key={event.id} className="p-2 rounded text-xs bg-blue-900/70">{event.title}</div>
              ))}
            </div>
            <button onClick={() => addTask(day)} className="mt-2 text-neutral-500 hover:text-cyan-400 self-center"><PlusCircle size={16}/></button>
          </div>
        ))}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        {weekDays.map(day => (
          <div key={day.toISOString()} className="bg-neutral-900/50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold text-neutral-300">{day.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' })}</p>
              <button onClick={() => addTask(day)} className="text-neutral-500 hover:text-cyan-400"><PlusCircle size={18}/></button>
            </div>
            <div className="space-y-2 pl-2 border-l-2 border-neutral-700">
              {(tasksByDate[day.toISOString().split('T')[0]] || []).length > 0 ? (
                (tasksByDate[day.toISOString().split('T')[0]] || []).map(event => (
                  <div key={event.id} className="p-2 rounded text-sm bg-blue-900/70">{event.title}</div>
                ))
              ) : (
                <p className="text-xs text-neutral-600 italic pl-2">No objectives.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
