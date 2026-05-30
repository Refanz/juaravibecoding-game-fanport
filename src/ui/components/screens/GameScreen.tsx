// ==========================================
// ui/components/GameScreen.tsx
// Komponen utama gameplay — canvas + HUD
// + modal quiz, transisi, win
// ==========================================

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { FloorManager } from "../../../domain/FloorManager";
import { GameState } from "../../../domain/GameState";
import { HOSPITAL_QUIZZES } from "../../../infrastructure/data/quizzes";
import { EventBus } from "../../../infrastructure/events/EventBus";
import { PhaserGame } from "../../../domain/phaser/PhaserGame";
import LoadingScreen from "./LoadingScreen";
import { SaveManager, SaveData } from "../../../infrastructure/storage/SaveManager";
import { nanoid } from 'nanoid';

// Custom Hooks
import { useGameTime } from "../../hooks/useGameTime";
import { useGameEvents } from "../../hooks/useGameEvents";
import { useTicketManager } from "../../hooks/useTicketManager";

// Subcomponents
import FloatingHUD from "../hud/FloatingHUD";
import ActionButtons from "../hud/ActionButtons";
import InteractionHints from "../hud/InteractionHints";
import NotificationToast from "../hud/NotificationToast";

// Modals
import QuizModal from "../modals/QuizModal";
import InfoModal from "../modals/InfoModal";
import PauseModal from "../modals/PauseModal";
import CCTVMonitorModal from "../modals/CCTVMonitorModal";
import VirtualGamepad from "../hud/VirtualGamepad";
import MapModal from "../modals/MapModal";
import NetworkTopologyModal from "../modals/NetworkTopologyModal";
import DesktopUIModal from "../desktop/DesktopUIModal";
import ElevatorModal from "../modals/ElevatorModal";
import { NPCDialogModal } from "../modals/NPCDialogModal";
import DailyReportModal from "../modals/DailyReportModal";
import GeneralLoadingScreen from "./GeneralLoadingScreen";
import NotificationModal from "../modals/NotificationModal";

interface Props {
  onReturnToWelcome: () => void;
  isWelcome?: boolean;
  loadSave?: boolean;
}

