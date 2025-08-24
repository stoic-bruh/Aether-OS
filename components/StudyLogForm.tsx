'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudyLogForm() {
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !hours.trim()) return;

    setIsLoading(true);
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, hours: parseFloat(hours), details }),
    });
    
    setIsLoading(false);
    setSubject('');
    setHours('');
    setDetails('');
    router.refresh();
  };

  return (
    <div className="card-container mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Log Study Session</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="input-field flex-grow"
            disabled={isLoading}
          />
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours"
            step="0.25"
            min="0"
            className="input-field w-32"
            disabled={isLoading}
          />
        </div>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Add detailed notes for this session..."
          className="input-field"
          rows={5}
          disabled={isLoading}
        />
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Logging...' : 'Log Session'}
        </button>
      </form>
    </div>
  );
}