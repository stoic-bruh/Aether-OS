// in app/import/page.tsx
import ImportForm from '@/components/ImportForm';

export default function ImportPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Import Intelligence</h1>
      <p className="text-neutral-400">Paste content from any source (NotebookLM, articles, etc.). AetherOS will save it and generate practice flashcards for you.</p>
      <ImportForm />
    </div>
  );
}