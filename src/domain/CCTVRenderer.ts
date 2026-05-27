// ==========================================
// domain/CCTVRenderer.ts
// Pure Canvas 2D renderer for CCTV views.
// Bypasses Phaser entirely — reads raw tile
// data from JSON and renders onto offscreen
// canvases. Results cached in sessionStorage.
// ==========================================

import floor1Json from "../infrastructure/data/maps/floor1.json";
import floor2Json from "../infrastructure/data/maps/floor2.json";
import floor3Json from "../infrastructure/data/maps/floor3.json";
import {
  AreaBounds,
  FLOOR1_AREA_BOUNDS,
  FLOOR2_AREA_BOUNDS,
  FLOOR3_AREA_BOUNDS,
} from "../infrastructure/data/floorData";
import { svgToDataUri } from "../infrastructure/assets/AssetManager";
import { SVG_DEFS } from "../infrastructure/assets/svg";

const TILE = 48;
// Render at half-res for performance (each tile = 6px in the thumbnail)
const SCALE = 0.125;
const TILE_S = TILE * SCALE; // 6px

// Storage key prefix
const STORAGE_KEY = "cctv_frame_";

// Tile colors for fallback rendering (tile ID → hex color string)
// Tile IDs in the JSON are 1-indexed (firstgid=1), so tileId 1 = index 0 in this array
const TILE_COLORS: string[] = [
  "#e8f0f8", // 1: floor
  "#90caf9", // 2: floorBlue
  "#8d6e63", // 3: wall
  "#5d8aa0", // 4: desk
  "#66bb6a", // 5: grass
  "#9e9e9e", // 6: window
  "#cfd8dc", // 7: grayFloor
  "#34495e", // 8: road
  "#7f8c8d", // 9: parking
  "#8d6e63", // 10: wallVertical
  "#8d6e63", // 11: wallCornerTopLeft
  "#8d6e63", // 12: wallCornerTopRight
  "#8d6e63", // 13: wallCornerBottomLeft
  "#8d6e63", // 14: wallCornerBottomRight
  "#8d6e63", // 15: wallTjunctionDown (using darker)
  "#8d6e63", // 16: wallTjunctionUp
  "#8d6e63", // 17: wallTjunctionRight
  "#8d6e63", // 18: wallTjunctionLeft
  "#8d6e63", // 19: wallCross
  "#90caf9", // 20: glassDoor
  "#90caf9", // 21: glassDoorVertical
];

// Decoration colors for rendering
const DECOR_COLORS: Record<string, string> = {
  bed: "#4fc3f7",
  medicine: "#66bb6a",
  radiation: "#fdd835",
  accessPoint: "#ab47bc",
  car: "#78909c",
  motorcycle: "#a1887f",
  gate: "#ff8a65",
  securityPost: "#ef5350",
  cctvCamera: "#e53935",
  cctvMonitor: "#29b6f6",
};

// NPC colors
const NPC_COLORS: Record<string, string> = {
  doctor: "#ffffff",
  nurse: "#81d4fa",
  guest: "#a5d6a7",
  nurseWheelchair: "#81d4fa",
  nurseBed: "#81d4fa",
  walkingNurse: "#81d4fa",
  security: "#ef9a9a",
};

// Broken object color
const BROKEN_COLOR = "#ff1744";

interface FloorData {
  width: number;
  height: number;
  tileData: number[];
  objects: any[];
}

function parseFloorJson(json: any): FloorData {
  const tileLayer = json.layers.find((l: any) => l.type === "tilelayer");
  const objectLayer = json.layers.find((l: any) => l.type === "objectgroup");
  return {
    width: json.width,
    height: json.height,
    tileData: tileLayer?.data || [],
    objects: objectLayer?.objects || [],
  };
}

const FLOOR_DATA: Record<number, FloorData> = {
  1: parseFloorJson(floor1Json),
  2: parseFloorJson(floor2Json),
  3: parseFloorJson(floor3Json),
};

