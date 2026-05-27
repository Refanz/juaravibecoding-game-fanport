// ==========================================
// domain/GameState.ts
// State permainan — screen, quiz, camera
// ==========================================

export type Screen = 'welcome' | 'playing' | 'win';

export interface Camera { x: number; y: number; }

export class GameState {
  screen: Screen = 'welcome';
  quizActive = false;
  isPaused = false;
  quizObjectIndex: number | null = null;
  nearObjectIndex: number | null = null;
  nearNPCIndex: number | null = null;
  dialogActive = false;
  dialogNPCRole: string | null = null;
  dialogNPCLabel: string | null = null;
  nearElevator = false;
  nearCCTV = false;
  showTransition = false;
  transitionFloor: 1 | 2 | 3 = 1;
  camera: Camera = { x: 0, y: 0 };
  teleportTargetIndex: number | null = null;
  activeMarkerIndex: number | null = null;
  justUsedElevator = false;
  savedPlayerPos: { x: number; y: number; floor: number } | null = null;
  gameTime = { minute: 0, hour: 8, day: 1, month: 0, year: 2026 };

  reset(): void {
    this.screen = 'welcome';
    this.quizActive = false;
    this.isPaused = false;
    this.quizObjectIndex = null;
    this.nearObjectIndex = null;
    this.nearNPCIndex = null;
    this.dialogActive = false;
    this.dialogNPCRole = null;
    this.dialogNPCLabel = null;
    this.nearElevator = false;
    this.showTransition = false;
    this.camera = { x: 0, y: 0 };
    this.teleportTargetIndex = null;
    this.activeMarkerIndex = null;
    this.justUsedElevator = false;
    this.savedPlayerPos = null;
    this.gameTime = { minute: 0, hour: 8, day: 1, month: 0, year: 2026 };
  }

  startPlaying(): void { this.screen = 'playing'; }
  setWin(): void { this.screen = 'win'; }
}
