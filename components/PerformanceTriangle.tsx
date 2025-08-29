'use client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Triangle } from 'lucide-react';

// Define the shape of the data prop
type PerformanceData = {
  focus: number;
  execution: number;
  wellbeing: number;
};

// The component accepts a 'data' prop of type PerformanceData
export default function PerformanceTriangle({ data }: { data: PerformanceData }) {
  const chartData = [
    { metric: 'Focus (hrs)', value: data.focus, fullMark: 10 },
    { metric: 'Execution (tasks)', value: data.execution, fullMark: 10 },
    { metric: 'Well-being (mood)', value: data.wellbeing, fullMark: 5 }, // Mood is on a scale of 1-5
  ];

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <Triangle className="text-cyan-400" />
        Performance Triangle
      </h2>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
            <PolarAngleAxis dataKey="metric" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
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
    </div>
  );
}
