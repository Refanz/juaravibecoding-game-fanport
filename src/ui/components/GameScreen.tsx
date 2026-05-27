// ==========================================
// ui/components/GameScreen.tsx
// Komponen utama gameplay — canvas + HUD
// + modal quiz, transisi, win
// ==========================================

import { useEffect, useState, useCallback, useMemo } from "react";
import { FloorManager } from "../../domain/FloorManager";
import { GameState } from "../../domain/GameState";
import { HOSPITAL_QUIZZES } from "../../infrastructure/data/quizzes";
import { EventBus } from "../../infrastructure/events/EventBus";
import { PhaserGame } from "../../domain/phaser/PhaserGame";

// Custom Hooks
import { useGameTime } from "../hooks/useGameTime";
import { useGameEvents } from "../hooks/useGameEvents";

// Subcomponents
import FloatingHUD from "./FloatingHUD";
import ActionButtons from "./ActionButtons";
import InteractionHints from "./InteractionHints";
import WinModal from "./WinModal";
import NotificationToast from "./NotificationToast";

// Modals
import QuizModal from "./QuizModal";
import InfoModal from "./InfoModal";
import PauseModal from "./PauseModal";
import CCTVMonitorModal from "./CCTVMonitorModal";
import VirtualGamepad from "./VirtualGamepad";
import MapModal from "./MapModal";
import NetworkTopologyModal from "./NetworkTopologyModal";
import DesktopUIModal from "./DesktopUIModal";
import ElevatorModal from "./ElevatorModal";

interface Props {
  onReturnToWelcome: () => void;
  isWelcome?: boolean;
}

export default function GameScreen({
  onReturnToWelcome,
  isWelcome = false,
}: Props) {
  // Domain singletons (stable refs)
  const floor = useMemo(() => {
    const f = new FloorManager();
    f.init();
    return f;
  }, []);
  
  const gs = useMemo(() => {
    return new GameState();
  }, []);

  useEffect(() => {
    if (isWelcome) {
      gs.screen = "welcome";
    } else {
      gs.startPlaying();
    }
  }, [isWelcome, gs]);

  const { currentTime, currentDate, currentPeriod } = useGameTime();

  const {
    currentFloor,
    nearObject,
    nearElevator,
    nearCCTV,
    quizKey,
    setQuizKey,
    showTransition,
    transFloor,
    won,
    showCCTV,
    setShowCCTV,
    showElevator,
    setShowElevator,
  } = useGameEvents(gs);

  // Additional UI states
  const [solvedCount, setSolvedCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTopology, setShowTopology] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handlePause = useCallback(() => {
    gs.isPaused = true;
    setShowPause(true);
    EventBus.emit("game_paused", true);
  }, [gs]);

  const handleResume = useCallback(() => {
    gs.isPaused = false;
    setShowPause(false);
    EventBus.emit("game_paused", false);
  }, [gs]);

  const handleReturnToWelcomeFromPause = useCallback(() => {
    gs.isPaused = false;
    EventBus.emit("game_paused", false);
    onReturnToWelcome();
  }, [gs, onReturnToWelcome]);

  const handleCorrect = useCallback(() => {
    setSolvedCount(floor.solvedCount + 1); // optimism update
    EventBus.emit("quiz_closed", true);
    setQuizKey(null);
  }, [floor]);

  const handleWrong = useCallback(() => {
    EventBus.emit("quiz_closed", false);
    setQuizKey(null);
  }, [setQuizKey]);

  const activeQuiz =
    quizKey !== null
      ? HOSPITAL_QUIZZES[quizKey % HOSPITAL_QUIZZES.length]
      : null;

  return (
    <div className="w-screen h-screen flex flex-col bg-surface">
      {!isWelcome && (
        <FloatingHUD
          currentFloor={currentFloor}
          solvedCount={solvedCount}
          totalObjects={floor.totalObjects}
          currentDate={currentDate}
          currentTime={currentTime}
          currentPeriod={currentPeriod}
        />
      )}

      {/* Phaser Game Container */}
      <div className="flex-1 overflow-hidden relative">
        {!isWelcome && (
          <ActionButtons
            onPause={handlePause}
            onDesktop={() => setShowDesktop(true)}
            onMap={() => setShowMap(true)}
            onTopology={() => setShowTopology(true)}
            onInfo={() => setShowInfo(true)}
            unsolvedCount={floor.allObjects.filter((o) => !o.solved).length}
          />
        )}

        <PhaserGame floorManager={floor} gameState={gs} />
        
        {!isWelcome && <VirtualGamepad />}

        {!isWelcome && (
          <InteractionHints
            nearObject={nearObject}
            activeQuiz={activeQuiz !== null}
            nearElevator={nearElevator}
            nearCCTV={nearCCTV}
          />
        )}
      </div>

      {/* Floor Transition */}
      {showTransition && (
        <div className="fixed inset-0 bg-black/85 flex flex-col items-center justify-center gap-4 z-200 animate-fade-in">
          <div className="text-5xl animate-bounce-icon">🛗</div>
          <div className="text-[clamp(0.7rem,2vw,1.1rem)] text-hospital-sky">
            Menuju Lantai {transFloor}...
          </div>
        </div>
      )}

      {/* Modals */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
        />
      )}

      {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

      {showPause && (
        <PauseModal
          onResume={handleResume}
          onReturnToWelcome={handleReturnToWelcomeFromPause}
          solvedCount={solvedCount}
          totalObjects={floor.totalObjects}
        />
      )}

      {showCCTV && <CCTVMonitorModal onClose={() => setShowCCTV(false)} />}

      {showMap && (
        <MapModal
          onClose={() => setShowMap(false)}
          initialFloor={currentFloor}
        />
      )}

      {showTopology && (
        <NetworkTopologyModal onClose={() => setShowTopology(false)} />
      )}

      {showElevator && (
        <ElevatorModal
          currentFloor={currentFloor}
          onSelectFloor={(f) => {
            setShowElevator(false);
            EventBus.emit("do_change_floor", f);
          }}
          onClose={() => setShowElevator(false)}
        />
      )}

      {showDesktop && (
        <DesktopUIModal
          objects={floor.allObjects}
          onClose={() => setShowDesktop(false)}
          onGoToLocation={(idx) => {
            if (gs.activeMarkerIndex !== null && gs.activeMarkerIndex !== idx) {
              setNotification(
                "Anda sudah memiliki tiket yang sedang ditelusuri. Selesaikan tiket sebelumnya terlebih dahulu atau berinteraksi dengan sumber masalah untuk membatalkannya."
              );
              return;
            }
            gs.activeMarkerIndex = idx;
            setShowDesktop(false);
            EventBus.emit("pan_to_object", idx);
          }}
          onFixTicket={() => {
            // Disabled: user must go to location
          }}
        />
      )}

      {won && <WinModal onReturnToWelcome={onReturnToWelcome} />}

      {notification && (
        <NotificationToast
          notification={notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
