// ==========================================
// domain/entities/InteractableObject.ts
// Entitas objek IT rusak yang bisa diinteraksi
// Base class + subclasses (OOP polimorfisme)
// ==========================================
import { nanoid } from 'nanoid';

const TILE = 48;
const INTERACT_RANGE = 56;

export abstract class InteractableObject {
  id: string;
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly floor: 1 | 2 | 3;
  quizIndex: number;
  solved = false;
  active = false;
  impact: 'Low' | 'Medium' | 'High';
  urgency: 'Low' | 'Medium' | 'High';
  spawnTime: number | null = null;
  completionTime: number | null = null;

  constructor(x: number, y: number, label: string, floor: 1 | 2 | 3, quizIndex: number) {
    this.id = `TKT-${nanoid(6).toUpperCase()}`;
    this.x = x;
    this.y = y;
    this.label = label;
    this.floor = floor;
    this.quizIndex = quizIndex;
    
    const levels: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];
    this.impact = levels[Math.floor(Math.random() * levels.length)];
    this.urgency = levels[Math.floor(Math.random() * levels.length)];
  }

  get centerX() { return this.x * TILE + TILE / 2; }
  get centerY() { return this.y * TILE + TILE / 2; }

  isNear(px: number, py: number): boolean {
    return Math.hypot(px - this.centerX, py - this.centerY) < INTERACT_RANGE;
  }

  /** Sprite key yang digunakan saat rendering */
  abstract get spriteKey(): string;

  solve(timestamp: number): void { 
    this.solved = true; 
    this.completionTime = timestamp;
  }
}

/** PC / Komputer yang rusak */
export class BrokenPC extends InteractableObject {
  get spriteKey() { return 'pcBroken'; }
}

/** Alat medis / monitor yang rusak */
export class BrokenMonitor extends InteractableObject {
  get spriteKey() { return 'medBroken'; }
}

/** Perangkat jaringan / alat baru dengan sprite kustom */
export class GenericBrokenDevice extends InteractableObject {
  private _spriteKey: string;
  constructor(x: number, y: number, label: string, floor: 1 | 2 | 3, quizIndex: number, spriteKey: string) {
    super(x, y, label, floor, quizIndex);
    this._spriteKey = spriteKey;
  }
  get spriteKey() { return this._spriteKey; }
}

import type { BrokenObjectData } from '../../infrastructure/data/floorData';

/** Factory: buat InteractableObject dari raw data */
export function createInteractable(data: BrokenObjectData, quizIndex: number): InteractableObject {
  if (data.type === 'monitor') {
    return new BrokenMonitor(data.x, data.y, data.label, data.floor, quizIndex);
  }
  if (data.type === 'computer') {
    return new BrokenPC(data.x, data.y, data.label, data.floor, quizIndex);
  }
  // Fallback ke GenericBrokenDevice untuk tipe-tipe baru seperti serverRack, ups, dll
  return new GenericBrokenDevice(data.x, data.y, data.label, data.floor, quizIndex, data.type);
}
