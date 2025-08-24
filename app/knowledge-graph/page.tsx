// in app/knowledge-graph/page.tsx
export const revalidate = 0;
import { supabase } from '@/lib/supabaseClient';
import KnowledgeGraphView from '@/components/KnowledgeGraphView';

export default async function KnowledgeGraphPage() {
  // 1. Fetch all relevant data from Supabase
  const tasksPromise = supabase.from('tasks').select('id, title, subject');
  const logsPromise = supabase.from('study_logs').select('id, subject, hours');
  const notesPromise = supabase.from('quick_notes').select('id, content'); // Assuming notes don't have subjects yet

  const [{ data: tasks }, { data: studyLogs }, { data: notes }] = await Promise.all([tasksPromise, logsPromise, notesPromise]);

  // 2. Process data into nodes and links
  const nodes: { id: string; name: string; color?: string, group?: number }[] = [];
  const links: { source: string; target: string }[] = [];
  const subjects = new Set<string>();

  // Process tasks
  (tasks || []).forEach(task => {
    if (task.subject) {
      subjects.add(task.subject);
      nodes.push({ id: `task-${task.id}`, name: task.title, color: '#f59e0b', group: 2 });
      links.push({ source: task.subject, target: `task-${task.id}` });
    }
  });

  // Process study logs
  (studyLogs || []).forEach(log => {
    if (log.subject) {
      subjects.add(log.subject);
      nodes.push({ id: `log-${log.id}`, name: `${log.hours} hr session`, color: '#10b981', group: 3 });
      links.push({ source: log.subject, target: `log-${log.id}` });
    }
  });

  // For now, we'll link all notes to a central "Quick Notes" node
  if ((notes || []).length > 0) {
      const quickNotesNodeId = "quick-notes-hub";
      subjects.add(quickNotesNodeId); // Add the hub as a subject node
      (notes || []).forEach(note => {
        const noteName = note.content.substring(0, 20) + '...';
        nodes.push({ id: `note-${note.id}`, name: noteName, color: '#6366f1', group: 4 });
        links.push({ source: quickNotesNodeId, target: `note-${note.id}`});
      });
  }


  // Create nodes for each unique subject
  subjects.forEach(subject => {
    nodes.push({ id: subject, name: subject.toUpperCase(), color: '#06b6d4', group: 1 });
  });

  const graphData = { nodes, links };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Knowledge Graph</h1>
      <p className="text-neutral-400">A visual map of your AetherOS data.</p>
      <KnowledgeGraphView data={graphData} />
    </div>
  );
}