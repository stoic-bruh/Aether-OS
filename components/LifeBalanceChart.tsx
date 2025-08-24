// in app/components/LifeBalanceChart.tsx
'use client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { HeartPulse } from 'lucide-react';

export default function LifeBalanceChart() {
  const chartData = [
    { category: 'Study', value: 8, fullMark: 10 },
    { category: 'Fitness', value: 6, fullMark: 10 },
    { category: 'Social', value: 7, fullMark: 10 },
    { category: 'Rest', value: 9, fullMark: 10 },
    { category: 'Hobbies', value: 5, fullMark: 10 },
  ];

  return (
    <div className="w-full h-full flex flex-col p-4">
       <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <HeartPulse className="text-cyan-400" />
        Life Balance Goals
      </h2>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
            <PolarAngleAxis dataKey="category" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
            <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(20, 20, 20, 0.8)', 
                borderColor: '#8b5cf6',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}