import { useState, useEffect } from "react";
import { EventBus } from "../../infrastructure/events/EventBus";
import { AudioManager } from "../../infrastructure/assets/AudioManager";
import { GameState } from "../../domain/GameState";

export function useGameEvents(gs: GameState) {
  const [currentFloor, setCurrentFloor] = useState<1 | 2 | 3>(1);
  const [nearObject, setNearObject] = useState<number | null>(null);
  const [nearElevator, setNearElevator] = useState(false);
  const [nearCCTV, setNearCCTV] = useState(false);
  const [nearNPC, setNearNPC] = useState<number | null>(null);
  const [dialogData, setDialogData] = useState<{ role: string; label: string } | null>(null);
  const [quizKey, setQuizKey] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transFloor, setTransFloor] = useState<1 | 2 | 3>(1);
  const [showCCTV, setShowCCTV] = useState(false);
  const [showElevator, setShowElevator] = useState(false);

  useEffect(() => {
    const onNearObject = (idx: number | null) => setNearObject(idx);
    const onNearElevator = (near: boolean) => setNearElevator(near);
    const onNearCCTV = (near: boolean) => setNearCCTV(near);
    const onOpenQuiz = (idx: number) => setQuizKey(idx);
    const onOpenCCTV = () => setShowCCTV(true);
    const onOpenElevatorUI = () => setShowElevator(true);
    const onNearNPC = (idx: number | null) => setNearNPC(idx);
    const onOpenNPCDialog = (data: { role: string; label: string }) => setDialogData(data);
    const onFloorChanged = (f: 1 | 2 | 3, silent: boolean = false) => {
      setCurrentFloor(f);
      if (!silent) {
        setTransFloor(f);
        setShowTransition(true);
        setTimeout(() => setShowTransition(false), 800);
      }
    };

    EventBus.on("near_object", onNearObject);
    EventBus.on("near_elevator", onNearElevator);
    EventBus.on("near_cctv", onNearCCTV);
    EventBus.on("open_quiz", onOpenQuiz);
    EventBus.on("open_cctv", onOpenCCTV);
    EventBus.on("open_elevator_ui", onOpenElevatorUI);
    EventBus.on("near_npc", onNearNPC);
    EventBus.on("open_npc_dialog", onOpenNPCDialog);
    EventBus.on("floor_changed", onFloorChanged);

    return () => {
      EventBus.off("near_object", onNearObject);
      EventBus.off("near_elevator", onNearElevator);
      EventBus.off("near_cctv", onNearCCTV);
      EventBus.off("open_quiz", onOpenQuiz);
      EventBus.off("open_cctv", onOpenCCTV);
      EventBus.off("open_elevator_ui", onOpenElevatorUI);
      EventBus.off("near_npc", onNearNPC);
      EventBus.off("open_npc_dialog", onOpenNPCDialog);
      EventBus.off("floor_changed", onFloorChanged);
    };
  }, [gs]);

  return {
    currentFloor, setCurrentFloor,
    nearObject,
    nearElevator,
    nearCCTV,
    nearNPC,
    dialogData, setDialogData,
    quizKey, setQuizKey,
    showTransition,
    transFloor,
    showCCTV, setShowCCTV,
    showElevator, setShowElevator,
  };
}
