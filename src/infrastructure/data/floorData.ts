// ==========================================
// infrastructure/data/floorData.ts
// NPC, dekorasi, objek rusak, dan label
// ruangan per lantai
// ==========================================

export interface RoomLabel { x: number; y: number; text: string; }
export interface NPCData { x: number; y: number; role: 'doctor' | 'nurse' | 'guest' | 'nurseWheelchair' | 'nurseBed' | 'walkingNurse' | 'security'; label: string; }
export interface DecorData { x: number; y: number; type: 'bed' | 'medicine' | 'radiation' | 'accessPoint' | 'car' | 'motorcycle' | 'gate' | 'securityPost' | 'cctvCamera' | 'cctvMonitor'; }
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
  { x: 24, y: 16, text: 'RUANG CCTV' },
];

export const FLOOR1_NPCS: NPCData[] = [
  { x: 5, y: 3, role: 'nurse', label: 'Perawat' },
  { x: 10, y: 3, role: 'doctor', label: 'Dokter IGD' },
  { x: 22, y: 3, role: 'nurse', label: 'Apoteker' },
  { x: 4, y: 9, role: 'doctor', label: 'Dokter ICU' },
  { x: 14, y: 16, role: 'doctor', label: 'Dokter Bedah' },
  { x: 6, y: 19, role: 'nurse', label: 'Dokter Gigi' },
  // Moving Interior NPCs
  { x: 8, y: 11, role: 'nurseBed', label: 'Pasien Masuk' },
  { x: 14, y: 3, role: 'walkingNurse', label: 'Perawat' },
  // Exterior NPCs
  { x: 2, y: 26, role: 'guest', label: 'Tamu' },
  { x: 16, y: 27, role: 'guest', label: 'Tamu' },
  { x: 6, y: 23, role: 'nurseWheelchair', label: 'Pasien' },
  // Security NPCs
  { x: 5, y: 22, role: 'security', label: 'Satpam' },
  { x: 21, y: 22, role: 'security', label: 'Satpam' },
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
  // Access Points for each room
  { x: 4, y: 0, type: 'accessPoint' },   // Resepsionis
  { x: 13, y: 0, type: 'accessPoint' },  // IGD
  { x: 21, y: 0, type: 'accessPoint' },  // Farmasi
  { x: 4, y: 6, type: 'accessPoint' },   // ICU
  { x: 11, y: 6, type: 'accessPoint' },  // Rawat Inap 1
  { x: 16, y: 6, type: 'accessPoint' },  // Rawat Inap 2
  { x: 21, y: 6, type: 'accessPoint' },  // Rawat Inap 3
  { x: 4, y: 13, type: 'accessPoint' },  // Poli Anak
  { x: 8, y: 13, type: 'accessPoint' },  // Poli Dalam
  { x: 12, y: 13, type: 'accessPoint' }, // Poli Kandung
  { x: 16, y: 13, type: 'accessPoint' }, // Poli Bedah
  { x: 20, y: 13, type: 'accessPoint' }, // Poli Mata
  { x: 4, y: 17, type: 'accessPoint' },  // Poli THT
  { x: 8, y: 17, type: 'accessPoint' },  // Poli Gigi
  { x: 12, y: 17, type: 'accessPoint' }, // Poli Saraf
  { x: 16, y: 17, type: 'accessPoint' }, // Poli Kulit
  { x: 20, y: 17, type: 'accessPoint' }, // Poli Jantung
  // Exterior Parking
  { x: 5, y: 21, type: 'securityPost' },
  { x: 6, y: 21, type: 'gate' },
  { x: 7, y: 21, type: 'gate' },
  { x: 20, y: 21, type: 'securityPost' },
  { x: 21, y: 21, type: 'gate' },
  { x: 22, y: 21, type: 'gate' },
  // Parking area motors (left side)
  { x: 1, y: 22, type: 'motorcycle' },
  { x: 3, y: 22, type: 'motorcycle' },
  { x: 1, y: 23, type: 'motorcycle' },
  { x: 3, y: 23, type: 'motorcycle' },
  { x: 1, y: 24, type: 'motorcycle' },
  { x: 3, y: 24, type: 'motorcycle' },
  { x: 10, y: 22, type: 'motorcycle' },
  { x: 12, y: 22, type: 'motorcycle' },
  { x: 10, y: 23, type: 'motorcycle' },
  { x: 12, y: 23, type: 'motorcycle' },
  // Parking area cars (right & middle)
  { x: 2, y: 23, type: 'car' },
  { x: 14, y: 22, type: 'car' },
  { x: 14, y: 24, type: 'car' },
  { x: 17, y: 22, type: 'car' },
  { x: 17, y: 24, type: 'car' },
  { x: 24, y: 22, type: 'car' },
  { x: 24, y: 24, type: 'car' },
  { x: 25, y: 23, type: 'car' },
  // CCTV Cameras — Lantai 1
  { x: 3, y: 1, type: 'cctvCamera' },    // Resepsionis
  { x: 12, y: 1, type: 'cctvCamera' },   // IGD
  { x: 12, y: 7, type: 'cctvCamera' },   // Lorong Rawat Inap
  { x: 3, y: 7, type: 'cctvCamera' },    // ICU
  { x: 4, y: 14, type: 'cctvCamera' },   // Lorong Rawat Jalan
  { x: 26, y: 12, type: 'cctvCamera' },  // Dekat Lift Lt.1
  { x: 15, y: 22, type: 'cctvCamera' },  // Area Parkir
  // CCTV Control Room Monitor (di Ruang CCTV baru)
  { x: 24, y: 17, type: 'cctvMonitor' },
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
  // Moving Interior NPCs
  { x: 10, y: 5, role: 'walkingNurse', label: 'Perawat' },
  { x: 8, y: 12, role: 'nurseBed', label: 'Transfer VIP' },
];

