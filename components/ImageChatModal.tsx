'use client';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { Bot, User, X } from 'lucide-react';

// Define the shape of a message object for TypeScript to prevent 'any' type errors
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

type Props = {
  imageUrl: string;
  onClose: () => void;
};

export default function ImageChatModal({ imageUrl, onClose }: Props) {
  // We now manage the chat state manually using standard React hooks instead of useChat
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat on new messages
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

    try {
      // Call our stable, corrected vision API
      const response = await fetch('/api/ai/vision-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, imageUrl }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get a valid response from the server.');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageContent = '';
      const aiMessageId = crypto.randomUUID();

      // Add a placeholder for the AI's message to start streaming into
      setMessages(prev => [...prev, { id: aiMessageId, role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiMessageContent += decoder.decode(value, { stream: true });
        
        // Update the AI's message content in real-time as chunks arrive
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, content: aiMessageContent } : msg
        ));
      }
    } catch (error) {
      console.error("Error during vision chat submission:", error);
      // Add a user-facing error message in the chat
      setMessages(prev => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="card-container w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">Chat with Image</h2>
          <button onClick={onClose} className="btn-ghost p-2 rounded-full"><X size={20} /></button>
        </div>
        
        <div className="flex-grow overflow-y-auto custom-scrollbar p-4" ref={chatContainerRef}>
           <div className="space-y-6">
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
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-800 flex-shrink-0">
          <div className="flex gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the image..."
              className="input-field flex-grow"
              disabled={isLoading}
            />
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? '...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}