// ==========================================
// infrastructure/data/floorData.ts
// NPC, dekorasi, objek rusak, dan label
// ruangan per lantai
// ==========================================

export interface RoomLabel { x: number; y: number; text: string; }
export interface NPCData { x: number; y: number; role: 'doctor' | 'nurse'; label: string; }
export interface DecorData { x: number; y: number; type: 'bed' | 'medicine' | 'radiation'; }
export interface BrokenObjectData {
  x: number; y: number;
  type: 'computer' | 'monitor';
  label: string;
  floor: 1 | 2;
}

// ---- Lantai 1 ----
export const ROOM_LABELS_F1: RoomLabel[] = [
  { x: 3, y: 1, text: 'RESEPSIONIS' },
  { x: 12, y: 1, text: 'IGD' },
  { x: 20, y: 1, text: 'FARMASI' },
  { x: 3, y: 7, text: 'ICU' },
  { x: 10, y: 7, text: 'RAWAT INAP' },
  { x: 10, y: 8, text: 'Kelas 1' },
  { x: 15, y: 8, text: 'Kelas 2' },
  { x: 20, y: 8, text: 'Kelas 3' },
  { x: 3, y: 14, text: 'POLIKLINIK / RAWAT JALAN' },
  { x: 3, y: 15, text: 'Anak' }, { x: 7, y: 15, text: 'P.Dalam' },
  { x: 11, y: 15, text: 'Kandung' }, { x: 15, y: 15, text: 'Bedah' },
  { x: 19, y: 15, text: 'Mata' }, { x: 3, y: 18, text: 'THT' },
  { x: 7, y: 18, text: 'Gigi' }, { x: 11, y: 18, text: 'Saraf' },
  { x: 15, y: 18, text: 'Kulit' }, { x: 19, y: 18, text: 'Jantung' },
  { x: 26, y: 10, text: 'LIFT' },
];

export const FLOOR1_NPCS: NPCData[] = [
  { x: 5, y: 3, role: 'nurse', label: 'Perawat' },
  { x: 10, y: 3, role: 'doctor', label: 'Dokter IGD' },
  { x: 22, y: 3, role: 'nurse', label: 'Apoteker' },
  { x: 4, y: 9, role: 'doctor', label: 'Dokter ICU' },
  { x: 14, y: 16, role: 'doctor', label: 'Dokter Bedah' },
  { x: 6, y: 19, role: 'nurse', label: 'Dokter Gigi' },
];

export const FLOOR1_DECORATIONS: DecorData[] = [
  { x: 9, y: 8, type: 'bed' }, { x: 11, y: 8, type: 'bed' },
  { x: 9, y: 10, type: 'bed' }, { x: 11, y: 10, type: 'bed' },
  { x: 15, y: 8, type: 'bed' }, { x: 17, y: 8, type: 'bed' },
  { x: 15, y: 10, type: 'bed' }, { x: 17, y: 10, type: 'bed' },
  { x: 21, y: 8, type: 'bed' }, { x: 23, y: 8, type: 'bed' },
  { x: 21, y: 10, type: 'bed' }, { x: 23, y: 10, type: 'bed' },
  { x: 20, y: 2, type: 'medicine' },
  { x: 22, y: 2, type: 'medicine' },
];

export const FLOOR1_OBJECTS: BrokenObjectData[] = [
  { x: 3, y: 2, type: 'computer', label: 'PC Resepsionis', floor: 1 },
  { x: 11, y: 2, type: 'monitor', label: 'Monitor IGD', floor: 1 },
  { x: 18, y: 2, type: 'computer', label: 'PC Farmasi', floor: 1 },
  { x: 2, y: 8, type: 'computer', label: 'PC ICU', floor: 1 },
  { x: 16, y: 10, type: 'monitor', label: 'Alat R.Inap', floor: 1 },
  { x: 2, y: 15, type: 'computer', label: 'PC Poli Anak', floor: 1 },
  { x: 10, y: 15, type: 'computer', label: 'PC Poli Kandung', floor: 1 },
  { x: 18, y: 18, type: 'computer', label: 'PC Poli Kulit', floor: 1 },
];

// ---- Lantai 2 ----
export const ROOM_LABELS_F2: RoomLabel[] = [
  { x: 3, y: 1, text: 'RUANG OPERASI' },
  { x: 14, y: 1, text: 'RADIOLOGI' },
  { x: 3, y: 7, text: 'HEMODIALISA' },
  { x: 14, y: 7, text: 'RAWAT INAP VIP' },
  { x: 26, y: 10, text: 'LIFT' },
];

export const FLOOR2_NPCS: NPCData[] = [
  { x: 5, y: 2, role: 'doctor', label: 'Dokter Bedah' },
  { x: 16, y: 3, role: 'nurse', label: 'Radiolog' },
  { x: 3, y: 9, role: 'doctor', label: 'Dokter' },
  { x: 17, y: 9, role: 'nurse', label: 'Perawat VIP' },
];

export const FLOOR2_DECORATIONS: DecorData[] = [
  { x: 5, y: 4, type: 'bed' },
  { x: 8, y: 2, type: 'bed' },
  { x: 15, y: 10, type: 'bed' },
  { x: 18, y: 10, type: 'bed' },
  { x: 14, y: 4, type: 'radiation' },
  { x: 18, y: 4, type: 'radiation' },
];

export const FLOOR2_OBJECTS: BrokenObjectData[] = [
  { x: 2, y: 2, type: 'computer', label: 'PC R.Operasi', floor: 2 },
  { x: 14, y: 2, type: 'monitor', label: 'Alat Radiologi', floor: 2 },
  { x: 5, y: 8, type: 'computer', label: 'PC Hemodialisa', floor: 2 },
  { x: 15, y: 8, type: 'monitor', label: 'Alat VIP', floor: 2 },
];
