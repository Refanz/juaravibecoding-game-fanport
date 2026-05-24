// ==========================================
// infrastructure/data/maps/floor3.ts
// Tile map data untuk lantai 3 rumah sakit (Server Room)
// ==========================================

import { TileMap } from '../maps';

// Map ukuran 28 x 30
const map: TileMap = [];
for (let y = 0; y < 30; y++) {
    const row: number[] = [];
    for (let x = 0; x < 28; x++) {
        row.push(1); // Default tembok
    }
    map.push(row);
}

// 1. Lorong dari Lift (x=20..27, y=10..12)
for (let y = 10; y <= 12; y++) {
    for (let x = 20; x <= 26; x++) {
        map[y][x] = 0; // lantai lorong
    }
}

// Sekat lorong lift agar menyerupai lantai 1 dan 2
map[10][25] = 1; map[11][25] = 0; map[12][25] = 1;
map[10][26] = 1; map[11][26] = 0; map[12][26] = 1;

// 2. Pintu Akses Server Room di x=20, y=11
map[10][20] = 1; 
map[11][20] = 0; 
map[12][20] = 1;

// 3. Server Room (Ruangan besar dengan sekat dinding luar)
// Area: x=2..19, y=2..27
for (let y = 2; y <= 27; y++) {
    for (let x = 2; x <= 19; x++) {
        map[y][x] = 0; // lantai server room
    }
}

// 4. Tambahkan pilar/sekat struktur di dalam ruangan agar tidak terlalu kosong
for (let y = 6; y <= 24; y += 6) {
    map[y][2] = 1; // Pilar kiri
    map[y][19] = 1; // Pilar kanan
}

export const MAP_FLOOR3: TileMap = map;
