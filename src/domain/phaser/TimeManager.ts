import Phaser from "phaser";
import { EventBus } from "../../infrastructure/events/EventBus";
import { GameState } from "../GameState";

export class TimeManager {
  private scene: Phaser.Scene;
  private gameState: GameState;
  private timerEvent: Phaser.Time.TimerEvent;

  // State untuk melacak waktu in-game
  public minute: number;
  public hour: number;
  public day: number;
  public month: number;
  public year: number;
  
  private currentDate: Date;
  
  private elapsedHoursSinceSave: number = 0;
  private nextBudgetEventHours: number = 0;

  constructor(scene: Phaser.Scene, gameState: GameState) {
    this.scene = scene;
    this.gameState = gameState;

    // Initial date from GameState
    this.minute = this.gameState.gameTime.minute;
    this.hour = this.gameState.gameTime.hour;
    this.day = this.gameState.gameTime.day;
    this.month = this.gameState.gameTime.month;
    this.year = this.gameState.gameTime.year;

    this.currentDate = new Date(this.year, this.month, this.day, this.hour, this.minute);
    this.nextBudgetEventHours = Phaser.Math.Between(3, 5);

    // Skala waktu: 1 jam in-game = 1 menit real-time.
    // Berarti 1 menit in-game = 1 detik real-time.
    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true,
    });

    this.emitTime();
  }

  private tick() {
    // Check if the game is currently playing
    const gameScene = this.scene as any;
    if (gameScene.gameState && gameScene.gameState.screen !== "playing") {
      return; // Do not advance time if on welcome screen, paused, etc.
    }

    // Menggunakan JS Date untuk kemudahan kalkulasi rollover (23:59 -> 00:00, lompat hari, bulan, tahun)
    this.currentDate.setFullYear(this.year, this.month, this.day);
    this.currentDate.setHours(this.hour, this.minute + 1, 0, 0);

    // Shift kerja hanya 08:00 - 20:00, bila sudah jam 20:00, loncat ke besok jam 08:00
    if (this.currentDate.getHours() >= 20) {
      EventBus.emit("end_of_day", { dateStr: this.getFormattedDate() });
      this.currentDate.setDate(this.currentDate.getDate() + 1);
      this.currentDate.setHours(8, 0, 0, 0);
      this.elapsedHoursSinceSave = 0;
    }

    const prevHour = this.hour;

    this.minute = this.currentDate.getMinutes();
    this.hour = this.currentDate.getHours();
    this.day = this.currentDate.getDate();
    this.month = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();

    // Save back to GameState
    this.gameState.gameTime = {
      minute: this.minute,
      hour: this.hour,
      day: this.day,
      month: this.month,
      year: this.year,
    };

    if (this.hour !== prevHour) {
      EventBus.emit("hour_changed", this.hour);
      
      this.elapsedHoursSinceSave++;
      if (this.elapsedHoursSinceSave >= 5) {
        EventBus.emit("auto_save");
        this.elapsedHoursSinceSave = 0;
      }

      this.nextBudgetEventHours--;
      if (this.nextBudgetEventHours <= 0) {
        const delta = Phaser.Math.Between(-30, 50) * 100000;
        const isPositive = delta > 0;
        const reason = isPositive 
          ? ["Refund vendor", "Bonus operasional", "Klaim garansi cair"][Phaser.Math.Between(0, 2)]
          : ["Biaya operasional tak terduga", "Denda keterlambatan bayar vendor", "Maintenance rutin"][Phaser.Math.Between(0, 2)];
        if (delta !== 0) {
          EventBus.emit("budget_event", { delta, reason });
        }
        this.nextBudgetEventHours = Phaser.Math.Between(3, 5);
      }
    }

    this.emitTime();
  }

  public getFormattedTime(): string {
    return this.currentDate.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  public getFormattedDate(): string {
    return this.currentDate.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  public getPeriod(): "pagi" | "siang" | "sore" | "malam" {
    if (this.hour >= 6 && this.hour < 11) return "pagi";
    if (this.hour >= 11 && this.hour < 15) return "siang";
    if (this.hour >= 15 && this.hour < 18) return "sore";
    return "malam";
  }

  public getTimestamp(): number {
    return this.currentDate.getTime();
  }

  private emitTime() {
    EventBus.emit("time_updated", {
      time: this.getFormattedTime(),
      date: this.getFormattedDate(),
      period: this.getPeriod(),
      timestamp: this.currentDate.getTime(),
    });
  }

  public destroy() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }
  }
}
