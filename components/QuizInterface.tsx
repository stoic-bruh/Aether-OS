'use client';
import { useState } from 'react';
import { Resource, Quiz, QuizQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, Settings, BookCopy } from 'lucide-react';

// --- Results View Component (Updated with AetherOS Theme) ---
const QuizResults = ({ quiz, userAnswers, score, onRestart }: { quiz: Quiz, userAnswers: (string | number | boolean | null)[], score: number, onRestart: () => void }) => {
  return (
    <div className="card-container">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Quiz Results</h2>
        <p className="text-lg text-neutral-400 mb-4">{quiz.title}</p>
        <div className="bg-black/20 border border-cyan-400/30 rounded-lg p-6 mb-6">
          <p className="text-6xl font-bold text-cyan-400 mb-2">
            {score} / {quiz.questions.length}
          </p>
          <p className="text-xl text-purple-100">
            {Math.round((score / quiz.questions.length) * 100)}% Correct
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white border-b border-purple-600 pb-2">Review Your Answers</h3>
        {quiz.questions.map((q, index) => {
          const userAnswer = userAnswers[index];
          let isCorrect = false;
          let userAnswerText = 'Not answered';

          // Type checking for different question types
          if (q.type === 'mcq') {
            isCorrect = userAnswer === q.correctAnswerIndex;
            if(typeof userAnswer === 'number' && q.options) userAnswerText = q.options[userAnswer] || 'Invalid Answer';
          } else if (q.type === 'true_false') {
            const correctAnswerAsBool = (q.correctAnswer === true || String(q.correctAnswer).toLowerCase() === 'true');
            isCorrect = userAnswer === correctAnswerAsBool;
            if(typeof userAnswer === 'boolean') userAnswerText = userAnswer ? 'True' : 'False';
          } else { // one_word or short_answer
            const correctAnswerAsString = q.correctAnswer as string;
            isCorrect = typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === correctAnswerAsString.trim().toLowerCase();
            if(typeof userAnswer === 'string') userAnswerText = `"${userAnswer}"`;
          }

          return (
            <div key={index} className={`p-5 rounded-lg border transition-all duration-300 ${
              isCorrect 
                ? 'border-cyan-500/50 bg-cyan-500/10 shadow-md shadow-cyan-500/10' 
                : 'border-red-500/50 bg-red-500/10 shadow-md shadow-red-500/10'
            }`}>
              <div className="flex items-start gap-4">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-1" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                )}
                <div className="flex-grow">
                  <p className="font-semibold text-white text-lg mb-2">{q.question}</p>
                  <div className="space-y-1">
                    <p className={`text-sm ${isCorrect ? 'text-purple-100' : 'text-red-300'}`}>
                      <span className="font-medium">Your answer:</span> {userAnswerText}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-cyan-400">
                        <span className="font-medium">Correct answer:</span> {
                          q.type === 'mcq' && q.options 
                            ? q.options[q.correctAnswerIndex as number] 
                            : `"${q.correctAnswer}"`
                        }
                      </p>
                    )}
                  </div>
                  {q.explanation && (
                    <div className="mt-3 p-3 bg-black/20 rounded-md border border-purple-600/30">
                      <p className="text-sm text-purple-200 italic">
                        <span className="font-medium text-purple-100">Explanation:</span> {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={onRestart} className="btn-primary w-full mt-8">
        Take Another Quiz
      </button>
    </div>
  );
};

// --- Main Quiz Interface Component (Updated with AetherOS Theme) ---
export default function QuizInterface({ resources }: { resources: Resource[] }) {
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | string | boolean | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Customization State (Increased limits)
  const [numQuestions, setNumQuestions] = useState(8);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionTypes, setQuestionTypes] = useState(['mcq', 'one_word', 'true_false']);

  const handleGenerateQuiz = async () => {
    if (!selectedResourceId) {
      setError('Please select a resource to generate a quiz from.');
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedQuiz(null);

    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: selectedResourceId, numQuestions, difficulty, questionTypes }),
      });
      const quizData = await response.json();
      if (!response.ok) throw new Error(quizData.error || 'Failed to generate quiz.');
      
      setGeneratedQuiz(quizData);
      setUserAnswers(new Array(quizData.questions.length).fill(null));
      setCurrentQuestionIndex(0);
      setIsSubmitted(false);
      setScore(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (answer: number | string | boolean) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };
  
  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    generatedQuiz?.questions.forEach((q: QuizQuestion, index: number) => {
      const userAnswer = userAnswers[index];
      let isCorrect = false;

      if (q.type === 'mcq') {
        isCorrect = userAnswer === q.correctAnswerIndex;
      } else if (q.type === 'true_false') {
        const correctAnswerAsBool = (q.correctAnswer === true || String(q.correctAnswer).toLowerCase() === 'true');
        isCorrect = userAnswer === correctAnswerAsBool;
      } else { // one_word or short_answer
        const correctAnswerAsString = q.correctAnswer as string;
        isCorrect = typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === correctAnswerAsString.trim().toLowerCase();
      }

      if (isCorrect) correctAnswers++;
    });
    setScore(correctAnswers);
    setIsSubmitted(true);
  };
  
  const handleRestart = () => {
    setIsSubmitted(false);
    setGeneratedQuiz(null);
    setSelectedResourceId('');
  }

  const currentQuestion = generatedQuiz?.questions[currentQuestionIndex];
  
  if (isSubmitted && generatedQuiz) {
    return <QuizResults quiz={generatedQuiz} userAnswers={userAnswers} score={score} onRestart={handleRestart} />;
  }

  if (generatedQuiz && currentQuestion) {
    return (
      <div className="card-container">
        <div className="flex justify-between items-center mb-6">
          <div className="bg-black/30 border border-cyan-400/30 rounded-lg px-4 py-2">
            <p className="text-sm text-cyan-400 font-medium">
              Question {currentQuestionIndex + 1} of {generatedQuiz.questions.length}
            </p>
          </div>
          <div className="flex gap-2">
            {generatedQuiz.questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentQuestionIndex 
                    ? 'bg-cyan-400' 
                    : userAnswers[index] !== null 
                      ? 'bg-neutral-500' 
                      : 'bg-neutral-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 leading-relaxed">
            {currentQuestion.question}
          </h2>
        </div>
        
        {currentQuestion.type === 'mcq' && currentQuestion.options && (
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option: string, index: number) => (
              <button 
                key={index} 
                onClick={() => handleAnswerChange(index)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01]",
                  userAnswers[currentQuestionIndex] === index 
                    ? "bg-cyan-400/20 border-cyan-400 text-white" 
                    : "bg-black/20 border-purple-600/30 hover:bg-black/30 hover:border-purple-500/50 text-purple-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full border-2 transition-all duration-300",
                    userAnswers[currentQuestionIndex] === index
                      ? "border-cyan-400 bg-cyan-400"
                      : "border-purple-400"
                  )} />
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {(currentQuestion.type === 'one_word' || currentQuestion.type === 'short_answer') && (
          <div className="mb-8">
            <input 
              type="text" 
              className="input-field text-lg" 
              placeholder="Type your answer here..."
              value={(userAnswers[currentQuestionIndex] as string) || ''}
              onChange={(e) => handleAnswerChange(e.target.value)} 
            />
          </div>
        )}
        
        {currentQuestion.type === 'true_false' && (
          <div className="flex gap-4 mb-8">
             <button 
               onClick={() => handleAnswerChange(true)} 
               className={cn(
                 "btn flex-1 transition-all duration-300 hover:scale-[1.02]", 
                 userAnswers[currentQuestionIndex] === true 
                   ? 'bg-cyan-400 text-black' 
                   : 'btn-ghost'
               )}
             >
               True
             </button>
             <button 
               onClick={() => handleAnswerChange(false)} 
               className={cn(
                 "btn flex-1 transition-all duration-300 hover:scale-[1.02]", 
                 userAnswers[currentQuestionIndex] === false 
                   ? 'bg-red-500 text-white' 
                   : 'btn-ghost'
               )}
             >
               False
             </button>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} 
            disabled={currentQuestionIndex === 0} 
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          
          {currentQuestionIndex === generatedQuiz.questions.length - 1 ? (
            <button 
              onClick={handleSubmitQuiz} 
              className="btn-primary hover:scale-[1.02] transition-all duration-300"
            >
              Submit Quiz →
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQuestionIndex(prev => Math.min(generatedQuiz.questions.length - 1, prev + 1))} 
              className="btn-primary hover:scale-[1.02] transition-all duration-300"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="card-container">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-cyan-400/20 rounded-lg border border-cyan-400/30">
          <BookCopy className="h-6 w-6 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Generate New Quiz</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-purple-100 block mb-3">
            Select Resource
          </label>
          <select 
            value={selectedResourceId} 
            onChange={(e) => setSelectedResourceId(e.target.value)} 
            className="input-field"
          >
            <option value="" disabled>
              Choose a resource to generate quiz from...
            </option>
            {resources.filter(r => r.content).map(r => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>
        
        <div className="border-t border-purple-600 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black/20 rounded-lg border border-purple-600/30">
              <Settings className="h-5 w-5 text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">Quiz Settings</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-purple-100 block mb-2">
                Number of Questions
              </label>
              <input 
                type="number" 
                value={numQuestions} 
                onChange={(e) => setNumQuestions(parseInt(e.target.value))} 
                min="3" 
                max="25" 
                className="input-field" 
              />
              <p className="text-xs text-purple-300 mt-1">Between 3 and 25 questions</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-100 block mb-2">
                Difficulty Level
              </label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)} 
                className="input-field"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          onClick={handleGenerateQuiz} 
          disabled={isLoading || !selectedResourceId} 
          className="btn-primary w-full !mt-8 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-all duration-300"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2 inline-block"></div>
              Generating Quiz...
            </>
          ) : (
            'Generate Quiz'
          )}
        </button>
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}