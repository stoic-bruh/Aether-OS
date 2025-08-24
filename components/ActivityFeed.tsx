import { CheckCircle2, Book, PenSquare } from 'lucide-react';

export type ActivityItem = 
  | { type: 'task_completed'; text: string; timestamp: string; id: string }
  | { type: 'log_created'; text: string; timestamp: string; id: string }
  | { type: 'note_created'; text: string; timestamp: string; id: string };

const iconMap = {
  task_completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  log_created: <Book className="h-5 w-5 text-blue-500" />,
  note_created: <PenSquare className="h-5 w-5 text-yellow-500" />,
};

export default function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="card-container">
      <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
      {/* ADDED SCROLLBAR CLASSES HERE */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {iconMap[activity.type]}
              </div>
              <div>
                <p className="text-sm text-neutral-200">{activity.text}</p>
                <p className="text-xs text-neutral-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-500 text-center py-8">No recent activity to display.</p>
        )}
      </div>
    </div>
  );
}
