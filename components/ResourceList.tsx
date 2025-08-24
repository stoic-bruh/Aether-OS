// in app/components/ResourceList.tsx
import { Link2 } from 'lucide-react';

type Resource = {
  id: string;
  title: string;
  url: string;
  type: string;
  subject: string | null;
};

export default function ResourceList({ resources }: { resources: Resource[] }) {
  // Group resources by subject
  const groupedResources = resources.reduce((acc, resource) => {
    const key = resource.subject || 'Uncategorized';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedResources).map(([subject, items]) => (
        <div key={subject} className="card-container">
          <h2 className="text-xl font-semibold text-white mb-4">{subject}</h2>
          <div className="space-y-3">
            {items.map(item => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-neutral-900/70 border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <Link2 className="text-cyan-400 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-medium text-neutral-200">{item.title}</p>
                  <p className="text-xs text-neutral-500">{item.type}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
      {resources.length === 0 && (
        <p className="text-neutral-500 text-center py-8">No resources saved yet.</p>
      )}
    </div>
  );
}