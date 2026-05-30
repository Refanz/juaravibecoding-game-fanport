// ==========================================
// infrastructure/storage/SaveManager.ts
// ==========================================

export interface SaveData {
  version: string;
  savedAt: number;
  playerX: number;
  playerY: number;
  currentFloor: 1 | 2 | 3;
  gameTime: {
    minute: number;
    hour: number;
    day: number;
    month: number;
    year: number;
  };
  objects: Array<{
    index: number;
    id: string;
    solved: boolean;
    active: boolean;
    impact: 'Low' | 'Medium' | 'High';
    urgency: 'Low' | 'Medium' | 'High';
    spawnTime: number | null;
    completionTime: number | null;
    quizIndex: number;
  }>;
  reports: string;
  notifications: string;
}

const SAVE_KEY = "hospital_vibe_save_data";
const CURRENT_VERSION = "1.0.0";

export class SaveManager {
  static save(data: Omit<SaveData, "version" | "savedAt">): boolean {
    try {
      const fullData: SaveData = {
        ...data,
        version: CURRENT_VERSION,
        savedAt: Date.now(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(fullData));
      return true;
    } catch (e) {
      console.error("Failed to save game:", e);
      return false;
    }
  }

  static load(): SaveData | null {
    try {
      const stored = localStorage.getItem(SAVE_KEY);
      if (!stored) return null;
      const data = JSON.parse(stored) as SaveData;
      // Note: we can add version migration logic here if needed
      return data;
    } catch (e) {
      console.error("Failed to load game:", e);
      return null;
    }
  }

  static hasSaveData(): boolean {
    return localStorage.getItem(SAVE_KEY) !== null;
  }

  static clear(): void {
    localStorage.removeItem(SAVE_KEY);
  }
}
