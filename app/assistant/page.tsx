import ChatInterface from '@/components/ChatInterface';

export default function AssistantPage() {
  return (
    // This container ensures the ChatInterface has a defined height to fill
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-white mb-2">AI Assistant</h1>
        <p className="text-neutral-400 mb-6">Your context-aware helper. Ask me anything about your data.</p>
      </div>
      {/* The flex-grow class allows the chat interface to take up all remaining vertical space */}
      <div className="flex-grow">
        <ChatInterface />
      </div>
    </div>
  );
}
