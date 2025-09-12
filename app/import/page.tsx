'use client';

import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to prevent server-side crashes
const ImportForm = dynamic(() => import('@/components/ImportForm'), {
  ssr: false,
  loading: () => (
    <div className="max-w-4xl mx-auto p-6 bg-black/90 rounded-lg border border-cyan-500/50 shadow-lg shadow-cyan-500/20">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-800 rounded mb-4"></div>
        <div className="h-4 bg-gray-700 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-800 rounded"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
          <div className="h-10 bg-gray-800 rounded"></div>
          <div className="h-32 bg-gray-800 rounded"></div>
        </div>
      </div>
    </div>
  )
});

export default function ImportPage() {
  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Import Content to AetherOS
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Upload PDF or DOCX files, or paste text directly. Our AI will automatically 
            analyze your content and create tasks, flashcards, events, or save it as 
            a resource based on the content type.
          </p>
        </div>
        
        <ImportForm />
      </div>
    </div>
  );
}