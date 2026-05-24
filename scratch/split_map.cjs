const fs = require('fs');

const areasF2 = {
  RUANG_OPERASI: { x: 1, y: 1, w: 10, h: 5 },
  RADIOLOGI: { x: 12, y: 1, w: 15, h: 5 },
  HEMODIALISA: { x: 1, y: 7, w: 10, h: 6 },
  VIP: { x: 12, y: 7, w: 15, h: 6 }
};

console.log("export const FLOOR2_AREA_BOUNDS: AreaBounds[] = [");
for(let [k, v] of Object.entries(areasF2)) {
  console.log(`  { id: '${k.toLowerCase()}', startX: ${v.x}, startY: ${v.y}, endX: ${v.x + v.w - 1}, endY: ${v.y + v.h - 1} },`);
}
console.log("];");
