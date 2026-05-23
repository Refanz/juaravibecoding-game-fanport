// ==========================================
// domain/GameState.ts
// State permainan — screen, quiz, camera
// ==========================================

export type Screen = 'welcome' | 'playing' | 'win';

export interface Camera { x: number; y: number; }

export class GameState {
  screen: Screen = 'welcome';
  quizActive = false;
  quizObjectIndex: number | null = null;
  nearObjectIndex: number | null = null;
  nearElevator = false;
  showTransition = false;
  transitionFloor: 1 | 2 = 1;
  camera: Camera = { x: 0, y: 0 };

  reset(): void {
    this.screen = 'welcome';
    this.quizActive = false;
    this.quizObjectIndex = null;
    this.nearObjectIndex = null;
    this.nearElevator = false;
    this.showTransition = false;
    this.camera = { x: 0, y: 0 };
  }

  startPlaying(): void { this.screen = 'playing'; }
  setWin(): void { this.screen = 'win'; }
}
