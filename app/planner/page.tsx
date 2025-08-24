import MissionPlanner from '@/components/MissionPlanner';

export default function PlannerPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Mission Planner</h1>
      <p className="text-neutral-400">A tactical overview of your upcoming week.</p>
      <MissionPlanner />
    </div>
  );
}
