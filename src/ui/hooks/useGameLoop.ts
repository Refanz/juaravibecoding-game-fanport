// ==========================================
// ui/hooks/useGameLoop.ts
// Canvas renderer + game loop utama
// Menghubungkan domain layer ke canvas
// ==========================================

import { useEffect, useRef, useCallback } from 'react';
import { SpriteMap, decorSpriteKey } from '../../infrastructure/assets/AssetManager';
import { Player } from '../../domain/entities/Player';
import { FloorManager } from '../../domain/FloorManager';
import { GameState } from '../../domain/GameState';
import { AudioManager } from '../../infrastructure/assets/AudioManager';
import { ELEVATOR_POS } from '../../infrastructure/data/maps';

const TILE = 48;
const TILE_COLORS: Record<number, string> = {
  0: '#e8f0f8', 1: '#90caf9', 2: '#8d6e63',
  3: '#cfd8dc', 4: '#66bb6a', 5: '#bbdefb', 6: '#9e9e9e',
};
const WALL_BORDER = '#64b5f6';
const FLOOR_GRID = '#d6e4f0';

interface UseGameLoopParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  sprites: SpriteMap;
  player: Player;
  floor: FloorManager;
  gs: GameState;
  onNearObject: (idx: number | null) => void;
  onNearElevator: (near: boolean) => void;
  onWin: () => void;
  onFloorChange: (f: 1 | 2) => void;
  onOpenQuiz: (idx: number) => void;
  consumeKey: (k: string) => void;
  keys: Record<string, boolean>;
}

