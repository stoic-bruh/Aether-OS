'use client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ListChecks } from 'lucide-react';

// AFTER: The new import statement
import { Task } from '@/lib/types';

export default function TaskPriorityChart({ tasks }: { tasks: Task[] }) {
  // Aggregate data: count tasks per priority
  const priorityCounts = { '1-High': 0, '2-Medium': 0, '3-Low': 0 };
  tasks.forEach(task => {
    if (task.priority === 1) priorityCounts['1-High']++;
    else if (task.priority === 2) priorityCounts['2-Medium']++;
    else priorityCounts['3-Low']++;
  });

  const chartData = Object.keys(priorityCounts).map(p => ({
    priority: p,
    count: priorityCounts[p as keyof typeof priorityCounts],
  }));

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <ListChecks className="text-cyan-400" />
        Task Priority Radar
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
          <PolarAngleAxis dataKey="priority" stroke="rgba(255, 255, 255, 0.7)" />
          <Radar name="Count" dataKey="count" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.8)', borderColor: '#f59e0b' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