export const FLOOR2_DECORATIONS: DecorData[] = [
  { x: 5, y: 4, type: 'bed' },
  { x: 8, y: 2, type: 'bed' },
  { x: 15, y: 10, type: 'bed' },
  { x: 18, y: 10, type: 'bed' },
  { x: 14, y: 4, type: 'radiation' },
  { x: 18, y: 4, type: 'radiation' },
  // Access Points for each room
  { x: 4, y: 0, type: 'accessPoint' },   // R. Operasi
  { x: 15, y: 0, type: 'accessPoint' },  // Radiologi
  { x: 4, y: 6, type: 'accessPoint' },   // Hemodialisa
  { x: 15, y: 6, type: 'accessPoint' },  // VIP
  // CCTV Cameras — Lantai 2
  { x: 4, y: 1, type: 'cctvCamera' },    // Area Ruang Operasi
  { x: 15, y: 1, type: 'cctvCamera' },   // Radiologi
  { x: 4, y: 7, type: 'cctvCamera' },    // Hemodialisa
  { x: 26, y: 12, type: 'cctvCamera' },  // Dekat Lift Lt.2
];

export const FLOOR2_OBJECTS: BrokenObjectData[] = [
  { x: 2, y: 2, type: 'computer', label: 'PC R.Operasi', floor: 2 },
  { x: 14, y: 2, type: 'monitor', label: 'Alat Radiologi', floor: 2 },
  { x: 5, y: 8, type: 'computer', label: 'PC Hemodialisa', floor: 2 },
  { x: 15, y: 8, type: 'monitor', label: 'Alat VIP', floor: 2 },
];

export interface AreaBounds {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const FLOOR1_AREA_BOUNDS: AreaBounds[] = [
  { id: 'resepsionis', startX: 1, startY: 1, endX: 6, endY: 5 },
  { id: 'igd', startX: 8, startY: 1, endX: 14, endY: 5 },
  { id: 'farmasi', startX: 16, startY: 1, endX: 26, endY: 5 },
  { id: 'icu', startX: 1, startY: 7, endX: 6, endY: 12 },
  { id: 'rawat_inap_1', startX: 8, startY: 7, endX: 12, endY: 12 },
  { id: 'rawat_inap_2', startX: 14, startY: 7, endX: 18, endY: 12 },
  { id: 'rawat_inap_3', startX: 20, startY: 7, endX: 26, endY: 12 },
  { id: 'poliklinik', startX: 1, startY: 15, endX: 21, endY: 19 },
  { id: 'ruang_cctv', startX: 23, startY: 15, endX: 26, endY: 19 },
];

export const FLOOR2_AREA_BOUNDS: AreaBounds[] = [
  { id: 'ruang_operasi', startX: 1, startY: 1, endX: 10, endY: 5 },
  { id: 'radiologi', startX: 12, startY: 1, endX: 26, endY: 5 },
  { id: 'hemodialisa', startX: 1, startY: 7, endX: 10, endY: 12 },
  { id: 'vip', startX: 12, startY: 7, endX: 26, endY: 12 },
];
