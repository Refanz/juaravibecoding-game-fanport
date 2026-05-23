// ==========================================
// ui/components/QuizModal.tsx
// ==========================================

import { useState } from 'react';
import { Quiz } from '../../infrastructure/data/quizzes';
import { AudioManager } from '../../infrastructure/assets/AudioManager';

interface Props {
  quiz: Quiz;
  onCorrect: () => void;
  onWrong: () => void;
}

export default function QuizModal({ quiz, onCorrect, onWrong }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const handleAnswer = (i: number) => {
    if (done) return;
    setSelected(i); setDone(true);
    if (i === quiz.correct) {
      AudioManager.correct();
      setTimeout(onCorrect, 1200);
    } else {
      AudioManager.wrong();
      setTimeout(onWrong, 1800);
    }
  };

  const optClass = (i: number) => {
    const base = 'bg-dark-card border border-hospital-blue/30 text-text-bright font-[var(--font-pixel)] text-[clamp(0.4rem,1vw,0.6rem)] py-2.5 px-4 cursor-pointer rounded text-left transition-all duration-150 leading-relaxed';
    const hover = 'hover:not-disabled:bg-hospital-blue hover:not-disabled:border-hospital-sky';
    if (done && i === quiz.correct) return `${base} !bg-[#1b5e20] !border-medical-green`;
    if (done && i === selected)     return `${base} !bg-[#b71c1c] !border-red-alert`;
    return `${base} ${hover}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 animate-fade-in" id="quiz-modal">
      <div className="bg-dark border-2 border-hospital-blue rounded-lg p-6 max-w-[580px] w-full flex flex-col gap-4">
        <div className="text-2xl text-center">{quiz.icon}</div>
        <div className="text-[clamp(0.6rem,1.5vw,0.85rem)] text-hospital-sky text-center">{quiz.title}</div>
        <div className="text-[clamp(0.45rem,1.2vw,0.65rem)] text-text-bright leading-[1.9]">{quiz.question}</div>
        <div className="flex flex-col gap-2">
          {quiz.options.map((opt, i) => (
            <button key={i} className={optClass(i)} disabled={done} onClick={() => handleAnswer(i)}>
              {opt}
            </button>
          ))}
        </div>
        {done && (
          <div className={`text-[0.5rem] p-2.5 rounded text-center leading-[1.8] ${
            selected === quiz.correct
              ? 'bg-[#1b5e20] text-[#a5d6a7]'
              : 'bg-[#b71c1c] text-[#ef9a9a]'
          }`}>
            {selected === quiz.correct ? quiz.successMsg : quiz.failMsg}
          </div>
        )}
      </div>
    </div>
  );
}
