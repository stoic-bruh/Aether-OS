// in app/components/ImportForm.tsx
'use client';
import { useState } from 'react';

export default function ImportForm() {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const [source, setSource] = useState('NotebookLM');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    const response = await fetch('/api/bridge/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, subject, source }),
    });

    setIsLoading(false);
    if (response.ok) {
      setMessage('Success! Flashcards generated.');
      setText('');
      setSubject('');
    } else {
      setMessage('Error: Could not generate flashcards.');
    }
  };

  return (
    <div className="card-container">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your summary or notes here..."
          className="input-field"
          rows={15}
        />
        <div className="flex gap-4">
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (e.g., AI/ML)" className="input-field flex-grow" />
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Source (e.g., NotebookLM)" className="input-field flex-grow" />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isLoading}>
          {isLoading ? 'Processing with AI...' : 'Import & Generate Flashcards'}
        </button>
        {message && <p className="text-center text-sm text-neutral-400">{message}</p>}
      </form>
    </div>
  );
}