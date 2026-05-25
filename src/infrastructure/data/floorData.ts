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
  type: 'computer' | 'monitor' | 'serverRack' | 'ups' | 'firewall' | 'switchCore' | 'switchAccess' | 'ac' | 'accessDoor' | 'modemSenang' | 'modemCepat' | 'modemGatotkaca';
  label: string;
  floor: 1 | 2 | 3;
}

import floor1Json from './maps/floor1.json';
import floor2Json from './maps/floor2.json';
import floor3Json from './maps/floor3.json';

const parseObjects = (json: any, floor: 1|2|3) => {
  const objectsLayer = json.layers.find((l: any) => l.type === 'objectgroup');
  if (!objectsLayer) return { labels: [], npcs: [], decor: [], broken: [] };

  const labels: RoomLabel[] = [];
  const npcs: NPCData[] = [];
  const decor: DecorData[] = [];
  const broken: BrokenObjectData[] = [];

  for (const obj of objectsLayer.objects || []) {
    const x = obj.x / 48;
    const y = obj.y / 48;
    const getProp = (name: string) => obj.properties?.find((p: any) => p.name === name)?.value;

    if (obj.type === 'Label') {
      labels.push({ x, y, text: getProp('text') });
    } else if (obj.type === 'NPC') {
      npcs.push({ x, y, role: getProp('role'), label: getProp('label') });
    } else if (obj.type === 'Decoration') {
      decor.push({ x, y, type: getProp('type') });
    } else if (obj.type === 'BrokenObject') {
      broken.push({ x, y, type: getProp('type'), label: getProp('label'), floor });
    }
  }
  return { labels, npcs, decor, broken };
};

const f1Data = parseObjects(floor1Json, 1);
const f2Data = parseObjects(floor2Json, 2);
const f3Data = parseObjects(floor3Json, 3);

export const ROOM_LABELS_F1 = f1Data.labels;
export const FLOOR1_NPCS = f1Data.npcs;
export const FLOOR1_DECORATIONS = f1Data.decor;
export const FLOOR1_OBJECTS = f1Data.broken;

export const ROOM_LABELS_F2 = f2Data.labels;
export const FLOOR2_NPCS = f2Data.npcs;
export const FLOOR2_DECORATIONS = f2Data.decor;
export const FLOOR2_OBJECTS = f2Data.broken;

export const ROOM_LABELS_F3 = f3Data.labels;
export const FLOOR3_NPCS = f3Data.npcs;
export const FLOOR3_DECORATIONS = f3Data.decor;
export const FLOOR3_OBJECTS = f3Data.broken;

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

export const FLOOR3_AREA_BOUNDS: AreaBounds[] = [
  { id: 'server_room', startX: 1, startY: 1, endX: 26, endY: 28 },
];
