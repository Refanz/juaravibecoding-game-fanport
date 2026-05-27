import playerSvg from "./characters/player.svg?raw";
import doctorSvg from "./characters/doctor.svg?raw";
import nurseSvg from "./characters/nurse.svg?raw";
import guestSvg from "./characters/guest.svg?raw";
import nurseWheelchairSvg from "./characters/nurseWheelchair.svg?raw";
import nurseBedSvg from "./characters/nurseBed.svg?raw";
import walkingNurseSvg from "./characters/walkingNurse.svg?raw";
import securitySvg from "./characters/security.svg?raw";
import pcBrokenSvg from "./it_objects/pcBroken.svg?raw";
import medBrokenSvg from "./it_objects/medBroken.svg?raw";
import accessPointSvg from "./it_objects/accessPoint.svg?raw";
import cctvCameraSvg from "./it_objects/cctvCamera.svg?raw";
import cctvMonitorSvg from "./it_objects/cctvMonitor.svg?raw";
import serverRackSvg from "./it_objects/serverRack.svg?raw";
import upsSvg from "./it_objects/ups.svg?raw";
import firewallSvg from "./it_objects/firewall.svg?raw";
import switchCoreSvg from "./it_objects/switchCore.svg?raw";
import switchAccessSvg from "./it_objects/switchAccess.svg?raw";
import modemSenangSvg from "./it_objects/modemSenang.svg?raw";
import modemCepatSvg from "./it_objects/modemCepat.svg?raw";
import modemGatotkacaSvg from "./it_objects/modemGatotkaca.svg?raw";
import elevatorSvg from "./decor/elevator.svg?raw";
import bedSvg from "./decor/bed.svg?raw";
import medicineSvg from "./decor/medicine.svg?raw";
import radiationSvg from "./decor/radiation.svg?raw";
import carSvg from "./decor/car.svg?raw";
import motorcycleSvg from "./decor/motorcycle.svg?raw";
import gateSvg from "./decor/gate.svg?raw";
import securityPostSvg from "./decor/securityPost.svg?raw";
import acSvg from "./decor/ac.svg?raw";
import accessDoorSvg from "./decor/accessDoor.svg?raw";

// Individual tiles
import floorTile from "./tiles/floor.svg?raw";
import floorBlueTile from "./tiles/floorBlue.svg?raw";
import wallTile from "./tiles/wall.svg?raw";
import deskTile from "./tiles/desk.svg?raw";
import grassTile from "./tiles/grass.svg?raw";
import windowTile from "./tiles/window.svg?raw";
import grayFloorTile from "./tiles/grayFloor.svg?raw";
import roadTile from "./tiles/road.svg?raw";
import parkingTile from "./tiles/parking.svg?raw";
import wallVerticalTile from "./tiles/wallVertical.svg?raw";
import wallCornerTopLeftTile from "./tiles/wallCornerTopLeft.svg?raw";
import wallCornerTopRightTile from "./tiles/wallCornerTopRight.svg?raw";
import wallCornerBottomLeftTile from "./tiles/wallCornerBottomLeft.svg?raw";
import wallCornerBottomRightTile from "./tiles/wallCornerBottomRight.svg?raw";
import wallTjunctionDownTile from "./tiles/wallTjunctionDown.svg?raw";
import wallTjunctionUpTile from "./tiles/wallTjunctionUp.svg?raw";
import wallTjunctionRightTile from "./tiles/wallTjunctionRight.svg?raw";
import wallTjunctionLeftTile from "./tiles/wallTjunctionLeft.svg?raw";
import wallCrossTile from "./tiles/wallCross.svg?raw";
import glassDoorTile from "./tiles/glassDoor.svg?raw";
import glassDoorVerticalTile from "./tiles/glassDoorVertical.svg?raw";
import windowVerticalTile from "./tiles/windowVertical.svg?raw";

const tileList = [
  floorTile,
  floorBlueTile,
  wallTile,
  deskTile,
  grassTile,
  windowTile,
  grayFloorTile,
  roadTile,
  parkingTile,
  wallVerticalTile,
  wallCornerTopLeftTile,
  wallCornerTopRightTile,
  wallCornerBottomLeftTile,
  wallCornerBottomRightTile,
  wallTjunctionDownTile,
  wallTjunctionUpTile,
  wallTjunctionRightTile,
  wallTjunctionLeftTile,
  wallCrossTile,
  glassDoorTile,
  glassDoorVerticalTile,
  windowVerticalTile,
];

function stitchTiles(tiles: string[]): string {
  let inner = "";
  tiles.forEach((tile, i) => {
    // Remove <svg> and </svg> wrappers
    const content = tile.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "").trim();
    inner += `\n  <g transform="translate(${i * 48}, 0)">\n    ${content}\n  </g>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tiles.length * 48}" height="48">${inner}\n</svg>`;
}

const hospitalTilesSvg = stitchTiles(tileList);

export const SVG_DEFS: Record<string, string> = {
  player: playerSvg,
  doctor: doctorSvg,
  nurse: nurseSvg,
  guest: guestSvg,
  nurseWheelchair: nurseWheelchairSvg,
  nurseBed: nurseBedSvg,
  walkingNurse: walkingNurseSvg,
  security: securitySvg,
  pcBroken: pcBrokenSvg,
  medBroken: medBrokenSvg,
  accessPoint: accessPointSvg,
  cctvCamera: cctvCameraSvg,
  cctvMonitor: cctvMonitorSvg,
  serverRack: serverRackSvg,
  ups: upsSvg,
  firewall: firewallSvg,
  switchCore: switchCoreSvg,
  switchAccess: switchAccessSvg,
  modemSenang: modemSenangSvg,
  modemCepat: modemCepatSvg,
  modemGatotkaca: modemGatotkacaSvg,
  elevator: elevatorSvg,
  bed: bedSvg,
  medicine: medicineSvg,
  radiation: radiationSvg,
  car: carSvg,
  motorcycle: motorcycleSvg,
  gate: gateSvg,
  securityPost: securityPostSvg,
  ac: acSvg,
  accessDoor: accessDoorSvg,
  hospitalTiles: hospitalTilesSvg,
};

export type SpriteKey = keyof typeof SVG_DEFS;
