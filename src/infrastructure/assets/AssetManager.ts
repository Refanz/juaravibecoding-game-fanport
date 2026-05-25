// ==========================================
// infrastructure/assets/AssetManager.ts
// SVG rasterisasi ke HTMLImageElement
// Dipanggil SEKALI saat preload (sesuai rules)
// Rules: rect/circle/polygon only, flat colors, no filters
// ==========================================

const SVG_DEFS: Record<string, string> = {
  player: `<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144"><g transform="translate(0, 0)"><rect x="18" y="36" width="4" height="10" fill="#34495E"/><rect x="26" y="36" width="4" height="10" fill="#34495E"/><rect x="18" y="44" width="4" height="4" rx="1" fill="#17202A"/><rect x="26" y="44" width="4" height="4" rx="1" fill="#17202A"/><rect x="16" y="20" width="16" height="16" rx="2" fill="#2980B9"/><rect x="26" y="22" width="4" height="5" rx="1" fill="#F1C40F"/><circle cx="24" cy="12" r="9" fill="#F5CBA7"/><path d="M 15 12 Q 15 2 24 3 Q 33 2 33 12 Q 24 6 15 12" fill="#2C3E50"/><rect x="20" y="10" width="2" height="2" fill="#2C3E50"/><rect x="26" y="10" width="2" height="2" fill="#2C3E50"/><rect x="11" y="21" width="4" height="12" rx="2" fill="#F5CBA7"/><rect x="11" y="21" width="4" height="6" rx="1" fill="#2980B9"/><rect x="33" y="21" width="4" height="12" rx="2" fill="#F5CBA7"/><rect x="33" y="21" width="4" height="6" rx="1" fill="#2980B9"/></g><g transform="translate(48, 0)"><rect x="18" y="34" width="4" height="10" fill="#34495E"/><rect x="26" y="36" width="4" height="10" fill="#34495E"/><rect x="18" y="42" width="4" height="4" rx="1" fill="#17202A"/><rect x="26" y="44" width="4" height="4" rx="1" fill="#17202A"/><rect x="16" y="21" width="16" height="16" rx="2" fill="#2980B9"/><rect x="26" y="23" width="4" height="5" rx="1" fill="#F1C40F"/><circle cx="24" cy="13" r="9" fill="#F5CBA7"/><path d="M 15 13 Q 15 3 24 4 Q 33 3 33 13 Q 24 7 15 13" fill="#2C3E50"/><rect x="20" y="11" width="2" height="2" fill="#2C3E50"/><rect x="26" y="11" width="2" height="2" fill="#2C3E50"/><rect x="11" y="22" width="4" height="12" rx="2" fill="#F5CBA7" transform="rotate(15, 13, 22)"/><rect x="11" y="22" width="4" height="6" rx="1" fill="#2980B9" transform="rotate(15, 13, 22)"/><rect x="33" y="22" width="4" height="12" rx="2" fill="#F5CBA7" transform="rotate(-15, 35, 22)"/><rect x="33" y="22" width="4" height="6" rx="1" fill="#2980B9" transform="rotate(-15, 35, 22)"/></g><g transform="translate(96, 0)"><rect x="18" y="36" width="4" height="10" fill="#34495E"/><rect x="26" y="34" width="4" height="10" fill="#34495E"/><rect x="18" y="44" width="4" height="4" rx="1" fill="#17202A"/><rect x="26" y="42" width="4" height="4" rx="1" fill="#17202A"/><rect x="16" y="21" width="16" height="16" rx="2" fill="#2980B9"/><rect x="26" y="23" width="4" height="5" rx="1" fill="#F1C40F"/><circle cx="24" cy="13" r="9" fill="#F5CBA7"/><path d="M 15 13 Q 15 3 24 4 Q 33 3 33 13 Q 24 7 15 13" fill="#2C3E50"/><rect x="20" y="11" width="2" height="2" fill="#2C3E50"/><rect x="26" y="11" width="2" height="2" fill="#2C3E50"/><rect x="11" y="22" width="4" height="12" rx="2" fill="#F5CBA7" transform="rotate(-15, 13, 22)"/><rect x="11" y="22" width="4" height="6" rx="1" fill="#2980B9" transform="rotate(-15, 13, 22)"/><rect x="33" y="22" width="4" height="12" rx="2" fill="#F5CBA7" transform="rotate(15, 35, 22)"/><rect x="33" y="22" width="4" height="6" rx="1" fill="#2980B9" transform="rotate(15, 35, 22)"/></g><g transform="translate(0, 48)"><rect x="18" y="36" width="4" height="10" fill="#34495E"/><rect x="26" y="36" width="4" height="10" fill="#34495E"/><rect x="18" y="44" width="4" height="4" rx="1" fill="#17202A"/><rect x="26" y="44" width="4" height="4" rx="1" fill="#17202A"/><rect x="11" y="21" width="4" height="12" rx="2" fill="#E5B38F"/><rect x="11" y="21" width="4" height="6" rx="1" fill="#2471A3"/><rect x="33" y="21" width="4" height="12" rx="2" fill="#E5B38F"/><rect x="33" y="21" width="4" height="6" rx="1" fill="#2471A3"/><rect x="16" y="20" width="16" height="16" rx="2" fill="#2980B9"/><rect x="18" y="22" width="12" height="12" rx="2" fill="#E74C3C"/><circle cx="24" cy="12" r="9" fill="#2C3E50"/></g><g transform="translate(48, 48)"><rect x="18" y="34" width="4" height="10" fill="#34495E"/><rect x="26" y="36" width="4" height="10" fill="#34495E"/><rect x="18" y="42" width="4" height="4" rx="1" fill="#17202A"/><rect x="26" y="44" width="4" height="4" rx="1" fill="#17202A"/><rect x="11" y="22" width="4" height="12" rx="2" fill="#E5B38F" transform="rotate(-15, 13, 22)"/><rect x="11" y="22" width="4" height="6" rx="1" fill="#2471A3" transform="rotate(-15, 13, 22)"/><rect x="33" y="22" width="4" height="12" rx="2" fill="#E5B38F" transform="rotate(15, 35, 22)"/><rect x="33" y="22" width="4" height="6" rx="1" fill="#2471A3" transform="rotate(15, 35, 22)"/><rect x="16" y="21" width="16" height="16" rx="2" fill="#2980B9"/><rect x="18" y="23" width="12" height="12" rx="2" fill="#E74C3C"/><circle cx="24" cy="13" r="9" fill="#2C3E50"/></g><g transform="translate(96, 48)"><rect x="18" y="36" width="4" height="10" fill="#34495E"/><rect x="26" y="34" width="4" height="10" fill="#34495E"/><rect x="18" y="44" width="4" height="4" rx="1" fill="#17202A"/><rect x="26" y="42" width="4" height="4" rx="1" fill="#17202A"/><rect x="11" y="22" width="4" height="12" rx="2" fill="#E5B38F" transform="rotate(15, 13, 22)"/><rect x="11" y="22" width="4" height="6" rx="1" fill="#2471A3" transform="rotate(15, 13, 22)"/><rect x="33" y="22" width="4" height="12" rx="2" fill="#E5B38F" transform="rotate(-15, 35, 22)"/><rect x="33" y="22" width="4" height="6" rx="1" fill="#2471A3" transform="rotate(-15, 35, 22)"/><rect x="16" y="21" width="16" height="16" rx="2" fill="#2980B9"/><rect x="18" y="23" width="12" height="12" rx="2" fill="#E74C3C"/><circle cx="24" cy="13" r="9" fill="#2C3E50"/></g><g transform="translate(0, 96)"><rect x="22" y="36" width="4" height="10" fill="#2C3E50"/><rect x="22" y="44" width="6" height="4" rx="1" fill="#111820"/><rect x="22" y="36" width="4" height="10" fill="#34495E"/><rect x="22" y="44" width="6" height="4" rx="1" fill="#17202A"/><rect x="22" y="21" width="4" height="12" rx="2" fill="#E5B38F"/><rect x="18" y="20" width="12" height="16" rx="2" fill="#2980B9"/><rect x="14" y="22" width="6" height="12" rx="2" fill="#E74C3C"/><circle cx="24" cy="12" r="9" fill="#F5CBA7"/><path d="M 17 12 Q 15 2 24 3 Q 31 4 31 9 Q 28 7 24 9 Q 19 12 17 12" fill="#2C3E50"/><rect x="28" y="10" width="2" height="2" fill="#2C3E50"/><rect x="22" y="21" width="4" height="12" rx="2" fill="#F5CBA7"/><rect x="22" y="21" width="4" height="6" rx="1" fill="#2980B9"/></g><g transform="translate(48, 96)"><rect x="18" y="36" width="4" height="10" fill="#2C3E50" transform="rotate(20, 20, 36)"/><rect x="18" y="44" width="6" height="4" rx="1" fill="#111820" transform="rotate(20, 20, 36)"/><rect x="26" y="36" width="4" height="10" fill="#34495E" transform="rotate(-20, 28, 36)"/><rect x="26" y="44" width="6" height="4" rx="1" fill="#17202A" transform="rotate(-20, 28, 36)"/><rect x="22" y="22" width="4" height="12" rx="2" fill="#E5B38F" transform="rotate(-20, 24, 22)"/><rect x="18" y="21" width="12" height="16" rx="2" fill="#2980B9"/><rect x="14" y="23" width="6" height="12" rx="2" fill="#E74C3C"/><circle cx="24" cy="13" r="9" fill="#F5CBA7"/><path d="M 17 13 Q 15 3 24 4 Q 31 5 31 10 Q 28 8 24 10 Q 19 13 17 13" fill="#2C3E50"/><rect x="28" y="11" width="2" height="2" fill="#2C3E50"/><rect x="22" y="22" width="4" height="12" rx="2" fill="#F5CBA7" transform="rotate(20, 24, 22)"/><rect x="22" y="22" width="4" height="6" rx="1" fill="#2980B9" transform="rotate(20, 24, 22)"/></g><g transform="translate(96, 96)"><rect x="26" y="36" width="4" height="10" fill="#2C3E50" transform="rotate(-15, 28, 36)"/><rect x="26" y="44" width="6" height="4" rx="1" fill="#111820" transform="rotate(-15, 28, 36)"/><rect x="18" y="36" width="4" height="10" fill="#34495E" transform="rotate(15, 20, 36)"/><rect x="18" y="44" width="6" height="4" rx="1" fill="#17202A" transform="rotate(15, 20, 36)"/><rect x="22" y="22" width="4" height="12" rx="2" fill="#E5B38F" transform="rotate(20, 24, 22)"/><rect x="18" y="21" width="12" height="16" rx="2" fill="#2980B9"/><rect x="14" y="23" width="6" height="12" rx="2" fill="#E74C3C"/><circle cx="24" cy="13" r="9" fill="#F5CBA7"/><path d="M 17 13 Q 15 3 24 4 Q 31 5 31 10 Q 28 8 24 10 Q 19 13 17 13" fill="#2C3E50"/><rect x="28" y="11" width="2" height="2" fill="#2C3E50"/><rect x="22" y="22" width="4" height="12" rx="2" fill="#F5CBA7" transform="rotate(-20, 24, 22)"/><rect x="22" y="22" width="4" height="6" rx="1" fill="#2980B9" transform="rotate(-20, 24, 22)"/></g></svg>`,
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
  accessPoint: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="12" y="16" width="24" height="16" rx="4" fill="#FDFEFE"/>
    <rect x="12" y="28" width="24" height="4" rx="2" fill="#BDC3C7"/>
    <rect x="16" y="6" width="2" height="12" rx="1" fill="#7F8C8D"/>
    <rect x="30" y="6" width="2" height="12" rx="1" fill="#7F8C8D"/>
    <circle cx="17" cy="6" r="1.5" fill="#E74C3C"/>
    <circle cx="31" cy="6" r="1.5" fill="#E74C3C"/>
    <circle cx="16" cy="24" r="2" fill="#2ECC71"/>
    <circle cx="20" cy="24" r="2" fill="#2ECC71"/>
    <circle cx="24" cy="24" r="2" fill="#2ECC71"/>
    <circle cx="28" cy="24" r="2" fill="#F1C40F"/>
    <circle cx="32" cy="24" r="2" fill="#3498DB"/>
    <rect x="12" y="20" width="24" height="2" fill="#34495E"/>
  </svg>`,
  guest: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <circle cx="24" cy="12" r="9" fill="#F5CBA7"/>
    <rect x="14" y="20" width="20" height="18" rx="2" fill="#E67E22"/>
    <rect x="10" y="38" width="28" height="6" rx="2" fill="#95A5A6"/>
  </svg>`,
  nurseWheelchair: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="24" y="16" width="16" height="16" rx="2" fill="#9B59B6"/>
    <circle cx="32" cy="10" r="7" fill="#F5CBA7"/>
    <circle cx="32" cy="34" r="8" fill="none" stroke="#2C3E50" stroke-width="3"/>
    <circle cx="14" cy="10" r="7" fill="#F5CBA7"/>
    <rect x="8" y="18" width="12" height="18" rx="2" fill="#5DADE2"/>
  </svg>`,
  nurseBed: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="12" y="14" width="32" height="20" rx="2" fill="#AED6F1"/>
    <rect x="12" y="12" width="32" height="4" rx="2" fill="#5DADE2"/>
    <rect x="12" y="12" width="10" height="24" rx="2" fill="#FDFEFE"/>
    <circle cx="16" cy="24" r="5" fill="#F5CBA7"/>
    <rect x="14" y="32" width="4" height="4" rx="1" fill="#7F8C8D"/>
    <rect x="38" y="32" width="4" height="4" rx="1" fill="#7F8C8D"/>
    <circle cx="6" cy="16" r="7" fill="#F5CBA7"/>
    <rect x="2" y="24" width="10" height="16" rx="2" fill="#5DADE2"/>
  </svg>`,
  walkingNurse: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <circle cx="24" cy="12" r="9" fill="#F5CBA7"/>
    <rect x="14" y="20" width="20" height="18" rx="2" fill="#5DADE2"/>
    <rect x="10" y="38" width="28" height="6" rx="2" fill="#2E86C1"/>
    <rect x="21" y="22" width="6" height="1" fill="#FDFEFE"/>
    <rect x="23" y="20" width="2" height="5" fill="#FDFEFE"/>
    <polygon points="16,8 32,8 29,4 19,4" fill="#FDFEFE"/>
  </svg>`,
  security: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <circle cx="24" cy="12" r="9" fill="#F5CBA7"/>
    <rect x="14" y="20" width="20" height="18" rx="2" fill="#1A5276"/>
    <rect x="10" y="38" width="28" height="6" rx="2" fill="#1A3B5C"/>
    <rect x="20" y="20" width="8" height="4" fill="#F1C40F"/>
    <polygon points="24,4 22,8 26,8" fill="#1A5276"/>
    <rect x="18" y="2" width="12" height="4" rx="1" fill="#2980B9"/>
  </svg>`,
  car: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="4" y="12" width="40" height="24" rx="4" fill="#E74C3C"/>
    <rect x="10" y="16" width="28" height="16" rx="2" fill="#2C3E50"/>
    <rect x="14" y="18" width="20" height="12" fill="#34495E"/>
    <rect x="2" y="18" width="4" height="4" fill="#F1C40F"/>
    <rect x="42" y="18" width="4" height="4" fill="#C0392B"/>
  </svg>`,
  motorcycle: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="14" y="10" width="20" height="28" rx="4" fill="#34495E"/>
    <rect x="18" y="14" width="12" height="14" rx="2" fill="#2980B9"/>
    <circle cx="24" cy="34" r="6" fill="#17202A"/>
    <rect x="16" y="8" width="16" height="4" rx="1" fill="#7F8C8D"/>
  </svg>`,
  gate: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="4" y="20" width="40" height="4" fill="#F1C40F"/>
    <rect x="8" y="20" width="4" height="4" fill="#E74C3C"/>
    <rect x="16" y="20" width="4" height="4" fill="#E74C3C"/>
    <rect x="24" y="20" width="4" height="4" fill="#E74C3C"/>
    <rect x="32" y="20" width="4" height="4" fill="#E74C3C"/>
    <rect x="4" y="16" width="6" height="16" rx="1" fill="#7F8C8D"/>
  </svg>`,
  securityPost: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="4" y="4" width="40" height="40" rx="2" fill="#ECF0F1"/>
    <rect x="2" y="2" width="44" height="8" rx="1" fill="#2980B9"/>
    <rect x="8" y="16" width="32" height="16" fill="#34495E"/>
    <rect x="12" y="18" width="24" height="12" fill="#AED6F1"/>
  </svg>`,
  cctvCamera: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="10" y="18" width="20" height="12" rx="2" fill="#2C3E50"/>
    <rect x="30" y="20" width="10" height="8" rx="1" fill="#34495E"/>
    <circle cx="20" cy="24" r="5" fill="#1A252F"/>
    <circle cx="20" cy="24" r="3" fill="#4FC3F7"/>
    <rect x="14" y="10" width="4" height="10" rx="1" fill="#7F8C8D"/>
    <rect x="10" y="8" width="12" height="4" rx="1" fill="#95A5A6"/>
    <circle cx="38" cy="14" r="3" fill="#E74C3C"/>
  </svg>`,
  cctvMonitor: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="2" y="4" width="44" height="32" rx="3" fill="#1A252F"/>
    <rect x="5" y="7" width="38" height="26" fill="#0D1B2A"/>
    <rect x="7" y="9" width="17" height="11" rx="1" fill="#1B4F72"/>
    <rect x="26" y="9" width="17" height="11" rx="1" fill="#1B4F72"/>
    <rect x="7" y="22" width="17" height="9" rx="1" fill="#154360"/>
    <rect x="26" y="22" width="17" height="9" rx="1" fill="#154360"/>
    <circle cx="15" cy="14" r="3" fill="#4FC3F7"/>
    <circle cx="34" cy="14" r="3" fill="#4FC3F7"/>
    <rect x="18" y="36" width="12" height="4" fill="#2C3E50"/>
    <rect x="10" y="40" width="28" height="4" rx="1" fill="#7F8C8D"/>
    <circle cx="5" cy="37" r="2" fill="#2ECC71"/>
  </svg>`,
  serverRack: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="10" y="4" width="28" height="40" rx="2" fill="#2C3E50"/>
    <rect x="14" y="8" width="20" height="6" fill="#34495E"/>
    <rect x="14" y="16" width="20" height="6" fill="#34495E"/>
    <rect x="14" y="24" width="20" height="6" fill="#34495E"/>
    <rect x="14" y="32" width="20" height="6" fill="#34495E"/>
    <circle cx="18" cy="11" r="1.5" fill="#2ECC71"/>
    <circle cx="18" cy="19" r="1.5" fill="#2ECC71"/>
    <circle cx="18" cy="27" r="1.5" fill="#2ECC71"/>
    <circle cx="18" cy="35" r="1.5" fill="#2ECC71"/>
  </svg>`,
  ups: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="8" y="14" width="32" height="26" rx="3" fill="#1C2833"/>
    <rect x="14" y="18" width="20" height="10" rx="1" fill="#7F8C8D"/>
    <rect x="16" y="20" width="16" height="6" fill="#95A5A6"/>
    <circle cx="14" cy="34" r="2" fill="#2ECC71"/>
    <circle cx="20" cy="34" r="2" fill="#E74C3C"/>
  </svg>`,
  firewall: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="6" y="20" width="36" height="12" rx="1" fill="#C0392B"/>
    <rect x="8" y="22" width="4" height="8" fill="#FDFEFE"/>
    <rect x="14" y="22" width="20" height="8" fill="#E74C3C"/>
    <circle cx="38" cy="26" r="2" fill="#2ECC71"/>
    <circle cx="10" cy="26" r="1" fill="#2ECC71"/>
  </svg>`,
  switchCore: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="4" y="16" width="40" height="16" rx="2" fill="#2980B9"/>
    <rect x="8" y="20" width="32" height="8" fill="#1F618D"/>
    <rect x="10" y="22" width="2" height="4" fill="#F1C40F"/>
    <rect x="14" y="22" width="2" height="4" fill="#F1C40F"/>
    <rect x="18" y="22" width="2" height="4" fill="#F1C40F"/>
    <rect x="22" y="22" width="2" height="4" fill="#F1C40F"/>
    <rect x="26" y="22" width="2" height="4" fill="#F1C40F"/>
    <rect x="30" y="22" width="2" height="4" fill="#F1C40F"/>
    <rect x="34" y="22" width="2" height="4" fill="#F1C40F"/>
  </svg>`,
  switchAccess: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="6" y="20" width="36" height="10" rx="1" fill="#7F8C8D"/>
    <rect x="10" y="23" width="28" height="4" fill="#5D6D7E"/>
    <circle cx="12" cy="25" r="1" fill="#2ECC71"/>
    <circle cx="16" cy="25" r="1" fill="#2ECC71"/>
    <circle cx="20" cy="25" r="1" fill="#2ECC71"/>
  </svg>`,
  ac: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="8" y="6" width="32" height="12" rx="2" fill="#ECF0F1"/>
    <rect x="12" y="10" width="24" height="2" fill="#BDC3C7"/>
    <rect x="12" y="14" width="24" height="2" fill="#BDC3C7"/>
    <circle cx="36" cy="12" r="1.5" fill="#2ECC71"/>
    <polygon points="16,20 32,20 28,26 20,26" fill="#85C1E9" opacity="0.5"/>
  </svg>`,
  accessDoor: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="12" y="8" width="24" height="40" fill="#95A5A6"/>
    <rect x="14" y="10" width="20" height="38" fill="#7F8C8D"/>
    <rect x="30" y="24" width="6" height="8" rx="1" fill="#2C3E50"/>
    <circle cx="32" cy="26" r="0.5" fill="#ECF0F1"/>
    <circle cx="34" cy="26" r="0.5" fill="#ECF0F1"/>
    <circle cx="32" cy="28" r="0.5" fill="#ECF0F1"/>
    <circle cx="34" cy="28" r="0.5" fill="#ECF0F1"/>
    <rect x="30" y="20" width="6" height="2" fill="#E74C3C"/>
  </svg>`,
  modemSenang: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="14" y="16" width="20" height="24" rx="2" fill="#F1C40F"/>
    <rect x="16" y="8" width="2" height="8" fill="#F1C40F"/>
    <rect x="30" y="8" width="2" height="8" fill="#F1C40F"/>
    <rect x="18" y="22" width="12" height="4" fill="#2C3E50"/>
    <circle cx="24" cy="32" r="3" fill="#2ECC71"/>
  </svg>`,
  modemCepat: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="14" y="16" width="20" height="24" rx="2" fill="#E74C3C"/>
    <rect x="16" y="8" width="2" height="8" fill="#E74C3C"/>
    <rect x="30" y="8" width="2" height="8" fill="#E74C3C"/>
    <rect x="18" y="22" width="12" height="4" fill="#2C3E50"/>
    <circle cx="24" cy="32" r="3" fill="#3498DB"/>
  </svg>`,
  modemGatotkaca: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
    <rect x="14" y="16" width="20" height="24" rx="2" fill="#9B59B6"/>
    <rect x="16" y="8" width="2" height="8" fill="#9B59B6"/>
    <rect x="30" y="8" width="2" height="8" fill="#9B59B6"/>
    <rect x="18" y="22" width="12" height="4" fill="#2C3E50"/>
    <circle cx="24" cy="32" r="3" fill="#F1C40F"/>
  </svg>`,
  hospitalTiles: `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="48">
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#e8f0f8" stroke="#d6e4f0" stroke-width="2"/>
    </g>
    <g transform="translate(48, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#000000"/>
      <rect x="4" y="4" width="40" height="40" fill="#42a5f5" stroke="#64b5f6" stroke-width="4"/>
    </g>
    <g transform="translate(96, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#000000"/>
      <rect x="2" y="2" width="44" height="44" fill="#a1887f" stroke="#6d4c41" stroke-width="2"/>
    </g>
    <g transform="translate(144, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#000000"/>
      <rect x="4" y="2" width="40" height="44" fill="#eceff1" stroke="#b0bec5" stroke-width="2"/>
    </g>
    <g transform="translate(192, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#66bb6a"/>
    </g>
    <g transform="translate(240, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#bbdefb" stroke="#d6e4f0" stroke-width="2"/>
    </g>
    <g transform="translate(288, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#9e9e9e" stroke="#d6e4f0" stroke-width="2"/>
    </g>
    <g transform="translate(336, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#34495e"/>
    </g>
    <g transform="translate(384, 0)">
      <rect x="0" y="0" width="48" height="48" fill="#7f8c8d"/>
    </g>
  </svg>`,
};

export type SpriteKey = keyof typeof SVG_DEFS;

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
