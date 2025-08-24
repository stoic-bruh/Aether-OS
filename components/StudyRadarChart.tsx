// in app/components/StudyRadarChart.tsx
'use client';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { BrainCircuit } from 'lucide-react';

type StudyLog = {
  subject: string;
  hours: number;
};

export default function StudyRadarChart({ logs }: { logs: StudyLog[] }) {
  const subjectData: { [key: string]: number } = {};
  logs.forEach(log => {
    if (!subjectData[log.subject]) {
      subjectData[log.subject] = 0;
    }
    subjectData[log.subject] += log.hours;
  });

  const chartData = Object.keys(subjectData).map(subject => ({
    subject: subject,
    A: subjectData[subject],
    fullMark: Math.max(...Object.values(subjectData)) + 2,
  }));

  if (chartData.length < 3) {
    return (
      <div className="w-full h-full flex flex-col p-4 items-center justify-center">
        <p className="text-center text-neutral-500">Log sessions for at least 3 subjects to generate the radar.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <BrainCircuit className="text-cyan-400" />
        Study Balance
      </h2>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
            <PolarAngleAxis dataKey="subject" stroke="rgba(255, 255, 255, 0.7)" fontSize={12} />
            <Radar name="Hours" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
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