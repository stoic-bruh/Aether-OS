'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TaskForm() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('3');
  const [dueDate, setDueDate] = useState(''); // State for the due date
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        subject, 
        priority: parseInt(priority), 
        due_date: dueDate || null // Send null if date is empty
      }),
    });

    setIsLoading(false);
    setTitle('');
    setSubject('');
    setPriority('3');
    setDueDate('');
    router.refresh();
  };

  return (
    <div className="card-container mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Add New Objective</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Objective Title..."
          className="input-field"
          disabled={isLoading}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (Optional)"
            className="input-field"
            disabled={isLoading}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="input-field"
            disabled={isLoading}
          >
            <option value="3">Low Priority</option>
            <option value="2">Medium Priority</option>
            <option value="1">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field"
            disabled={isLoading}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Add Objective'}
        </button>
      </form>
    </div>
  );
}
