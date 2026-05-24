// ==========================================
// domain/FloorManager.ts
// Mengelola state per-lantai: map, objek,
// NPC, dekorasi, dan elevator
// ==========================================

import {
  MAP_FLOOR1, MAP_FLOOR2, TileMap, ELEVATOR_POS
} from '../infrastructure/data/maps';
import {
  ROOM_LABELS_F1, ROOM_LABELS_F2,
  FLOOR1_NPCS, FLOOR2_NPCS,
  FLOOR1_DECORATIONS, FLOOR2_DECORATIONS,
  FLOOR1_OBJECTS, FLOOR2_OBJECTS,
  RoomLabel, DecorData,
} from '../infrastructure/data/floorData';
import { InteractableObject, createInteractable } from './entities/InteractableObject';
import { NPC, createNPC } from './entities/NPC';

const TILE = 48;
const INTERACT_RANGE = 56;

export class FloorManager {
  currentFloor: 1 | 2 = 1;
  map: TileMap = MAP_FLOOR1;
  labels: RoomLabel[] = [];
  npcs: NPC[] = [];
  decorations: DecorData[] = [];
  floorObjects: InteractableObject[] = [];
  allObjects: InteractableObject[] = [];

  readonly elevatorPos = ELEVATOR_POS;

  /** Inisialisasi semua objek dari kedua lantai */
  init(): void {
    let idx = 0;
    this.allObjects = [
      ...FLOOR1_OBJECTS.map(d => createInteractable(d, idx++)),
      ...FLOOR2_OBJECTS.map(d => createInteractable(d, idx++)),
    ];
    this.loadFloor(1);
  }

  loadFloor(floor: 1 | 2): void {
    this.currentFloor = floor;
    if (floor === 1) {
      this.map = MAP_FLOOR1;
      this.labels = ROOM_LABELS_F1;
      this.npcs = FLOOR1_NPCS.map(createNPC);
      this.decorations = FLOOR1_DECORATIONS;
      this.floorObjects = this.allObjects.filter(o => o.floor === 1);
    } else {
      this.map = MAP_FLOOR2;
      this.labels = ROOM_LABELS_F2;
      this.npcs = FLOOR2_NPCS.map(createNPC);
      this.decorations = FLOOR2_DECORATIONS;
      this.floorObjects = this.allObjects.filter(o => o.floor === 2);
    }
  }

  get totalObjects()  { return this.allObjects.length; }
  get solvedCount()   { return this.allObjects.filter(o => o.solved).length; }
  get allSolved()     { return this.solvedCount >= this.totalObjects; }

  get elevatorCenterX() { return this.elevatorPos.x * TILE + TILE / 2; }
  get elevatorCenterY() { return this.elevatorPos.y * TILE + TILE / 2; }

  isNearElevator(px: number, py: number): boolean {
    return Math.hypot(px - this.elevatorCenterX, py - this.elevatorCenterY) < INTERACT_RANGE;
  }

  // CCTV Monitor at tile (24, 17) — Ruang CCTV khusus di Lantai 1
  readonly cctvMonitorPos = { x: 24, y: 17 };

  get cctvMonitorCenterX() { return this.cctvMonitorPos.x * TILE + TILE / 2; }
  get cctvMonitorCenterY() { return this.cctvMonitorPos.y * TILE + TILE / 2; }

  isNearCCTVMonitor(px: number, py: number): boolean {
    if (this.currentFloor !== 1) return false;
    return Math.hypot(px - this.cctvMonitorCenterX, py - this.cctvMonitorCenterY) < INTERACT_RANGE;
  }

  nearestObject(px: number, py: number): InteractableObject | null {
    for (const obj of this.floorObjects) {
      if (!obj.solved && obj.isNear(px, py)) return obj;
    }
    return null;
  }

  oppositeFloor(): 1 | 2 {
    return this.currentFloor === 1 ? 2 : 1;
  }
}
