// ==========================================
// ui/components/GameScreen.tsx
// Komponen utama gameplay — canvas + HUD
// + modal quiz, transisi, win
// ==========================================

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { SpriteMap } from '../../infrastructure/assets/AssetManager';
import { Player } from '../../domain/entities/Player';
import { FloorManager } from '../../domain/FloorManager';
import { GameState } from '../../domain/GameState';
import { HOSPITAL_QUIZZES } from '../../infrastructure/data/quizzes';
import { AudioManager } from '../../infrastructure/assets/AudioManager';
import { useGameLoop } from '../hooks/useGameLoop';
import { useInput } from '../hooks/useInput';
import QuizModal from './QuizModal';

interface Props {
  sprites: SpriteMap;
  onReturnToWelcome: () => void;
}

export default function GameScreen({ sprites, onReturnToWelcome }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Domain singletons (stable refs)
  const player = useMemo(() => new Player(3, 3), []);
  const floor  = useMemo(() => { const f = new FloorManager(); f.init(); return f; }, []);
  const gs     = useMemo(() => { const g = new GameState(); g.startPlaying(); return g; }, []);

  // UI state (React)
  const [currentFloor, setCurrentFloor]   = useState<1 | 2>(1);
  const [solvedCount,  setSolvedCount]     = useState(0);
  const [nearObject,   setNearObject]      = useState<number | null>(null);
  const [nearElevator, setNearElevator]    = useState(false);
  const [quizKey,      setQuizKey]         = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transFloor,   setTransFloor]      = useState<1 | 2>(1);
  const [won,          setWon]             = useState(false);

  const { keys, consumeKey } = useInput();

  // Resize canvas to fill viewport
  useEffect(() => {
    const resize = () => {
      if (!canvasRef.current) return;
      const hud = document.getElementById('hud');
      const hudH = hud?.offsetHeight ?? 40;
      canvasRef.current.width  = window.innerWidth;
      canvasRef.current.height = window.innerHeight - hudH;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const handleNearObject = useCallback((idx: number | null) => setNearObject(idx), []);
  const handleNearElevator = useCallback((near: boolean) => setNearElevator(near), []);

  const handleFloorChange = useCallback((f: 1 | 2) => {
    setCurrentFloor(f);
    setTransFloor(f);
    setShowTransition(true);
    setTimeout(() => setShowTransition(false), 800);
  }, []);

  const handleWin = useCallback(() => {
    if (won) return;
    setWon(true);
    gs.setWin();
    AudioManager.complete();
  }, [gs, won]);

  // Open quiz when gs.quizActive is set by game loop
  useEffect(() => {
    if (gs.quizActive && gs.quizObjectIndex !== null) {
      setQuizKey(gs.quizObjectIndex);
    }
  });

  const handleCorrect = useCallback(() => {
    if (gs.quizObjectIndex !== null) {
      floor.allObjects[gs.quizObjectIndex]?.solve();
      setSolvedCount(floor.solvedCount);
    }
    gs.quizActive = false;
    gs.quizObjectIndex = null;
    setQuizKey(null);
    if (floor.allSolved) handleWin();
  }, [floor, gs, handleWin]);

  const handleWrong = useCallback(() => {
    gs.quizActive = false;
    gs.quizObjectIndex = null;
    setQuizKey(null);
  }, [gs]);

  useGameLoop({
    canvasRef, sprites, player, floor, gs, keys, consumeKey,
    onNearObject: handleNearObject,
    onNearElevator: handleNearElevator,
    onFloorChange: handleFloorChange,
    onWin: handleWin,
  });

  const activeQuiz = quizKey !== null
    ? HOSPITAL_QUIZZES[quizKey % HOSPITAL_QUIZZES.length]
    : null;

  return (
    <div className="w-screen h-screen flex flex-col bg-surface">
      {/* HUD */}
      <div id="hud" className="flex items-center gap-4 py-1.5 px-4 bg-dark/90 border-b border-hospital-blue/30 text-[clamp(0.35rem,1vw,0.55rem)] flex-wrap">
        <span className="text-hospital-sky">🏥 Lantai {currentFloor}</span>
        <span className="text-text-dim flex-1">🔎 Temukan &amp; perbaiki perangkat IT rusak!</span>
        <span className="text-medical-green">📊 {solvedCount}/{floor.totalObjects}</span>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} id="gameCanvas" />

      {/* Interaction hints */}
      {nearObject !== null && !activeQuiz && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-dark/90 border border-hospital-sky py-1.5 px-4 text-[0.5rem] text-hospital-sky rounded pointer-events-none whitespace-nowrap">
          ⌨️ Tekan <span className="bg-hospital-blue py-0.5 px-1.5 rounded-sm mx-0.5">[SPASI]</span> untuk interaksi
        </div>
      )}
      {nearElevator && nearObject === null && !activeQuiz && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-dark/90 border border-hospital-sky py-1.5 px-4 text-[0.5rem] text-hospital-sky rounded pointer-events-none whitespace-nowrap">
          🛗 Tekan <span className="bg-hospital-blue py-0.5 px-1.5 rounded-sm mx-0.5">[SPASI]</span> naik/turun lantai
        </div>
      )}

      {/* Floor Transition */}
      {showTransition && (
        <div className="fixed inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 z-200 animate-fade-in">
          <div className="text-5xl animate-bounce-icon">🛗</div>
          <div className="text-[clamp(0.7rem,2vw,1.1rem)] text-hospital-sky">Menuju Lantai {transFloor}...</div>
        </div>
      )}

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}

      {/* Win Modal */}
      {won && (
        <div className="fixed inset-0 bg-black/88 flex items-center justify-center z-300 animate-fade-in">
          <div className="bg-dark border-2 border-medical-green rounded-lg p-8 text-center flex flex-col gap-5 max-w-[400px]">
            <div className="text-[2.5rem]">🏆</div>
            <div className="text-[clamp(0.8rem,2vw,1.2rem)] text-medical-light">MISI SELESAI!</div>
            <div className="text-[0.5rem] text-text-dim leading-[2]">
              Semua perangkat IT di Rumah Sakit<br />
              telah berhasil diperbaiki!<br />
              Pasien aman, sistem berjalan normal. ✅
            </div>
            <button
              id="btn-play-again"
              onClick={() => onReturnToWelcome()}
              className="bg-medical-green border-2 border-medical-light text-white font-[var(--font-pixel)] text-[0.55rem] py-3 px-6 cursor-pointer rounded transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_#66bb6a]"
            >
              🔄 MAIN LAGI
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
