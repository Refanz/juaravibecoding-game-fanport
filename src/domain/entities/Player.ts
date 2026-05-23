// ==========================================
// domain/entities/Player.ts
// Entitas Player — OOP dengan enkapsulasi
// ==========================================

import { TileMap, SOLID_TILES } from '../../infrastructure/data/maps';

const TILE = 48;
const SPEED = 160;

export type Direction = 'up' | 'down' | 'left' | 'right';

export class Player {
  x: number;
  y: number;
  readonly w = 36;
  readonly h = 36;
  dir: Direction = 'down';
  moving = false;

  constructor(startTileX: number, startTileY: number) {
    this.x = startTileX * TILE + 6;
    this.y = startTileY * TILE + 6;
  }

  /** Pindahkan player berdasarkan input dan collision map. */
  update(keys: Record<string, boolean>, map: TileMap, dt: number): void {
    let dx = 0, dy = 0;
    this.moving = false;

    if (keys['arrowup']    || keys['w']) { dy = -1; this.dir = 'up';    this.moving = true; }
    if (keys['arrowdown']  || keys['s']) { dy =  1; this.dir = 'down';  this.moving = true; }
    if (keys['arrowleft']  || keys['a']) { dx = -1; this.dir = 'left';  this.moving = true; }
    if (keys['arrowright'] || keys['d']) { dx =  1; this.dir = 'right'; this.moving = true; }

    if (dx !== 0 && dy !== 0) {
      const d = 1 / Math.sqrt(2);
      dx *= d; dy *= d;
    }

    const nx = this.x + dx * SPEED * dt;
    const ny = this.y + dy * SPEED * dt;

    if (!this._isSolid(nx, this.y, map)) this.x = nx;
    if (!this._isSolid(this.x, ny, map)) this.y = ny;
  }

  get centerX() { return this.x + this.w / 2; }
  get centerY() { return this.y + this.h / 2; }

  private _isSolid(px: number, py: number, map: TileMap): boolean {
    const m = 4;
    const corners: [number, number][] = [
      [px + m, py + m], [px + this.w - m, py + m],
      [px + m, py + this.h - m], [px + this.w - m, py + this.h - m],
    ];
    for (const [cx, cy] of corners) {
      const col = Math.floor(cx / TILE);
      const row = Math.floor(cy / TILE);
      if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return true;
      if (SOLID_TILES.includes(map[row][col])) return true;
    }
    return false;
  }
}
