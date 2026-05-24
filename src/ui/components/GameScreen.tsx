// ==========================================
// ui/components/GameScreen.tsx
// Komponen utama gameplay — canvas + HUD
// + modal quiz, transisi, win
// ==========================================

import { useEffect, useState, useCallback, useMemo } from 'react';
import { FloorManager } from '../../domain/FloorManager';
import { GameState } from '../../domain/GameState';
import { HOSPITAL_QUIZZES } from '../../infrastructure/data/quizzes';
import { AudioManager } from '../../infrastructure/assets/AudioManager';
import { EventBus } from '../../infrastructure/events/EventBus';
import { PhaserGame } from '../../domain/phaser/PhaserGame';
import QuizModal from './QuizModal';
import InfoModal from './InfoModal';
import PauseModal from './PauseModal';
import CCTVMonitorModal from './CCTVMonitorModal';
import VirtualGamepad from './VirtualGamepad';

interface Props {
  onReturnToWelcome: () => void;
}

export default function GameScreen({ onReturnToWelcome }: Props) {
  // Domain singletons (stable refs)
  const floor = useMemo(() => { const f = new FloorManager(); f.init(); return f; }, []);
  const gs = useMemo(() => { const g = new GameState(); g.startPlaying(); return g; }, []);

  // UI state (React)
  const [currentFloor, setCurrentFloor] = useState<1 | 2>(1);
  const [solvedCount, setSolvedCount] = useState(0);
  const [nearObject, setNearObject] = useState<number | null>(null);
  const [nearElevator, setNearElevator] = useState(false);
  const [nearCCTV, setNearCCTV] = useState(false);
  const [quizKey, setQuizKey] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transFloor, setTransFloor] = useState<1 | 2>(1);
  const [won, setWon] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showCCTV, setShowCCTV] = useState(false);

  const handlePause = () => {
    gs.isPaused = true;
    setShowPause(true);
  };

  const handleResume = () => {
    gs.isPaused = false;
    setShowPause(false);
  };

  const handleReturnToWelcomeFromPause = () => {
    gs.isPaused = false;
    onReturnToWelcome();
  };

  useEffect(() => {
    const onNearObject = (idx: number | null) => setNearObject(idx);
    const onNearElevator = (near: boolean) => setNearElevator(near);
    const onNearCCTV = (near: boolean) => setNearCCTV(near);
    const onOpenQuiz = (idx: number) => setQuizKey(idx);
    const onOpenCCTV = () => setShowCCTV(true);
    const onFloorChanged = (f: 1 | 2) => {
      setCurrentFloor(f);
      setTransFloor(f);
      setShowTransition(true);
      setTimeout(() => setShowTransition(false), 800);
    };
    const onGameWon = () => {
      setWon(true);
      gs.setWin();
      AudioManager.complete();
    };

    EventBus.on('near_object', onNearObject);
    EventBus.on('near_elevator', onNearElevator);
    EventBus.on('near_cctv', onNearCCTV);
    EventBus.on('open_quiz', onOpenQuiz);
    EventBus.on('open_cctv', onOpenCCTV);
    EventBus.on('floor_changed', onFloorChanged);
    EventBus.on('game_won', onGameWon);

    return () => {
      EventBus.off('near_object', onNearObject);
      EventBus.off('near_elevator', onNearElevator);
      EventBus.off('near_cctv', onNearCCTV);
      EventBus.off('open_quiz', onOpenQuiz);
      EventBus.off('open_cctv', onOpenCCTV);
      EventBus.off('floor_changed', onFloorChanged);
      EventBus.off('game_won', onGameWon);
    };
  }, [gs]);

  const handleCorrect = useCallback(() => {
    setSolvedCount(floor.solvedCount + 1); // optimism update
    EventBus.emit('quiz_closed', true);
    setQuizKey(null);
  }, [floor]);

  const handleWrong = useCallback(() => {
    EventBus.emit('quiz_closed', false);
    setQuizKey(null);
  }, []);

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
        <button 
          onClick={() => setShowInfo(true)}
          className="text-hospital-sky hover:text-white bg-hospital-blue/20 hover:bg-hospital-blue/40 border border-hospital-blue px-2 py-1 rounded cursor-pointer transition-colors text-[0.6rem] ml-2 flex items-center gap-1"
          title="Informasi Ikon"
        >
          <span>ℹ️</span> Info
        </button>
        <button 
          onClick={handlePause}
          className="text-hospital-sky hover:text-white bg-hospital-blue/20 hover:bg-hospital-blue/40 border border-hospital-blue px-2 py-1.5 rounded cursor-pointer transition-colors ml-1 flex items-center justify-center"
          title="Pause Game"
        >
          <span className="text-sm sm:text-base leading-none">⏸️</span>
        </button>
      </div>

      {/* Phaser Game Container */}
      <div className="flex-1 overflow-hidden relative">
        <PhaserGame floorManager={floor} gameState={gs} />
        <VirtualGamepad />

        {/* Interaction hints */}
        {nearObject !== null && !activeQuiz && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-dark/90 border border-hospital-sky py-1.5 px-4 text-[0.5rem] text-hospital-sky rounded pointer-events-none whitespace-nowrap">
            ⌨️ Tekan <span className="bg-hospital-blue py-0.5 px-1.5 rounded-sm mx-0.5">[SPASI]</span> untuk interaksi
          </div>
        )}
        {nearElevator && nearObject === null && !activeQuiz && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-dark/90 border border-hospital-sky py-1.5 px-4 text-[0.5rem] text-hospital-sky rounded pointer-events-none whitespace-nowrap">
            🛗 Tekan <span className="bg-hospital-blue py-0.5 px-1.5 rounded-sm mx-0.5">[SPASI]</span> naik/turun lantai
          </div>
        )}
        {nearCCTV && nearObject === null && !activeQuiz && !nearElevator && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-dark/90 border border-[#4fc3f7] py-1.5 px-4 text-[0.5rem] text-[#4fc3f7] rounded pointer-events-none whitespace-nowrap">
            📹 Tekan <span className="bg-[#1b4f72] py-0.5 px-1.5 rounded-sm mx-0.5">[SPASI]</span> Monitor CCTV
          </div>
        )}
      </div>

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

      {/* Info Modal */}
      {showInfo && (
        <InfoModal onClose={() => setShowInfo(false)} />
      )}

      {/* Pause Modal */}
      {showPause && (
        <PauseModal 
          onResume={handleResume} 
          onReturnToWelcome={handleReturnToWelcomeFromPause} 
          solvedCount={solvedCount} 
          totalObjects={floor.totalObjects} 
        />
      )}

      {/* CCTV Monitor Modal */}
      {showCCTV && (
        <CCTVMonitorModal onClose={() => setShowCCTV(false)} />
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
