// in app/components/ResourceForm.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResourceForm() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('Article');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    setIsLoading(true);
    await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, title, subject, type }),
    });

    setIsLoading(false);
    setUrl('');
    setTitle('');
    setSubject('');
    router.refresh();
  };

  return (
    <div className="card-container mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">Add New Resource</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="input-field"
          disabled={isLoading}
        />
        <div className="flex gap-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="input-field flex-grow"
            disabled={isLoading}
          />
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (e.g., AI/ML)"
            className="input-field flex-grow"
            disabled={isLoading}
          />
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field"
          disabled={isLoading}
        >
          <option>Article</option>
          <option>Video</option>
          <option>Paper</option>
          <option>Docs</option>
          <option>Other</option>
        </select>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Resource'}
        </button>
      </form>
    </div>
  );
}