export default function GameScreen({
  onReturnToWelcome,
  isWelcome = false,
  loadSave = false,
}: Props) {
  // Domain singletons (stable refs)
  const { floor, gs } = useMemo(() => {
    const f = new FloorManager();
    f.init();
    const state = new GameState();
    
    if (loadSave) {
      const data = SaveManager.load();
      if (data) {
        state.restoreFromSave(data);
        f.restoreObjectStates(data.objects);
        f.loadFloor(data.currentFloor);
      }
    }
    
    return { floor: f, gs: state };
  }, [loadSave]);

  useEffect(() => {
    if (isWelcome) {
      gs.screen = "welcome";
    } else {
      gs.startPlaying();
    }
  }, [isWelcome, gs]);

  const { currentTime, currentDate, currentPeriod } = useGameTime();
  const currentTimeRef = useRef(currentTime);
  const playerPosRef = useRef({ x: 0, y: 0, floor: gs.savedPlayerPos?.floor || 1 });

  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    const onPlayerPos = (pos: { x: number, y: number, floor: number }) => {
      playerPosRef.current = pos;
    };
    EventBus.on("player_position", onPlayerPos);
    return () => { EventBus.off("player_position", onPlayerPos); };
  }, []);

  const { ticketNotification, setTicketNotification } = useTicketManager(floor);

  const {
    currentFloor,
    setCurrentFloor,
    nearObject,
    nearElevator,
    nearCCTV,
    nearNPC,
    dialogData,
    setDialogData,
    quizKey,
    setQuizKey,
    showTransition,
    transFloor,
    showCCTV,
    setShowCCTV,
    showElevator,
    setShowElevator,
  } = useGameEvents(gs, floor.currentFloor);

  // Additional UI states
  const [solvedCount, setSolvedCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showTopology, setShowTopology] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showDesktop, setShowDesktop] = useState(false);
  interface ToastNotificationData {
    message: string;
    colorTheme?: "orange" | "red" | "blue" | "green";
    icon?: string;
  }
  const [notification, setNotification] = useState<ToastNotificationData | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<{id: string, time: string, message: string}[]>(() => {
    const stored = sessionStorage.getItem("hospital_notifications");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch(e) {}
    }
    return [];
  });
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDayTransitioning, setIsDayTransitioning] = useState(false);

  const collectSaveData = useCallback((): Omit<SaveData, "version" | "savedAt"> => {
    return {
      playerX: playerPosRef.current.x,
      playerY: playerPosRef.current.y,
      currentFloor: playerPosRef.current.floor as 1 | 2 | 3,
      gameTime: { ...gs.gameTime },
      objects: floor.allObjects.map(o => ({
        index: floor.allObjects.indexOf(o),
        id: o.id,
        solved: o.solved,
        active: o.active,
        impact: o.impact,
        urgency: o.urgency,
        spawnTime: o.spawnTime,
        completionTime: o.completionTime,
        quizIndex: o.quizIndex
      })),
      reports: sessionStorage.getItem("hospital_reports") || "[]",
      notifications: sessionStorage.getItem("hospital_notifications") || "[]"
    };
  }, [floor, gs]);

  useEffect(() => {
    const handleManualSave = () => {
      if (SaveManager.save(collectSaveData())) {
        setNotification({ message: "Progress berhasil disimpan!", colorTheme: "green", icon: "✅" });
      }
    };
    const handleAutoSave = () => {
      if (SaveManager.save(collectSaveData())) {
        setNotification({ message: "Auto-save berhasil", colorTheme: "green", icon: "💾" });
        setTimeout(() => setNotification(null), 2000);
      }
    };
    const handleShowToast = (data: ToastNotificationData) => {
      setNotification(data);
    };
    
    EventBus.on("request_manual_save", handleManualSave);
    EventBus.on("auto_save", handleAutoSave);
    EventBus.on("show_toast_notification", handleShowToast);
    
    return () => {
      EventBus.off("request_manual_save", handleManualSave);
      EventBus.off("auto_save", handleAutoSave);
      EventBus.off("show_toast_notification", handleShowToast);
    };
  }, [collectSaveData]);

  useEffect(() => {
    const onStartTransition = () => setIsDayTransitioning(true);
    EventBus.on("start_day_transition", onStartTransition);
    return () => {
      EventBus.off("start_day_transition", onStartTransition);
    };
  }, []);

  useEffect(() => {
    sessionStorage.setItem("hospital_notifications", JSON.stringify(notificationHistory));
  }, [notificationHistory]);

  useEffect(() => {
    if (ticketNotification) {
      const timeStr = currentTimeRef.current;
      setNotificationHistory(prev => [{
        id: nanoid(),
        time: timeStr,
        message: `${ticketNotification.title} - ${ticketNotification.message}`
      }, ...prev]);
      setUnreadNotifCount(prev => prev + 1);
    }
  }, [ticketNotification]);

  const handleDayTransitionComplete = useCallback(() => {
    setIsDayTransitioning(false);
    gs.isPaused = false;
    EventBus.emit("game_paused", false);
    EventBus.emit("spawn_at_start");
  }, [gs]);

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
    <div className="w-full min-h-[100dvh] h-screen sm:h-[100dvh] flex flex-col bg-surface relative">
      {isLoading && (
        <div className="absolute inset-0 z-[200]">
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        </div>
      )}

      {isDayTransitioning && (
        <div className="absolute inset-0 z-[400]">
          <GeneralLoadingScreen 
            message="MENYIAPKAN HARI BERIKUTNYA..." 
            onComplete={handleDayTransitionComplete} 
          />
        </div>
      )}
      {!isWelcome && (
        <FloatingHUD
          currentFloor={currentFloor}
          currentDate={currentDate}
          currentTime={currentTime}
          currentPeriod={currentPeriod}
          activeTickets={floor.allObjects.filter(o => o.active && !o.solved).length}
          completedTickets={floor.allObjects.filter(o => o.solved).length}
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
            onNotifications={() => {
              setShowNotifications(true);
              setUnreadNotifCount(0);
            }}
            notificationCount={unreadNotifCount}
          />
        )}

        <PhaserGame floorManager={floor} gameState={gs} />
        
        {!isWelcome && <VirtualGamepad />}

        {!isWelcome && (
          <InteractionHints
            nearObject={nearObject}
            activeQuiz={activeQuiz !== null || dialogData !== null}
            nearElevator={nearElevator}
            nearCCTV={nearCCTV}
            nearNPC={nearNPC}
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

      {dialogData && (
        <NPCDialogModal
          role={dialogData.role as any}
          label={dialogData.label}
          onClose={() => {
            setDialogData(null);
            gs.dialogActive = false;
            EventBus.emit("dialog_closed");
          }}
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
              const msg = "Anda sudah memiliki tiket yang sedang ditelusuri. Selesaikan tiket sebelumnya terlebih dahulu atau berinteraksi dengan sumber masalah untuk membatalkannya.";
              setNotification({ message: msg, colorTheme: "orange", icon: "⚠️" });
              
              const activeObj = floor.allObjects[gs.activeMarkerIndex];
              const targetObj = floor.allObjects[idx];
              const historyMsg = `Gagal menelusuri tiket #${targetObj.id}. Anda masih dalam proses penyelesaian tiket #${activeObj.id} (Lantai ${activeObj.floor}).`;
              
              const timeStr = currentTimeRef.current;
              
              setNotificationHistory(prev => [{
                id: nanoid(),
                time: timeStr,
                message: historyMsg
              }, ...prev]);
              setUnreadNotifCount(prev => prev + 1);
              
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

      {showNotifications && (
        <NotificationModal 
          notifications={notificationHistory} 
          onClose={() => setShowNotifications(false)} 
          onClear={() => setNotificationHistory([])}
        />
      )}

      {notification && (
        <NotificationToast
          message={notification.message}
          colorTheme={notification.colorTheme}
          icon={notification.icon}
          onClose={() => setNotification(null)}
        />
      )}

      {ticketNotification && (
        <NotificationToast
          title={ticketNotification.title}
          message={ticketNotification.message}
          icon={ticketNotification.icon}
          colorTheme={ticketNotification.colorTheme}
          duration={5000}
          topPosition="top-4"
          onClose={() => setTicketNotification(null)}
        />
      )}

      <DailyReportModal gs={gs} />
    </div>
  );
}
