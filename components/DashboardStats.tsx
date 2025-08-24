import { Check, Star, Clock } from 'lucide-react';

type StatsProps = {
  xp: number;
  tasksCompleted: number;
  hoursStudied: number;
};

const StatCard = ({ icon, value, label }: { icon: React.ElementType, value: number | string, label: string }) => {
  const Icon = icon;
  return (
    <div className="card-container flex items-center gap-4 p-4">
      <Icon className="h-8 w-8 text-cyan-400" />
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-neutral-400">{label}</p>
      </div>
    </div>
  );
};

export default function DashboardStats({ xp, tasksCompleted, hoursStudied }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard icon={Star} value={xp} label="Total XP" />
      <StatCard icon={Check} value={tasksCompleted} label="Tasks Completed" />
      <StatCard icon={Clock} value={hoursStudied.toFixed(2)} label="Hours Studied (Week)" />
    </div>
  );
}
