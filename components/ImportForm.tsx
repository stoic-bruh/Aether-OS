'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { cn } from '@/lib/utils'; // A helper for conditional classes

// This is the clever CDN-based PDF extraction function that works reliably.
async function extractPdfTextViaCDN(arrayBuffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // Dynamically create a script tag to load the library
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    
    script.onload = async () => {
      try {
        // @ts-ignore - pdfjsLib is loaded from the CDN into the global window scope
        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extractedText = '';
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          extractedText += pageText + '\n\n';
        }
        
        resolve(extractedText.trim());
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
    
    // Only add the script to the page if it doesn't already exist
    if (!document.querySelector('script[src*="pdf.min.js"]')) {
      document.head.appendChild(script);
    } else {
      // If the script is already there, just trigger the onload function manually
      // @ts-ignore
      script.onload(new Event('load'));
    }
  });
}

export default function ImportForm() {
  const [mode, setMode] = useState<'text' | 'doc' | 'image'>('text');
  
  // State for all modes
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // State for text mode
  const [text, setText] = useState('');
  const [source, setSource] = useState('');

  // State for file modes
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);
    setMessage(`Processing ${selectedFile.name}...`);
    setText(''); // Clear previous text
    setPreviewUrl(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      
      if (mode === 'doc') {
        let extractedText = '';
        if (selectedFile.type === 'application/pdf') {
          extractedText = await extractPdfTextViaCDN(arrayBuffer);
        } else if (selectedFile.type.includes('wordprocessingml.document')) {
          const mammoth = await import('mammoth');
          const result = await mammoth.extractRawText({ arrayBuffer });
          extractedText = result.value;
        } else {
          throw new Error('Unsupported document type. Please use PDF or DOCX.');
        }
        setText(extractedText);
        setMessage(`Text extracted successfully! Review and submit.`);
      } else if (mode === 'image') {
        // For images, we create a local preview URL
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setMessage(`Image "${selectedFile.name}" is ready for upload.`);
      }
    } catch (error: any) {
      console.error('File processing error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setMessage('Please enter a subject.');
      return;
    }

    setIsLoading(true);
    setMessage('Submitting to AetherOS...');
    
    try {
      let response;
      if (mode === 'image' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subject', subject);
        response = await fetch('/api/bridge/process-image', {
          method: 'POST',
          body: formData,
        });
      } else if (text.trim()) {
        response = await fetch('/api/bridge/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, subject, source: source || file?.name || 'Pasted Text' }),
        });
      } else {
        throw new Error("No content to submit.");
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'An unknown error occurred.');

      setMessage(result.message);
      // Reset form
      setText(''); setSubject(''); setSource(''); setFile(null); setPreviewUrl(null);
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      console.error('Submit error:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = isLoading || !subject.trim() || (mode === 'text' && !text.trim()) || (mode !== 'text' && !file);

  return (
    <div className="card-container">
      <div className="flex border-b border-neutral-800 mb-6">
        <button onClick={() => setMode('text')} className={cn('py-2 px-4 transition-colors', mode === 'text' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-neutral-400')}>Paste Text</button>
        <button onClick={() => setMode('doc')} className={cn('py-2 px-4 transition-colors', mode === 'doc' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-neutral-400')}>Upload Document</button>
        <button onClick={() => setMode('image')} className={cn('py-2 px-4 transition-colors', mode === 'image' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-neutral-400')}>Upload Image</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          id="subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (e.g., AI/ML)"
          className="input-field" required disabled={isLoading}
        />

        {mode === 'text' && (
          <textarea
            value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here..." rows={15}
            className="input-field custom-scrollbar" disabled={isLoading}
          />
        )}
        
        {(mode === 'doc' || mode === 'image') && (
          <div>
            <input
              id="file-input" type="file"
              accept={mode === 'doc' ? '.pdf,.docx' : 'image/*'}
              onChange={handleFileChange}
              className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-800 file:text-cyan-400 hover:file:bg-neutral-700"
              disabled={isLoading}
            />
            {mode === 'doc' && (
              <textarea
                readOnly value={text} placeholder="Extracted text will appear here..."
                rows={10} className="input-field mt-4 custom-scrollbar bg-neutral-900/50"
              />
            )}
            {mode === 'image' && previewUrl && (
              <img src={previewUrl} alt="Image preview" className="mt-4 rounded-lg max-h-64 w-auto mx-auto" />
            )}
          </div>
        )}

        <button type="submit" disabled={isSubmitDisabled} className="btn-primary w-full disabled:bg-neutral-600 disabled:cursor-not-allowed">
          {isLoading ? 'Processing...' : `Submit ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        </button>

        {message && (
          <div className={`p-4 rounded-md text-center ${
            message.includes('Error') ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}