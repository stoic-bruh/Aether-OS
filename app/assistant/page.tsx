// in app/assistant/page.tsx
import ChatInterface from '@/components/ChatInterface';

export default function AssistantPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">AI Assistant</h1>
      <p className="text-neutral-400 mb-8">Your context-aware helper. Ask me anything about your data.</p>
      <ChatInterface />
    </div>
  );
}