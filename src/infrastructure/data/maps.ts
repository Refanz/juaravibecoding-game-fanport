// ==========================================
// infrastructure/data/maps.ts
// Tile map data untuk 2 lantai rumah sakit
// Tile: 0=floor, 1=wall, 2=desk, 3=bed, 4=plant, 5=carpet, 6=chair
// ==========================================

export type TileMap = number[][];

import { MAP_FLOOR1 } from './maps/floor1';
import { MAP_FLOOR2 } from './maps/floor2';
import { MAP_FLOOR3 } from './maps/floor3';

export { MAP_FLOOR1, MAP_FLOOR2, MAP_FLOOR3 };

export const SOLID_TILES = [1, 2, 3, 4];
export const ELEVATOR_POS = { x: 26, y: 11 };

import { AreaBounds } from './floorData';

/**
 * Mengekstrak (memisahkan) potongan tilemap khusus untuk suatu area
 * berdasarkan acuan batas (bounds) yang didefinisikan pada floorData.ts
 */
export function extractAreaMap(floorMap: TileMap, bounds: AreaBounds): TileMap {
    const areaMap: TileMap = [];
    for (let y = bounds.startY; y <= bounds.endY; y++) {
        if (floorMap[y]) {
            areaMap.push(floorMap[y].slice(bounds.startX, bounds.endX + 1));
        }
    }
    return areaMap;
}
