'use client';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { Bot, User, Send } from 'lucide-react';

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
    if (!input.trim() || isLoading) return;

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

    if (!response.body) {
      setIsLoading(false);
      return;
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiMessageContent = '';
    const aiMessageId = crypto.randomUUID();

    setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      aiMessageContent += decoder.decode(value, { stream: true });
      
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, content: aiMessageContent } : msg
      ));
    }
    setIsLoading(false);
  };

  return (
    // This container ensures the component fills the available height
    <div className="flex flex-col h-[calc(100vh_-_10rem)] md:h-[calc(100vh_-_8rem)] bg-neutral-950/50 rounded-lg border border-cyan-500/20">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-6 p-4"
      >
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

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800 bg-neutral-950/80 rounded-b-lg">
        <div className="flex gap-4 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Aether..."
            className="input-field flex-grow"
            disabled={isLoading}
          />
          <button type="submit" className="btn-primary p-3" disabled={isLoading}>
            <Send size={20}/>
          </button>
        </div>
      </form>
    </div>
  );
}
