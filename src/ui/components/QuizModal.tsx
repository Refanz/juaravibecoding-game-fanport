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
    let cls = 'quiz-opt';
    if (done && i === quiz.correct) cls += ' correct';
    else if (done && i === selected) cls += ' wrong';
    return cls;
  };

  return (
    <div className="modal-overlay" id="quiz-modal">
      <div className="quiz-card">
        <div className="quiz-icon">{quiz.icon}</div>
        <div className="quiz-title">{quiz.title}</div>
        <div className="quiz-q">{quiz.question}</div>
        <div className="quiz-opts">
          {quiz.options.map((opt, i) => (
            <button key={i} className={optClass(i)} disabled={done} onClick={() => handleAnswer(i)}>
              {opt}
            </button>
          ))}
        </div>
        {done && (
          <div className={`quiz-feedback ${selected === quiz.correct ? 'success' : 'fail'}`}>
            {selected === quiz.correct ? quiz.successMsg : quiz.failMsg}
          </div>
        )}
      </div>
    </div>
  );
}
