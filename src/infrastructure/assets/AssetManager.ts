// ==========================================
// infrastructure/assets/AssetManager.ts
// SVG rasterisasi ke HTMLImageElement
// Dipanggil SEKALI saat preload (sesuai rules)
// Rules: rect/circle/polygon only, flat colors, no filters
// ==========================================

import { SVG_DEFS } from "./svg";
export type { SpriteKey } from "./svg";

export function svgToDataUri(svgStr: string): string {
  const base64 = btoa(unescape(encodeURIComponent(svgStr)));
  return `data:image/svg+xml;base64,${base64}`;
}

/** Mengembalikan Record berisi Data URI untuk dipreload oleh Phaser */
export function getAllSpriteUris(): Record<string, string> {
  const uris: Record<string, string> = {};
  for (const [key, svg] of Object.entries(SVG_DEFS)) {
    uris[key] = svgToDataUri(svg);
  }
  return uris;
}

export function npcSpriteKey(
  role:
    | "doctor"
    | "nurse"
    | "guest"
    | "nurseWheelchair"
    | "nurseBed"
    | "walkingNurse"
    | "security",
): string {
  return role;
}

export function decorSpriteKey(
  type:
    | "bed"
    | "medicine"
    | "radiation"
    | "accessPoint"
    | "car"
    | "motorcycle"
    | "gate"
    | "securityPost"
    | "cctvCamera"
    | "cctvMonitor",
): string {
  return type;
}
