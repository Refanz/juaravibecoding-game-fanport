import Phaser from "phaser";
import { EventBus } from "../../infrastructure/events/EventBus";

export class TimeManager {
  private scene: Phaser.Scene;
  private timerEvent: Phaser.Time.TimerEvent;

  // State untuk melacak waktu in-game
  public minute: number;
  public hour: number;
  public day: number;
  public month: number;
  public year: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // Initial date: 1 Januari 2026, 08:00
    this.minute = 0;
    this.hour = 8;
    this.day = 1;
    this.month = 0; // 0-indexed, 0 = Januari
    this.year = 2026;

    // Skala waktu: 1 jam in-game = 1 menit real-time.
    // Berarti 1 menit in-game = 1 detik real-time.
    this.timerEvent = this.scene.time.addEvent({
      delay: 1000,
      callback: this.tick,
      callbackScope: this,
      loop: true
    });
    
    this.emitTime();
  }

  private tick() {
    // Check if the game is currently playing
    const gameScene = this.scene as any;
    if (gameScene.gameState && gameScene.gameState.screen !== 'playing') {
      return; // Do not advance time if on welcome screen, paused, etc.
    }

    // Menggunakan JS Date untuk kemudahan kalkulasi rollover (23:59 -> 00:00, lompat hari, bulan, tahun)
    const d = new Date(this.year, this.month, this.day, this.hour, this.minute + 1);
    
    // Shift kerja hanya 08:00 - 20:00, bila sudah jam 20:00, loncat ke besok jam 08:00
    if (d.getHours() >= 20) {
      d.setDate(d.getDate() + 1);
      d.setHours(8, 0, 0, 0);
    }

    this.minute = d.getMinutes();
    this.hour = d.getHours();
    this.day = d.getDate();
    this.month = d.getMonth();
    this.year = d.getFullYear();

    this.emitTime();
  }

  public getFormattedTime(): string {
    const d = new Date(this.year, this.month, this.day, this.hour, this.minute);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }

  public getFormattedDate(): string {
    const d = new Date(this.year, this.month, this.day, this.hour, this.minute);
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }

  public getPeriod(): 'pagi' | 'siang' | 'sore' | 'malam' {
    if (this.hour >= 6 && this.hour < 11) return 'pagi';
    if (this.hour >= 11 && this.hour < 15) return 'siang';
    if (this.hour >= 15 && this.hour < 18) return 'sore';
    return 'malam';
  }

  private emitTime() {
    EventBus.emit("time_updated", { 
      time: this.getFormattedTime(), 
      date: this.getFormattedDate(),
      period: this.getPeriod()
    });
  }

  public destroy() {
    if (this.timerEvent) {
      this.timerEvent.destroy();
    }
  }
}
