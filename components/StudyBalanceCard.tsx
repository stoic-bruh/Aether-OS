'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBar } from 'lucide-react';

type SubjectHours = {
  [key: string]: number;
};

export default function StudyBalanceCard({ data }: { data: SubjectHours }) {
  const chartData = Object.keys(data).map(subject => ({
    name: subject,
    hours: data[subject],
  }));

  return (
    <div className="card-container h-96 flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
        <ChartBar className="text-cyan-400" />
        Weekly Study Balance
      </h2>
      {chartData.length > 0 ? (
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(100, 100, 100, 0.1)' }}
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 20, 0.9)',
                  borderColor: '#06b6d4',
                }}
              />
              <Bar dataKey="hours" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-neutral-500 text-center">Log some study hours to see your balance chart.</p>
        </div>
      )}
    </div>
  );
}