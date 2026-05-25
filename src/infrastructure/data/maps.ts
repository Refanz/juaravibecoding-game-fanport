// ==========================================
// infrastructure/data/maps.ts
// Tile map data URLs for Phaser Tilemap JSON
// ==========================================

// @ts-ignore
import floor1Url from './maps/floor1.json?url';
// @ts-ignore
import floor2Url from './maps/floor2.json?url';
// @ts-ignore
import floor3Url from './maps/floor3.json?url';

export const ELEVATOR_POS = { x: 36, y: 11 };
export const SOLID_TILES = [1, 2, 3, 4]; // (actually these are now just mapped in Tilemap)

export { floor1Url, floor2Url, floor3Url };
