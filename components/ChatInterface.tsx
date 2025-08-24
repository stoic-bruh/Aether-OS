// in app/components/ChatInterface.tsx
'use client';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { Bot, User } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiMessageContent = '';
    const aiMessageId = crypto.randomUUID();

    // Add a placeholder for the AI's message
    setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '...' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      aiMessageContent += decoder.decode(value, { stream: true });

      // Update the AI's message content in real-time
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, content: aiMessageContent } : msg
      ));
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
        {messages.map(m => (
          <div key={m.id} className="flex gap-4 items-start">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-cyan-500' : 'bg-neutral-700'}`}>
              {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="flex-grow p-4 bg-neutral-900 rounded-lg border border-neutral-800">
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800">
        <div className="flex gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aether about your data..."
            className="input-field flex-grow"
            disabled={isLoading}
          />
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}