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
import MapModal from './MapModal';
import NetworkTopologyModal from './NetworkTopologyModal';
import DesktopUIModal from './DesktopUIModal';
import ElevatorModal from './ElevatorModal';

interface Props {
  onReturnToWelcome: () => void;
  isWelcome?: boolean;
}

export default function GameScreen({ onReturnToWelcome, isWelcome = false }: Props) {
  // Domain singletons (stable refs)
  const floor = useMemo(() => { const f = new FloorManager(); f.init(); return f; }, []);
  const gs = useMemo(() => { const g = new GameState(); g.startPlaying(); return g; }, []);

  // UI state (React)
  const [currentFloor, setCurrentFloor] = useState<1 | 2 | 3>(1);
  const [solvedCount, setSolvedCount] = useState(0);
  const [nearObject, setNearObject] = useState<number | null>(null);
  const [nearElevator, setNearElevator] = useState(false);
  const [nearCCTV, setNearCCTV] = useState(false);
  const [quizKey, setQuizKey] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transFloor, setTransFloor] = useState<1 | 2 | 3>(1);
  const [won, setWon] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTopology, setShowTopology] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showCCTV, setShowCCTV] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [showElevator, setShowElevator] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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
    const onOpenElevatorUI = () => setShowElevator(true);
    const onFloorChanged = (f: 1 | 2 | 3) => {
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
    EventBus.on('open_elevator_ui', onOpenElevatorUI);
    EventBus.on('floor_changed', onFloorChanged);
    EventBus.on('game_won', onGameWon);

    return () => {
      EventBus.off('near_object', onNearObject);
      EventBus.off('near_elevator', onNearElevator);
      EventBus.off('near_cctv', onNearCCTV);
      EventBus.off('open_quiz', onOpenQuiz);
      EventBus.off('open_cctv', onOpenCCTV);
      EventBus.off('open_elevator_ui', onOpenElevatorUI);
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
      {/* HUD - Premium Glassmorphism Responsive */}
      {!isWelcome && (
        <div id="hud" className="relative z-10 w-full flex items-center justify-between gap-2 py-2 px-3 sm:px-6 bg-gradient-to-r from-[#0f2027]/75 via-[#203a43]/75 to-[#2c5364]/75 backdrop-blur-lg border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Lantai Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 border border-hospital-sky/30 px-2.5 sm:px-4 py-1.5 rounded-lg shadow-inner backdrop-blur-sm transition-all hover:bg-black/50">
              <span className="text-[0.7rem] sm:text-sm drop-shadow-md">🏥</span>
              <span className="text-[0.55rem] sm:text-[0.65rem] font-bold text-hospital-sky tracking-widest uppercase">
                <span className="hidden sm:inline">Lantai </span>
                <span className="sm:hidden">Lt. </span>
                {currentFloor}
              </span>
            </div>
            {/* Skor Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-black/40 border border-medical-green/30 px-2.5 sm:px-4 py-1.5 rounded-lg shadow-inner backdrop-blur-sm transition-all hover:bg-black/50">
              <span className="text-[0.7rem] sm:text-sm drop-shadow-md">📊</span>
              <span className="text-[0.55rem] sm:text-[0.65rem] font-bold text-medical-green tracking-widest uppercase">
                <span className="hidden sm:inline">Skor: </span>{solvedCount}/{floor.totalObjects}
              </span>
            </div>
          </div>

          {/* Tanggal & Waktu Badge */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-0.5 sm:gap-4 bg-black/40 border border-white/10 px-2 sm:px-5 py-1 sm:py-1.5 rounded-lg shadow-inner backdrop-blur-sm font-[var(--font-pixel)] text-[0.45rem] sm:text-[0.55rem] text-medical-light transition-all hover:bg-black/50">
            <span className="flex items-center gap-1 sm:gap-1.5 text-hospital-sky opacity-90 leading-none">
              <span className="drop-shadow-md hidden sm:inline">📅</span> {currentDate}
            </span>
            <span className="hidden sm:block opacity-30">|</span>
            <span className="flex items-center gap-1 sm:gap-1.5 font-bold tracking-wider leading-none">
              <span className="drop-shadow-md hidden sm:inline">🕒</span> {currentTime}
            </span>
          </div>
        </div>
      )}

      {/* Phaser Game Container */}
      <div className="flex-1 overflow-hidden relative">
        {/* Floating Action Buttons */}
        {!isWelcome && (
          <div className="absolute top-4 left-4 flex flex-col gap-3 z-50 pointer-events-auto">
            <button 
              onClick={handlePause}
              className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full cursor-pointer transition-all duration-300 opacity-60 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center gap-2 group"
              title="Pause Game"
            >
              <span className="text-lg leading-none group-hover:scale-110 transition-transform">⏸️</span>
              <span className="text-[0.65rem] font-bold tracking-wider hidden sm:block">PAUSE</span>
            </button>
            <button 
              onClick={() => setShowDesktop(true)}
              className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full cursor-pointer transition-all duration-300 opacity-60 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center gap-2 group relative"
              title="Sistem Tiketing OS"
            >
              <span className="text-lg leading-none group-hover:scale-110 transition-transform">💻</span>
              <span className="text-[0.65rem] font-bold tracking-wider hidden sm:block">LAPTOP</span>
              {/* Notification Badge if there are unsolved tickets */}
              {floor.allObjects.filter(o => !o.solved).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-[0.45rem] text-white font-bold items-center justify-center">
                    !
                  </span>
                </span>
              )}
            </button>
            <button 
              onClick={() => setShowMap(true)}
              className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full cursor-pointer transition-all duration-300 opacity-60 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center gap-2 group"
              title="Buka Map"
            >
              <span className="text-lg leading-none group-hover:scale-110 transition-transform">🗺️</span>
              <span className="text-[0.65rem] font-bold tracking-wider hidden sm:block">MAP</span>
            </button>
            <button 
              onClick={() => setShowTopology(true)}
              className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full cursor-pointer transition-all duration-300 opacity-60 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center gap-2 group"
              title="Topologi Jaringan"
            >
              <span className="text-lg leading-none group-hover:scale-110 transition-transform">🌐</span>
              <span className="text-[0.65rem] font-bold tracking-wider hidden sm:block">TOPOLOGI</span>
            </button>
            <button 
              onClick={() => setShowInfo(true)}
              className="text-hospital-sky hover:text-white bg-dark/50 hover:bg-dark border border-hospital-blue/40 hover:border-hospital-blue w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-full cursor-pointer transition-all duration-300 opacity-60 hover:opacity-100 shadow-[0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center gap-2 group"
              title="Informasi Ikon"
            >
              <span className="text-lg leading-none group-hover:scale-110 transition-transform">ℹ️</span>
              <span className="text-[0.65rem] font-bold tracking-wider hidden sm:block">INFO</span>
            </button>
          </div>
        )}

        <PhaserGame floorManager={floor} gameState={gs} />
        {!isWelcome && <VirtualGamepad />}

        {/* Interaction hints */}
        {!isWelcome && nearObject !== null && !activeQuiz && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-dark/90 border border-hospital-sky py-1.5 px-4 text-[0.5rem] text-hospital-sky rounded pointer-events-none whitespace-nowrap">
            ⌨️ Tekan <span className="bg-hospital-blue py-0.5 px-1.5 rounded-sm mx-0.5">[SPASI]</span> untuk interaksi
          </div>
        )}
        {!isWelcome && nearElevator && nearObject === null && !activeQuiz && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-dark/90 border border-hospital-sky py-1.5 px-4 text-[0.5rem] text-hospital-sky rounded pointer-events-none whitespace-nowrap">
            🛗 Tekan <span className="bg-hospital-blue py-0.5 px-1.5 rounded-sm mx-0.5">[SPASI]</span> naik/turun lantai
          </div>
        )}
        {!isWelcome && nearCCTV && nearObject === null && !activeQuiz && !nearElevator && (
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

      {/* Map Modal */}
      {showMap && (
        <MapModal onClose={() => setShowMap(false)} initialFloor={currentFloor} />
      )}

      {/* Network Topology Modal */}
      {showTopology && (
        <NetworkTopologyModal onClose={() => setShowTopology(false)} />
      )}


      {/* Elevator Modal */}
      {showElevator && (
        <ElevatorModal 
          currentFloor={currentFloor} 
          onSelectFloor={(f) => {
            setShowElevator(false);
            EventBus.emit('do_change_floor', f);
          }} 
          onClose={() => setShowElevator(false)} 
        />
      )}

      {/* Desktop OS Modal */}
      {showDesktop && (
        <DesktopUIModal 
          objects={floor.allObjects}
          onClose={() => setShowDesktop(false)}
          onGoToLocation={(idx) => {
            if (gs.activeMarkerIndex !== null && gs.activeMarkerIndex !== idx) {
              setNotification("Anda sudah memiliki tiket yang sedang ditelusuri. Selesaikan tiket sebelumnya terlebih dahulu atau berinteraksi dengan sumber masalah untuk membatalkannya.");
              return;
            }
            gs.activeMarkerIndex = idx;
            setShowDesktop(false);
            EventBus.emit('pan_to_object', idx);
          }}
          onFixTicket={(idx) => {
            // Disabled: user must go to location
          }}
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

      {/* Custom Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[9999] animate-fade-in">
          <div className="bg-dark/95 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)] backdrop-blur-md rounded-lg p-4 flex items-start gap-3 max-w-sm">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <h4 className="text-orange-400 text-sm font-bold mb-1">Perhatian</h4>
              <p className="text-gray-300 text-[0.65rem] leading-relaxed">{notification}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
