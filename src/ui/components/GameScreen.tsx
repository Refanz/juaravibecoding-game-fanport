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
    <div className="screen game-screen">
      {/* HUD */}
      <div id="hud" className="hud">
        <span className="hud-floor">🏥 Lantai {currentFloor}</span>
        <span className="hud-obj">🔎 Temukan &amp; perbaiki perangkat IT rusak!</span>
        <span className="hud-prog">📊 {solvedCount}/{floor.totalObjects}</span>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} id="gameCanvas" />

      {/* Interaction hints */}
      <div id="interaction-hint" className={`hint ${nearObject !== null && !activeQuiz ? '' : 'hidden'}`}>
        ⌨️ Tekan <span className="key">[SPASI]</span> untuk interaksi
      </div>
      <div id="elevator-hint" className={`hint ${nearElevator && nearObject === null && !activeQuiz ? '' : 'hidden'}`}>
        🛗 Tekan <span className="key">[SPASI]</span> naik/turun lantai
      </div>

      {/* Floor Transition */}
      <div className={`transition-overlay ${showTransition ? '' : 'hidden'}`} id="floor-transition">
        <div className="transition-icon">🛗</div>
        <div className="transition-text" id="transition-text">Menuju Lantai {transFloor}...</div>
      </div>

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}

      {/* Win Modal */}
      <div className={`win-overlay ${won ? '' : 'hidden'}`} id="win-modal">
        <div className="win-card">
          <div style={{ fontSize: '2.5rem' }}>🏆</div>
          <div className="win-title">MISI SELESAI!</div>
          <div className="win-sub">
            Semua perangkat IT di Rumah Sakit<br />
            telah berhasil diperbaiki!<br />
            Pasien aman, sistem berjalan normal. ✅
          </div>
          <button id="btn-play-again" className="btn-again" onClick={() => { onReturnToWelcome(); }}>
            🔄 MAIN LAGI
          </button>
        </div>
      </div>
    </div>
  );
}
