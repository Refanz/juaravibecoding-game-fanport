// ==========================================
// domain/entities/NPC.ts
// Entitas NPC rumah sakit (dokter/perawat)
// ==========================================

import { npcSpriteKey } from '../../infrastructure/assets/AssetManager';

const TILE = 48;

export class NPC {
  readonly x: number;
  readonly y: number;
  readonly role: 'doctor' | 'nurse' | 'guest' | 'nurseWheelchair' | 'nurseBed' | 'walkingNurse' | 'security';
  readonly label: string;

  constructor(x: number, y: number, role: 'doctor' | 'nurse' | 'guest' | 'nurseWheelchair' | 'nurseBed' | 'walkingNurse' | 'security', label: string) {
    this.x = x;
    this.y = y;
    this.role = role;
    this.label = label;
  }

  get centerX() { return this.x * TILE + TILE / 2; }
  get centerY() { return this.y * TILE + TILE / 2; }
  get spriteKey() { return npcSpriteKey(this.role); }

  isNear(px: number, py: number): boolean {
    const INTERACT_RANGE = 72;
    const dx = this.centerX - px;
    const dy = this.centerY - py;
    return Math.sqrt(dx * dx + dy * dy) <= INTERACT_RANGE;
  }
}

import type { NPCData } from '../../infrastructure/data/floorData';

export function createNPC(data: NPCData): NPC {
  return new NPC(data.x, data.y, data.role, data.label);
}
