'use client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Triangle } from 'lucide-react';

type PerformanceData = {
  focus: number;       // Based on hours studied
  execution: number;   // Based on tasks completed
  wellbeing: number;   // Based on average mood
};

export default function PerformanceTriangle({ data }: { data: PerformanceData }) {
  // The data needs to be in an array format for the chart library
  const chartData = [
    { metric: 'Focus (hrs)', value: data.focus, fullMark: 10 },
    { metric: 'Execution (tasks)', value: data.execution, fullMark: 10 },
    { metric: 'Well-being (mood)', value: data.wellbeing, fullMark: 5 }, // Mood is on a scale of 1-5
  ];

  return (
    <div className="card-container h-96">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <Triangle className="text-cyan-400" />
        Performance Triangle
      </h2>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
          <PolarAngleAxis dataKey="metric" stroke="rgba(255, 255, 255, 0.7)" />
          <Radar name="Score" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(20, 20, 20, 0.8)', 
              borderColor: '#06b6d4',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