const FLOOR_BOUNDS: Record<number, AreaBounds[]> = {
  1: FLOOR1_AREA_BOUNDS,
  2: FLOOR2_AREA_BOUNDS,
  3: FLOOR3_AREA_BOUNDS,
};

// Rasterized tile image (stitched tileset)
let tilesetImage: HTMLImageElement | null = null;
let tilesetReady = false;

function loadTileset(): Promise<void> {
  return new Promise((resolve) => {
    if (tilesetReady) {
      resolve();
      return;
    }
    const svgStr = SVG_DEFS.hospitalTiles;
    const uri = svgToDataUri(svgStr);
    const img = new Image();
    img.onload = () => {
      tilesetImage = img;
      tilesetReady = true;
      resolve();
    };
    img.onerror = () => {
      // Fallback: will use color rectangles
      tilesetReady = true;
      resolve();
    };
    img.src = uri;
  });
}

// Rasterize decoration SVGs to small images
const decorImageCache: Map<string, HTMLImageElement> = new Map();
const decorLoadPromises: Map<string, Promise<void>> = new Map();

function loadDecorImage(type: string): Promise<void> {
  if (decorImageCache.has(type)) return Promise.resolve();
  if (decorLoadPromises.has(type)) return decorLoadPromises.get(type)!;

  const svgStr = SVG_DEFS[type as keyof typeof SVG_DEFS];
  if (!svgStr) return Promise.resolve();

  const promise = new Promise<void>((resolve) => {
    const uri = svgToDataUri(svgStr);
    const img = new Image();
    img.onload = () => {
      decorImageCache.set(type, img);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = uri;
  });
  decorLoadPromises.set(type, promise);
  return promise;
}

/**
 * Render a single CCTV area and return a data URL
 */
function renderArea(
  floor: number,
  bounds: AreaBounds,
  animFrame: number,
): string {
  const floorData = FLOOR_DATA[floor];
  if (!floorData) return "";

  const areaW = (bounds.endX + 1 - bounds.startX) * TILE_S;
  const areaH = (bounds.endY + 1 - bounds.startY) * TILE_S;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(areaW);
  canvas.height = Math.ceil(areaH);
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Draw tiles
  for (let ty = bounds.startY; ty <= bounds.endY; ty++) {
    for (let tx = bounds.startX; tx <= bounds.endX; tx++) {
      const idx = ty * floorData.width + tx;
      const tileId = floorData.tileData[idx] || 0;

      const dx = (tx - bounds.startX) * TILE_S;
      const dy = (ty - bounds.startY) * TILE_S;

      if (tileId > 0 && tilesetImage && tilesetReady) {
        // Draw tile from tileset image (tileId is 1-indexed)
        const srcX = (tileId - 1) * TILE;
        ctx.drawImage(tilesetImage, srcX, 0, TILE, TILE, dx, dy, TILE_S, TILE_S);
      } else if (tileId > 0) {
        // Fallback: colored rectangle
        ctx.fillStyle = TILE_COLORS[tileId - 1] || "#333333";
        ctx.fillRect(dx, dy, TILE_S, TILE_S);
      } else {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(dx, dy, TILE_S, TILE_S);
      }
    }
  }

  // Draw decorations & NPCs & objects
  for (const obj of floorData.objects) {
    const ox = obj.x / TILE;
    const oy = obj.y / TILE;

    // Check if within bounds
    if (ox < bounds.startX || ox > bounds.endX || oy < bounds.startY || oy > bounds.endY) {
      continue;
    }

    const dx = (ox - bounds.startX) * TILE_S + TILE_S / 2;
    const dy = (oy - bounds.startY) * TILE_S + TILE_S / 2;
    const getProp = (name: string) =>
      obj.properties?.find((p: any) => p.name === name)?.value;

    if (obj.type === "Decoration") {
      const type = getProp("type");

      // Try to draw the actual sprite
      const decorImg = decorImageCache.get(type);
      if (decorImg) {
        ctx.drawImage(
          decorImg,
          dx - TILE_S / 2,
          dy - TILE_S / 2,
          TILE_S,
          TILE_S,
        );
      } else {
        // Fallback: colored dot
        const color = DECOR_COLORS[type] || "#607d8b";
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(dx - TILE_S * 0.3, dy - TILE_S * 0.3, TILE_S * 0.6, TILE_S * 0.6);
        ctx.globalAlpha = 1;
      }
    } else if (obj.type === "NPC") {
      const role = getProp("role");
      const color = NPC_COLORS[role] || "#ffffff";
      // Animate NPC position slightly
      const wobbleX = Math.sin(animFrame * 0.05 + ox * 3.7) * TILE_S * 0.3;
      const wobbleY = Math.cos(animFrame * 0.07 + oy * 2.3) * TILE_S * 0.15;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(dx + wobbleX, dy + wobbleY, TILE_S * 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Small shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(dx + wobbleX, dy + wobbleY + TILE_S * 0.3, TILE_S * 0.3, TILE_S * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (obj.type === "BrokenObject") {
      // Blinking effect
      const blink = Math.sin(animFrame * 0.15 + ox) > 0;
      ctx.fillStyle = blink ? BROKEN_COLOR : "#ff616166";
      ctx.fillRect(dx - TILE_S * 0.35, dy - TILE_S * 0.35, TILE_S * 0.7, TILE_S * 0.7);

      // Warning border
      if (blink) {
        ctx.strokeStyle = "#ffeb3b";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(dx - TILE_S * 0.35, dy - TILE_S * 0.35, TILE_S * 0.7, TILE_S * 0.7);
      }
    }
  }

  // Add scanline effect
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  for (let y = 0; y < canvas.height; y += 2) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  // Add slight vignette
  const grad = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
    canvas.width / 2, canvas.height / 2, canvas.width * 0.7,
  );
  grad.addColorStop(0, "transparent");
  grad.addColorStop(1, "rgba(0,0,0,0.3)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/png");
}

// ────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────

let animFrame = 0;
let initialized = false;

/** Initialize assets (call once at app start) */
export async function initCCTVRenderer(): Promise<void> {
  if (initialized) return;
  await loadTileset();

  // Preload common decoration sprites
  const decorTypes = [
    "bed", "medicine", "radiation", "accessPoint",
    "cctvCamera", "cctvMonitor", "car", "motorcycle",
    "gate", "securityPost", "elevator",
    "serverRack", "ups", "firewall", "switchCore", "switchAccess",
    "modemSenang", "modemCepat", "modemGatotkaca", "ac", "accessDoor",
    "pcBroken", "medBroken",
  ];
  await Promise.all(decorTypes.map(loadDecorImage));
  initialized = true;
}

/**
 * Render ALL CCTV areas across all floors and store in sessionStorage.
 * Returns a Record<areaId, dataURL>.
 */
export function captureAllCCTVFrames(): Record<string, string> {
  animFrame++;
  const results: Record<string, string> = {};

  for (const floor of [1, 2, 3]) {
    const bounds = FLOOR_BOUNDS[floor] || [];
    for (const area of bounds) {
      const src = renderArea(floor, area, animFrame);
      if (src) {
        results[area.id] = src;
        try {
          sessionStorage.setItem(STORAGE_KEY + area.id, src);
        } catch (_) {
          // sessionStorage might be full — silently ignore
        }
      }
    }
  }

  return results;
}

/**
 * Load cached CCTV frames from sessionStorage
 */
export function loadCachedCCTVFrames(): Record<string, string> {
  const results: Record<string, string> = {};
  const allBounds = [
    ...FLOOR1_AREA_BOUNDS,
    ...FLOOR2_AREA_BOUNDS,
    ...FLOOR3_AREA_BOUNDS,
  ];
  for (const area of allBounds) {
    try {
      const cached = sessionStorage.getItem(STORAGE_KEY + area.id);
      if (cached) results[area.id] = cached;
    } catch (_) {
      // ignore
    }
  }
  return results;
}
