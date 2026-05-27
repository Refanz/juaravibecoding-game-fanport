import { useState, useEffect } from "react";
import { EventBus } from "../../infrastructure/events/EventBus";
import { AudioManager } from "../../infrastructure/assets/AudioManager";
import { GameState } from "../../domain/GameState";

export function useGameEvents(gs: GameState) {
  const [currentFloor, setCurrentFloor] = useState<1 | 2 | 3>(1);
  const [nearObject, setNearObject] = useState<number | null>(null);
  const [nearElevator, setNearElevator] = useState(false);
  const [nearCCTV, setNearCCTV] = useState(false);
  const [quizKey, setQuizKey] = useState<number | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transFloor, setTransFloor] = useState<1 | 2 | 3>(1);
  const [won, setWon] = useState(false);
  const [showCCTV, setShowCCTV] = useState(false);
  const [showElevator, setShowElevator] = useState(false);

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

    EventBus.on("near_object", onNearObject);
    EventBus.on("near_elevator", onNearElevator);
    EventBus.on("near_cctv", onNearCCTV);
    EventBus.on("open_quiz", onOpenQuiz);
    EventBus.on("open_cctv", onOpenCCTV);
    EventBus.on("open_elevator_ui", onOpenElevatorUI);
    EventBus.on("floor_changed", onFloorChanged);
    EventBus.on("game_won", onGameWon);

    return () => {
      EventBus.off("near_object", onNearObject);
      EventBus.off("near_elevator", onNearElevator);
      EventBus.off("near_cctv", onNearCCTV);
      EventBus.off("open_quiz", onOpenQuiz);
      EventBus.off("open_cctv", onOpenCCTV);
      EventBus.off("open_elevator_ui", onOpenElevatorUI);
      EventBus.off("floor_changed", onFloorChanged);
      EventBus.off("game_won", onGameWon);
    };
  }, [gs]);

  return {
    currentFloor, setCurrentFloor,
    nearObject,
    nearElevator,
    nearCCTV,
    quizKey, setQuizKey,
    showTransition,
    transFloor,
    won, setWon,
    showCCTV, setShowCCTV,
    showElevator, setShowElevator,
  };
}
