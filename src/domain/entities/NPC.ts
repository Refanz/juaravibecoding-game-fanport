// ==========================================
// domain/entities/NPC.ts
// Entitas NPC rumah sakit (dokter/perawat)
// ==========================================

import { npcSpriteKey } from '../../infrastructure/assets/AssetManager';

const TILE = 48;

export class NPC {
  readonly x: number;
  readonly y: number;
  readonly role: 'doctor' | 'nurse';
  readonly label: string;

  constructor(x: number, y: number, role: 'doctor' | 'nurse', label: string) {
    this.x = x;
    this.y = y;
    this.role = role;
    this.label = label;
  }

  get centerX() { return this.x * TILE + TILE / 2; }
  get centerY() { return this.y * TILE + TILE / 2; }
  get spriteKey() { return npcSpriteKey(this.role); }
}

import type { NPCData } from '../../infrastructure/data/floorData';

export function createNPC(data: NPCData): NPC {
  return new NPC(data.x, data.y, data.role, data.label);
}
