// ==========================================
// infrastructure/assets/AssetManager.ts
// SVG rasterisasi ke HTMLImageElement
// Dipanggil SEKALI saat preload (sesuai rules)
// Rules: rect/circle/polygon only, flat colors, no filters
// ==========================================

const SVG_DEFS: Record<string, string> = {
  player: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <circle cx="24" cy="12" r="9" fill="#F5CBA7"/>
    <rect x="14" y="20" width="20" height="16" rx="2" fill="#2980B9"/>
    <rect x="10" y="36" width="28" height="6" rx="2" fill="#2471A3"/>
    <rect x="14" y="23" width="12" height="8" rx="1" fill="#85C1E9"/>
    <rect x="27" y="25" width="6" height="5" rx="1" fill="#1ABC9C"/>
    <rect x="16" y="10" width="16" height="4" rx="2" fill="#2C3E50"/>
  </svg>`,
  doctor: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <circle cx="24" cy="12" r="9" fill="#F5CBA7"/>
    <rect x="14" y="20" width="20" height="18" rx="2" fill="#FDFEFE"/>
    <rect x="19" y="22" width="10" height="2" fill="#2ECC71"/>
    <rect x="10" y="38" width="28" height="6" rx="2" fill="#BDC3C7"/>
    <rect x="19" y="6" width="10" height="3" rx="1" fill="#2C3E50"/>
  </svg>`,
  nurse: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <circle cx="24" cy="12" r="9" fill="#F5CBA7"/>
    <rect x="14" y="20" width="20" height="18" rx="2" fill="#5DADE2"/>
    <rect x="10" y="38" width="28" height="6" rx="2" fill="#2E86C1"/>
    <rect x="21" y="22" width="6" height="1" fill="#FDFEFE"/>
    <rect x="23" y="20" width="2" height="5" fill="#FDFEFE"/>
    <polygon points="16,8 32,8 29,4 19,4" fill="#FDFEFE"/>
  </svg>`,
  pcBroken: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="6" y="28" width="36" height="4" rx="1" fill="#7F8C8D"/>
    <rect x="20" y="32" width="8" height="8" fill="#7F8C8D"/>
    <rect x="8" y="10" width="32" height="20" rx="2" fill="#2C3E50"/>
    <rect x="10" y="12" width="28" height="16" fill="#922B21"/>
    <polygon points="24,14 28,22 20,22" fill="#F39C12"/>
    <rect x="23" y="23" width="2" height="2" fill="#F39C12"/>
    <rect x="6" y="8" width="6" height="6" rx="3" fill="#E74C3C"/>
    <rect x="14" y="43" width="20" height="3" rx="1" fill="#7F8C8D"/>
  </svg>`,
  medBroken: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="6" y="8" width="36" height="28" rx="3" fill="#1C2833"/>
    <rect x="9" y="11" width="30" height="20" fill="#922B21"/>
    <polygon points="16,20 22,13 26,18 28,15 32,20" fill="#E74C3C"/>
    <rect x="9" y="25" width="6" height="3" fill="#E74C3C"/>
    <rect x="16" y="25" width="6" height="3" fill="#F39C12"/>
    <rect x="18" y="36" width="12" height="4" fill="#2C3E50"/>
    <rect x="10" y="40" width="28" height="4" rx="1" fill="#5D6D7E"/>
    <rect x="38" y="7" width="6" height="6" rx="3" fill="#E74C3C"/>
  </svg>`,
  elevator: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="4" y="2" width="40" height="44" rx="3" fill="#BDC3C7"/>
    <rect x="7" y="5" width="16" height="36" rx="2" fill="#85929E"/>
    <rect x="25" y="5" width="16" height="36" rx="2" fill="#85929E"/>
    <polygon points="24,9 20,14 28,14" fill="#4FC3F7"/>
    <polygon points="24,27 20,22 28,22" fill="#4FC3F7"/>
    <rect x="36" y="20" width="6" height="8" rx="2" fill="#2C3E50"/>
    <rect x="37" y="22" width="4" height="2" rx="1" fill="#4FC3F7"/>
    <rect x="37" y="25" width="4" height="2" rx="1" fill="#F39C12"/>
  </svg>`,
  bed: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="4" y="20" width="40" height="22" rx="2" fill="#AED6F1"/>
    <rect x="4" y="16" width="40" height="6" rx="2" fill="#5DADE2"/>
    <rect x="4" y="16" width="12" height="26" rx="2" fill="#FDFEFE"/>
    <rect x="5" y="40" width="6" height="6" rx="1" fill="#7F8C8D"/>
    <rect x="37" y="40" width="6" height="6" rx="1" fill="#7F8C8D"/>
  </svg>`,
  medicine: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="14" y="8" width="20" height="28" rx="4" fill="#FDFEFE"/>
    <rect x="14" y="8" width="20" height="14" rx="4" fill="#E74C3C"/>
    <rect x="14" y="19" width="20" height="3" fill="#2C3E50"/>
    <rect x="21" y="26" width="6" height="2" fill="#2ECC71"/>
    <rect x="23" y="24" width="2" height="6" fill="#2ECC71"/>
    <rect x="18" y="4" width="12" height="6" rx="2" fill="#BDC3C7"/>
  </svg>`,
  radiation: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <circle cx="24" cy="24" r="20" fill="#F39C12"/>
    <circle cx="24" cy="24" r="6" fill="#2C3E50"/>
    <polygon points="24,4 26,18 22,18" fill="#2C3E50"/>
    <polygon points="24,44 22,30 26,30" fill="#2C3E50"/>
    <polygon points="4,24 18,22 18,26" fill="#2C3E50"/>
    <polygon points="44,24 30,26 30,22" fill="#2C3E50"/>
    <circle cx="24" cy="24" r="3" fill="#F39C12"/>
  </svg>`,
};

export type SpriteKey = keyof typeof SVG_DEFS;
export type SpriteMap = Record<string, HTMLImageElement>;

function svgToImage(svgStr: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.src = url;
  });
}

/** Rasterisasi semua SVG ke Image — dipanggil SEKALI saat init. */
export async function preloadSprites(): Promise<SpriteMap> {
  const entries = await Promise.all(
    Object.entries(SVG_DEFS).map(async ([key, svg]) => [key, await svgToImage(svg)] as [string, HTMLImageElement])
  );
  return Object.fromEntries(entries);
}

export function npcSpriteKey(role: 'doctor' | 'nurse'): string {
  return role === 'nurse' ? 'nurse' : 'doctor';
}

export function decorSpriteKey(type: 'bed' | 'medicine' | 'radiation'): string {
  return type;
}
