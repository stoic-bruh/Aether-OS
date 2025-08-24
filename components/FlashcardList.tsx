// in app/components/FlashcardList.tsx
'use client';
import { useState } from 'react';

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  subject: string | null;
};

function Flashcard({ card }: { card: Flashcard }) {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div className="[perspective:1000px] w-full h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div 
        className={`relative w-full h-full text-center transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front of card */}
        <div className="absolute w-full h-full card-container flex flex-col items-center justify-center [backface-visibility:hidden]">
          <p className="text-xs text-cyan-400">{card.subject || 'Flashcard'}</p>
          <p className="text-lg font-semibold text-white mt-2 p-2">{card.question}</p>
        </div>
        {/* Back of card */}
        <div className="absolute w-full h-full card-container flex flex-col items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <p className="text-md text-neutral-300 p-2">{card.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FlashcardList({ flashcards }: { flashcards: Flashcard[] }) {
  if (flashcards.length === 0) {
    return <p className="text-neutral-500 text-center py-8">No flashcards yet. Import some content to generate them!</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map(card => <Flashcard key={card.id} card={card} />)}
    </div>
  );
}