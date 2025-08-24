// in app/components/AISuggestionCard.tsx
'use client';
import { useState, useEffect } from 'react';

export default function AISuggestionCard() {
  const [suggestion, setSuggestion] = useState('Analyzing your study patterns...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const response = await fetch('/api/ai/suggestion');
        const data = await response.json();
        // A simple way to handle bold text from the API
        const formattedSuggestion = data.suggestion.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>');
        setSuggestion(formattedSuggestion);
      } catch (error) {
        setSuggestion('Could not load suggestion. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestion();
  }, []);

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 rounded-lg border border-neutral-800">
      <h2 className="text-xl font-semibold mb-4 text-white">
        <span className="text-cyan-400">AI</span> Suggestion ✨
      </h2>
      {isLoading ? (
        <div className="h-8 w-3/4 bg-neutral-800 rounded-md animate-pulse"></div>
      ) : (
        <p 
          className="text-neutral-300"
          dangerouslySetInnerHTML={{ __html: suggestion }} 
        />
      )}
    </div>
  );
}