export function useGameLoop(params: UseGameLoopParams) {
  const {
    canvasRef, sprites, player, floor, gs,
    onNearObject, onNearElevator, onWin,
    onFloorChange, onOpenQuiz, consumeKey, keys,
  } = params;

  const lastTime = useRef(0);
  const rafId = useRef(0);

  // ---- Drawing helpers ----
  const drawTile = useCallback((ctx: CanvasRenderingContext2D, tx: number, ty: number, type: number, sx: number, sy: number) => {
    const x = tx * TILE - sx, y = ty * TILE - sy;
    ctx.fillStyle = TILE_COLORS[type] ?? '#e8f0f8';
    ctx.fillRect(x, y, TILE, TILE);
    if ([0, 5, 6].includes(type)) {
      ctx.strokeStyle = FLOOR_GRID; ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, TILE, TILE);
    }
    if (type === 1) {
      ctx.strokeStyle = WALL_BORDER; ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
      ctx.fillStyle = '#42a5f5'; ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
    }
    if (type === 2) {
      ctx.fillStyle = '#a1887f'; ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
      ctx.strokeStyle = '#6d4c41'; ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
    }
    if (type === 3) {
      ctx.fillStyle = '#eceff1'; ctx.fillRect(x + 4, y + 2, TILE - 8, TILE - 4);
      ctx.strokeStyle = '#b0bec5'; ctx.lineWidth = 1;
      ctx.strokeRect(x + 4, y + 2, TILE - 8, TILE - 4);
    }
  }, []);

  const render = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = ctx.canvas;
    const sx = gs.camera.x, sy = gs.camera.y;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#e0e8f0';
    ctx.fillRect(0, 0, width, height);

    // Map tiles
    const startCol = Math.max(0, Math.floor(sx / TILE));
    const endCol = Math.min(floor.map[0].length, Math.ceil((sx + width) / TILE) + 1);
    const startRow = Math.max(0, Math.floor(sy / TILE));
    const endRow = Math.min(floor.map.length, Math.ceil((sy + height) / TILE) + 1);
    for (let r = startRow; r < endRow; r++)
      for (let c = startCol; c < endCol; c++)
        drawTile(ctx, c, r, floor.map[r][c], sx, sy);

    // Decorations
    for (const dec of floor.decorations) {
      const spr = sprites[decorSpriteKey(dec.type)];
      if (spr) ctx.drawImage(spr, dec.x * TILE - sx, dec.y * TILE - sy, TILE, TILE);
    }

    // Elevator glow
    const ex = ELEVATOR_POS.x * TILE - sx, ey = ELEVATOR_POS.y * TILE - sy;
    const pulse = Math.sin(time * 3) * 0.15 + 0.35;
    ctx.fillStyle = `rgba(79,195,247,${pulse})`;
    ctx.fillRect(ex - 3, ey - 3, TILE + 6, TILE + 6);
    if (sprites['elevator']) ctx.drawImage(sprites['elevator'], ex, ey, TILE, TILE);

    // NPCs
    for (const npc of floor.npcs) {
      const nx = npc.x * TILE - sx, ny = npc.y * TILE - sy;
      const bob = Math.sin(time * 2 + npc.x) * 1.5;
      const spr = sprites[npc.spriteKey];
      if (spr) ctx.drawImage(spr, nx, ny + bob, TILE, TILE);
      if (npc.label) {
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillStyle = '#1565c0'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(npc.label, nx + TILE / 2, ny - 4);
      }
    }

    // Broken objects
    for (const obj of floor.floorObjects) {
      const ox = obj.x * TILE - sx, oy = obj.y * TILE - sy;
      
      if (!obj.solved) {
        const blink = Math.sin(time * 4) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255,50,50,${0.15 + blink * 0.3})`;
        ctx.fillRect(ox - 4, oy - 4, TILE + 8, TILE + 8);
      }
      
      const spr = sprites[obj.spriteKey];
      if (spr) ctx.drawImage(spr, ox, oy, TILE, TILE);
      
      if (!obj.solved) {
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillStyle = '#ff5252'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(obj.label, ox + TILE / 2, oy - 6);
      }
    }

    // Room labels
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.fillStyle = 'rgba(33,150,243,0.85)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (const lbl of floor.labels)
      ctx.fillText(lbl.text, lbl.x * TILE + TILE / 2 - sx, lbl.y * TILE + TILE / 2 - sy);

    // Player shadow + sprite
    const px = player.x - sx, py = player.y - sy;
    const bob = player.moving ? Math.sin(time * 10) * 2 : 0;
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(px + player.w / 2, py + player.h + 2, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    if (sprites['player']) ctx.drawImage(sprites['player'], px, py + bob, player.w, player.h);
  }, [drawTile, floor, gs, player, sprites]);

  const tick = useCallback((timestamp: number) => {
    if (gs.screen !== 'playing' || gs.quizActive) {
      rafId.current = requestAnimationFrame(tick);
      return;
    }
    const dt = Math.min((timestamp - lastTime.current) / 1000, 0.05);
    lastTime.current = timestamp;
    const time = timestamp / 1000;

    // Update player
    player.update(keys, floor.map, dt);

    // Camera
    const canvas = canvasRef.current!;
    const mapW = floor.map[0].length * TILE;
    const mapH = floor.map.length * TILE;
    gs.camera.x = Math.max(0, Math.min(player.centerX - canvas.width / 2, mapW - canvas.width));
    gs.camera.y = Math.max(0, Math.min(player.centerY - canvas.height / 2, mapH - canvas.height));

    // Proximity
    const near = floor.nearestObject(player.centerX, player.centerY);
    onNearObject(near ? floor.floorObjects.indexOf(near) : null);
    const nearElev = floor.isNearElevator(player.centerX, player.centerY);
    onNearElevator(nearElev);

    // Space interaction
    if (keys['Space']) {
      consumeKey('Space');
      if (near) {
        AudioManager.interact();
        const idx = floor.allObjects.indexOf(near);
        gs.quizObjectIndex = idx;
        gs.quizActive = true;
        onOpenQuiz(idx);
      } else if (nearElev) {
        const target = floor.oppositeFloor();
        floor.loadFloor(target);
        player.x = ELEVATOR_POS.x * TILE + 6 - TILE * 2;
        player.y = ELEVATOR_POS.y * TILE + 6;
        onFloorChange(target);
        AudioManager.elevator();
      }
    }

    // Win check
    if (floor.allSolved) { onWin(); }

    // Render
    const ctx = canvas.getContext('2d')!;
    render(ctx, time);

    rafId.current = requestAnimationFrame(tick);
  }, [canvasRef, consumeKey, floor, gs, keys, onFloorChange, onNearElevator, onNearObject, onOpenQuiz, onWin, player, render]);

  useEffect(() => {
    if (gs.screen !== 'playing') return;
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [gs.screen, tick]);
}
