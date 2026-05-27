import Phaser from "phaser";
import {
  getAllSpriteUris,
  decorSpriteKey,
  npcSpriteKey,
} from "../../infrastructure/assets/AssetManager";
import { FloorManager } from "../FloorManager";
import { GameState } from "../GameState";
import { AudioManager } from "../../infrastructure/assets/AudioManager";
import { EventBus } from "../../infrastructure/events/EventBus";
import {
  ELEVATOR_POS,
  SOLID_TILES,
  floor1Url,
  floor2Url,
  floor3Url,
} from "../../infrastructure/data/maps";
import {
  AreaBounds,
  FLOOR1_AREA_BOUNDS,
  FLOOR2_AREA_BOUNDS,
  FLOOR3_AREA_BOUNDS,
} from "../../infrastructure/data/floorData";
import { Player } from "../entities/Player";
import { TimeManager } from "./TimeManager";

const TILE = 48;
const TILE_COLORS: Record<number, number> = {
  0: 0xe8f0f8,
  1: 0x90caf9,
  2: 0x8d6e63,
  3: 0xcfd8dc,
  4: 0x66bb6a,
  5: 0xbbdefb,
  6: 0x9e9e9e,
  7: 0x34495e,
  8: 0x7f8c8d, // 7: Road, 8: Parking
};

export class GameScene extends Phaser.Scene {
  player!: Player;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys!: any;
  virtualInput: { up: boolean; down: boolean; left: boolean; right: boolean } =
    { up: false, down: false, left: false, right: false };

  floorManager!: FloorManager;
  gameState!: GameState;
  currentTilemap!: Phaser.Tilemaps.Tilemap;
  groundLayer!: Phaser.Tilemaps.TilemapLayer;

  objectsGroup!: Phaser.GameObjects.Group;
  wallsGroup!: Phaser.Physics.Arcade.StaticGroup;
  decorationsGroup!: Phaser.GameObjects.Group;
  npcsGroup!: Phaser.GameObjects.Group;
  private cctvCapturing = false;
  private lastPosEmitTime = 0;
  private activeMarker: Phaser.GameObjects.Text | null = null;
  private activeMarkerTween: Phaser.Tweens.Tween | null = null;
  private defaultZoom = 1.5;
  private timeManager!: TimeManager;
  private pagiOverlay!: Phaser.GameObjects.Rectangle;
  private soreOverlay!: Phaser.GameObjects.Rectangle;
  private malamOverlay!: Phaser.GameObjects.Rectangle;

  constructor() {
    super("GameScene");
  }

  init(data: { floorManager: FloorManager; gameState: GameState }) {
    this.floorManager = data.floorManager;
    this.gameState = data.gameState;
  }

  preload() {
    const uris = getAllSpriteUris();
    for (const [key, uri] of Object.entries(uris)) {
      if (key === "player") {
        this.load.spritesheet(key, uri, { frameWidth: 48, frameHeight: 48 });
      } else {
        this.load.image(key, uri);
      }
    }

    // Load maps
    this.load.tilemapTiledJSON("floor1", floor1Url);
    this.load.tilemapTiledJSON("floor2", floor2Url);
    this.load.tilemapTiledJSON("floor3", floor3Url);
  }

  create() {
    try {
      // Reset groups
      this.objectsGroup = this.add.group();
      this.wallsGroup = this.physics.add.staticGroup();
      this.decorationsGroup = this.add.group();
      this.npcsGroup = this.add.group();

      this.renderMap();
      this.renderDecorations();
      this.renderElevator();
      this.renderNPCs();
      this.renderObjects();

      // Player
      let px = 13 * TILE + TILE / 2;
      let py = 3 * TILE + TILE / 2;

      if (this.gameState.teleportTargetIndex !== null) {
        const obj =
          this.floorManager.allObjects[this.gameState.teleportTargetIndex];
        if (obj && obj.floor === this.floorManager.currentFloor) {
          px = obj.x * TILE + TILE / 2;
          py = obj.y * TILE + TILE / 2;
        }
        this.gameState.teleportTargetIndex = null;
      } else if (this.floorManager.currentFloor === 2) {
        px = ELEVATOR_POS.x * TILE - TILE / 2;
        py = ELEVATOR_POS.y * TILE + TILE / 2;
      }
      this.player = new Player(this, px, py);

      // Collision
      this.physics.add.collider(this.player, this.wallsGroup);
      this.physics.add.collider(this.player, this.groundLayer);

      // Camera
      const mapW = this.currentTilemap.widthInPixels;
      const mapH = this.currentTilemap.heightInPixels;
      this.physics.world.setBounds(0, 0, mapW, mapH);
      this.cameras.main.setBounds(0, 0, mapW, mapH);
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setBackgroundColor("#e0e8f0");
      this.defaultZoom = this.scale.width < 768 ? 1.1 : 1.5;
      this.cameras.main.setZoom(this.defaultZoom);

      // Overlays untuk Day/Night Cycle (ukurannya selebar map)
      this.pagiOverlay = this.add.rectangle(0, 0, mapW, mapH, 0xffaa00, 0).setOrigin(0).setScrollFactor(1).setDepth(99997);
      this.soreOverlay = this.add.rectangle(0, 0, mapW, mapH, 0xff5500, 0).setOrigin(0).setScrollFactor(1).setDepth(99998);
      this.malamOverlay = this.add.rectangle(0, 0, mapW, mapH, 0x000033, 0).setOrigin(0).setScrollFactor(1).setDepth(99999);

      // Controls
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE");
      }

      // Events
      EventBus.on("quiz_closed", this.onQuizClosed, this);
      EventBus.on("request_cctv_capture", this.startCCTVCapture, this);
      EventBus.on("virtual_pad_move", this.onVirtualMove, this);
      EventBus.on("virtual_pad_interact", this.onVirtualInteract, this);
      EventBus.on("pan_to_object", this.panToObject, this);
      EventBus.on("do_change_floor", this.doChangeFloor, this);
      EventBus.on("game_paused", this.onGamePaused, this);
      EventBus.on("time_updated", this.onTimeUpdated, this);

      this.timeManager = new TimeManager(this);

      this.events.on("shutdown", () => {
        EventBus.off("quiz_closed", this.onQuizClosed, this);
        EventBus.off("request_cctv_capture", this.startCCTVCapture, this);
        EventBus.off("virtual_pad_move", this.onVirtualMove, this);
        EventBus.off("virtual_pad_interact", this.onVirtualInteract, this);
        EventBus.off("pan_to_object", this.panToObject, this);
        EventBus.off("do_change_floor", this.doChangeFloor, this);
        EventBus.off("game_paused", this.onGamePaused, this);
        EventBus.off("time_updated", this.onTimeUpdated, this);
        this.timeManager.destroy();
      });

      this.updateMarker();
    } catch (e: any) {
      this.add
        .text(10, 10, "ERROR: " + e.message + "\n" + e.stack, {
          color: "#ff0000",
          fontSize: "12px",
        })
        .setDepth(1000);
      console.error(e);
    }
  }

  onTimeUpdated({ period }: { period: string }) {
    if (!this.cameras || !this.cameras.main) return;
    
    let targetPagi = 0;
    let targetSore = 0;
    let targetMalam = 0;
    let bgColor = "#e0e8f0"; // default

    if (period === 'pagi') {
      targetPagi = 0.1;
      bgColor = "#e0e8f0";
    } else if (period === 'siang') {
      bgColor = "#87ceeb";
    } else if (period === 'sore') {
      targetSore = 0.2;
      bgColor = "#ffdab9";
    } else if (period === 'malam') {
      targetMalam = 0.45;
      bgColor = "#0a1828";
    }

    this.cameras.main.setBackgroundColor(bgColor);

    // Smooth transition
    this.tweens.add({
      targets: this.pagiOverlay,
      alpha: targetPagi,
      duration: 1000
    });
    this.tweens.add({
      targets: this.soreOverlay,
      alpha: targetSore,
      duration: 1000
    });
    this.tweens.add({
      targets: this.malamOverlay,
      alpha: targetMalam,
      duration: 1000
    });
  }

  onGamePaused(isPaused: boolean) {
    if (isPaused) {
      this.scene.pause();
    } else {
      this.scene.resume();
    }
  }

  onQuizClosed(solved: boolean) {
    if (solved && this.gameState.quizObjectIndex !== null) {
      this.floorManager.allObjects[this.gameState.quizObjectIndex].solve();
      // Re-render to update object visually (stop blink/red)
      this.scene.restart({
        floorManager: this.floorManager,
        gameState: this.gameState,
      });

      if (this.floorManager.allSolved) {
        EventBus.emit("game_won");
      }
    }
    this.gameState.quizActive = false;
    this.gameState.quizObjectIndex = null;

    // Reset virtual input on quiz close to avoid sticking
    this.virtualInput = { up: false, down: false, left: false, right: false };
  }

  onVirtualMove({
    dir,
    isDown,
  }: {
    dir: "up" | "down" | "left" | "right";
    isDown: boolean;
  }) {
    this.virtualInput[dir] = isDown;
  }

  onVirtualInteract() {
    this.handleInteraction();
  }

  panToObject(idx: number) {
    const obj = this.floorManager.allObjects[idx];
    if (!obj) return;

    this.updateMarker();

    if (this.floorManager.currentFloor !== obj.floor) {
      // Show notification if object is on a different floor
      const text = this.add
        .text(
          this.cameras.main.worldView.centerX,
          this.cameras.main.worldView.centerY - 50,
          `Lokasi masalah ada di Lantai ${obj.floor}. Silakan gunakan Lift!`,
          {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "8px",
            color: "#ffffff",
            backgroundColor: "#e74c3c",
            padding: { x: 8, y: 8 },
          },
        )
        .setOrigin(0.5)
        .setDepth(200);

      this.time.delayedCall(3000, () => text.destroy());
    } else {
      // Pan camera to object on same floor
      this.cameras.main.stopFollow();
      const objX = obj.x * TILE + TILE / 2;
      const objY = obj.y * TILE + TILE / 2;

      this.cameras.main.pan(objX, objY, 1000, "Sine.easeInOut");

      this.time.delayedCall(3000, () => {
        this.cameras.main.pan(
          this.player.x,
          this.player.y,
          800,
          "Sine.easeInOut",
          false,
          (camera: any, progress: number) => {
            if (progress === 1) {
              this.cameras.main.startFollow(this.player);
            }
          },
        );
      });
    }
  }

  updateMarker() {
    if (this.activeMarker) {
      this.activeMarker.destroy();
      this.activeMarker = null;
    }
    if (this.activeMarkerTween) {
      this.activeMarkerTween.stop();
      this.activeMarkerTween = null;
    }

    const idx = this.gameState.activeMarkerIndex;
    if (idx !== null) {
      const obj = this.floorManager.allObjects[idx];
      if (obj && obj.floor === this.floorManager.currentFloor && !obj.solved) {
        const objX = obj.x * TILE + TILE / 2;
        const objY = obj.y * TILE + TILE / 2;

        this.activeMarker = this.add
          .text(objX, objY - 40, "🔽", {
            fontSize: "16px",
          })
          .setOrigin(0.5)
          .setDepth(100);

        this.activeMarkerTween = this.tweens.add({
          targets: this.activeMarker,
          y: objY - 30,
          yoyo: true,
          repeat: -1,
          duration: 400,
        });
      }
    }
  }

  renderMap() {
    this.currentTilemap = this.make.tilemap({
      key: `floor${this.floorManager.currentFloor}`,
    });
    const tileset = this.currentTilemap.addTilesetImage(
      "hospitalTiles",
      "hospitalTiles",
    );
    this.groundLayer = this.currentTilemap.createLayer(
      "ground",
      tileset as any,
      0,
      0,
    ) as Phaser.Tilemaps.TilemapLayer;
    this.groundLayer.setDepth(0);

    // Set collision by array of solid tile IDs (2=wall, 3=wall, 4=desk, 6=window, 10-19=new walls)
    // Doors (20, 21) are excluded so they can be passed through.
    this.groundLayer.setCollision([2, 3, 4, 6, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    // Room labels
    for (const lbl of this.floorManager.labels) {
      const text = this.add
        .text(lbl.x * TILE + TILE / 2, lbl.y * TILE + TILE / 2, lbl.text, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "7px",
          color: "#2196f3",
        })
        .setOrigin(0.5)
        .setDepth(2);
    }
  }

  renderDecorations() {
    for (const dec of this.floorManager.decorations) {
      const key = decorSpriteKey(dec.type as any);
      const x = dec.x * TILE + TILE / 2;
      const y = dec.y * TILE + TILE / 2;

      if (dec.type === "cctvCamera") {
        // CCTV Camera: ceiling-mounted, high Z, 70% opacity
        const spr = this.add.image(x, y, key);
        spr.setDepth(9990);
        spr.setAlpha(0.7);
        // Blink the red LED indicator
        const led = this.add.circle(x + 14, y - 10, 3, 0xe74c3c);
        led.setDepth(9991);
        this.tweens.add({
          targets: led,
          alpha: 0,
          yoyo: true,
          repeat: -1,
          duration: 800 + Math.random() * 400,
        });
      } else if (dec.type === "cctvMonitor") {
        // CCTV Monitor: large screen with pulsing blue glow
        const glow = this.add.rectangle(
          x,
          y,
          TILE + 10,
          TILE + 10,
          0x4fc3f7,
          0.25,
        );
        glow.setDepth(2);
        this.tweens.add({
          targets: glow,
          alpha: 0.05,
          yoyo: true,
          repeat: -1,
          duration: 1200,
        });
        const spr = this.add.image(x, y, key);
        spr.setDepth(3);
        // Label
        this.add
          .text(x, y - 30, "Monitor CCTV", {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "5px",
            color: "#4fc3f7",
          })
          .setOrigin(0.5)
          .setDepth(5);
      } else if (dec.type === "accessPoint") {
        // Access Point Rule: rendered on ceiling, highest Z-index, 60% opacity
        const spr = this.add.image(x, y, key);
        spr.setDepth(10000);
        spr.setAlpha(0.6);
      } else {
        const spr = this.wallsGroup.create(
          x,
          y,
          key,
        ) as Phaser.Physics.Arcade.Sprite;
        spr.body?.setSize(TILE, TILE / 2);
        spr.body?.setOffset(0, TILE / 2);
      }
    }
  }

  renderElevator() {
    const ex = ELEVATOR_POS.x * TILE + TILE / 2;
    const ey = ELEVATOR_POS.y * TILE + TILE / 2;
    const elev = this.wallsGroup.create(
      ex,
      ey,
      "elevator",
    ) as Phaser.Physics.Arcade.Sprite;
    elev.body?.setSize(TILE, TILE / 2);
    elev.body?.setOffset(0, TILE / 2);
  }

  renderNPCs() {
    for (const npc of this.floorManager.npcs) {
      const x = npc.x * TILE + TILE / 2;
      const y = npc.y * TILE + TILE / 2;
      const spr = this.npcsGroup.create(
        x,
        y,
        npc.spriteKey,
      ) as Phaser.GameObjects.Sprite;

      const labelText = this.add
        .text(x, y - 24, npc.label, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "6px",
          color: "#1565c0",
        })
        .setOrigin(0.5)
        .setDepth(5);

      if (
        ["guest", "nurseWheelchair", "nurseBed", "walkingNurse"].includes(
          npc.role,
        )
      ) {
        const distance =
          (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 150);
        this.tweens.add({
          targets: [spr, labelText],
          x: x + distance,
          yoyo: true,
          repeat: -1,
          duration: 3000 + Math.random() * 2000,
          onYoyo: () => {
            spr.setFlipX(distance > 0);
          },
          onRepeat: () => {
            spr.setFlipX(distance < 0);
          },
        });
      } else if (npc.role === "security") {
        // Security: short patrol near post
        const d = (Math.random() > 0.5 ? 1 : -1) * 40;
        this.tweens.add({
          targets: [spr, labelText],
          x: x + d,
          yoyo: true,
          repeat: -1,
          duration: 2000,
          onYoyo: () => {
            spr.setFlipX(d > 0);
          },
          onRepeat: () => {
            spr.setFlipX(d < 0);
          },
        });
      } else {
        // Bob animation for stationary NPCs
        this.tweens.add({
          targets: spr,
          y: y - 3,
          yoyo: true,
          repeat: -1,
          duration: 800 + Math.random() * 400,
        });
      }
    }
  }

  renderObjects() {
    for (const obj of this.floorManager.floorObjects) {
      const x = obj.x * TILE + TILE / 2;
      const y = obj.y * TILE + TILE / 2;

      if (!obj.solved) {
        // Glow effect for broken objects
        const glow = this.add.rectangle(
          x,
          y,
          TILE + 8,
          TILE + 8,
          0xff3232,
          0.3,
        );
        glow.setDepth(1);
        this.tweens.add({
          targets: glow,
          alpha: 0.1,
          yoyo: true,
          repeat: -1,
          duration: 500,
        });

        this.add
          .text(x, y - 24, obj.label, {
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "6px",
            color: "#ff5252",
          })
          .setOrigin(0.5)
          .setDepth(5);
      }

      const spr = this.wallsGroup.create(
        x,
        y,
        obj.spriteKey,
      ) as Phaser.Physics.Arcade.Sprite;
      spr.body?.setSize(TILE, TILE / 2);
      spr.body?.setOffset(0, TILE / 2);
    }
  }

  update(time: number, delta: number) {
    if (this.cctvCapturing || !this.player || !this.player.active) return;

    if (
      this.gameState.screen !== "playing" ||
      this.gameState.quizActive ||
      this.gameState.isPaused
    ) {
      this.player.setVelocity(0);
      return;
    }

    const speed = this.player.speed;
    let vx = 0;
    let vy = 0;

    if (
      this.cursors.left.isDown ||
      this.keys.A.isDown ||
      this.virtualInput.left
    )
      vx = -speed;
    else if (
      this.cursors.right.isDown ||
      this.keys.D.isDown ||
      this.virtualInput.right
    )
      vx = speed;

    if (this.cursors.up.isDown || this.keys.W.isDown || this.virtualInput.up)
      vy = -speed;
    else if (
      this.cursors.down.isDown ||
      this.keys.S.isDown ||
      this.virtualInput.down
    )
      vy = speed;

    this.player.updateMovement(vx, vy);

    // Y-Sorting (Depth Sorting) untuk efek 2.5D
    this.player.setDepth(this.player.y + this.player.height / 2);
    this.npcsGroup.getChildren().forEach((child: any) => {
      child.setDepth(child.y + child.height / 2);
    });
    this.wallsGroup.getChildren().forEach((child: any) => {
      child.setDepth(child.y + child.height / 2);
    });

    if (time > this.lastPosEmitTime + 100) {
      this.lastPosEmitTime = time;
      EventBus.emit("player_position", {
        x: this.player.x,
        y: this.player.y,
        floor: this.floorManager.currentFloor,
      });
    }

    // Interaction checks
    this.checkInteractions();
  }

  checkInteractions() {
    const px = this.player.x;
    const py = this.player.y;

    // Check nearest broken object
    const nearObj = this.floorManager.nearestObject(px, py);
    const nearIdx = nearObj
      ? this.floorManager.allObjects.indexOf(nearObj)
      : null;

    if (this.gameState.nearObjectIndex !== nearIdx) {
      this.gameState.nearObjectIndex = nearIdx;
      EventBus.emit("near_object", nearIdx);
    }

    // Check elevator
    const nearElevator = this.floorManager.isNearElevator(px, py);
    if (this.gameState.nearElevator !== nearElevator) {
      this.gameState.nearElevator = nearElevator;
      EventBus.emit("near_elevator", nearElevator);
    }

    // Check CCTV monitor (only Floor 1)
    const nearCCTV = this.floorManager.isNearCCTVMonitor(px, py);
    if (this.gameState.nearCCTV !== nearCCTV) {
      this.gameState.nearCCTV = nearCCTV;
      EventBus.emit("near_cctv", nearCCTV);
    }

    // Space interaction
    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
      this.handleInteraction();
    }
  }

  handleInteraction() {
    const nearObj = this.floorManager.nearestObject(
      this.player.x,
      this.player.y,
    );
    const nearIdx = nearObj
      ? this.floorManager.allObjects.indexOf(nearObj)
      : null;
    const nearCCTV = this.floorManager.isNearCCTVMonitor(
      this.player.x,
      this.player.y,
    );
    const nearElevator = this.floorManager.isNearElevator(
      this.player.x,
      this.player.y,
    );

    if (nearObj) {
      AudioManager.interact();

      // Clear marker if interacting with the marked object
      if (this.gameState.activeMarkerIndex === nearIdx) {
        this.gameState.activeMarkerIndex = null;
        this.updateMarker();
      }

      this.gameState.quizActive = true;
      this.gameState.quizObjectIndex = nearIdx;
      EventBus.emit("open_quiz", nearIdx);
    } else if (nearCCTV) {
      AudioManager.interact();
      EventBus.emit("open_cctv");
    } else if (nearElevator) {
      AudioManager.elevator();
      EventBus.emit("open_elevator_ui");
    }
  }

  doChangeFloor(targetFloor: 1 | 2 | 3) {
    this.floorManager.loadFloor(targetFloor);
    EventBus.emit("floor_changed", targetFloor);
    this.scene.restart({
      floorManager: this.floorManager,
      gameState: this.gameState,
    });
  }

  // ── CCTV Capture ────────────────────────────────────────────

  private clearWorld() {
    this.tweens.killAll();
    const children = [...this.children.getAll()];
    for (const c of children) {
      c.destroy();
    }
    this.wallsGroup = this.physics.add.staticGroup();
    this.objectsGroup = this.add.group();
    this.decorationsGroup = this.add.group();
    this.npcsGroup = this.add.group();
  }

  private rebuildFloor(floor: 1 | 2 | 3) {
    this.floorManager.loadFloor(floor);
    this.renderMap();
    this.renderDecorations();
    this.renderElevator();
    this.renderNPCs();
    this.renderObjects();
    const mapW = this.currentTilemap.widthInPixels;
    const mapH = this.currentTilemap.heightInPixels;
    this.physics.world.setBounds(0, 0, mapW, mapH);
    this.cameras.main.setBounds(0, 0, mapW, mapH);
  }

  startCCTVCapture() {
    if (this.cctvCapturing) return;
    this.cctvCapturing = true;

    const savedScrollX = this.cameras.main.scrollX;
    const savedScrollY = this.cameras.main.scrollY;
    const savedX = this.player.x;
    const savedY = this.player.y;
    const originalFloor = this.floorManager.currentFloor;

    this.cameras.main.stopFollow();
    this.player.setVisible(false);

    const results: { id: string; src: string }[] = [];

    const captureFloor = (
      floor: 1 | 2 | 3,
      cams: any[],
      onComplete: () => void,
    ) => {
      if (this.floorManager.currentFloor !== floor) {
        this.clearWorld();
        this.rebuildFloor(floor);
      }
      this.captureStep(cams, 0, results, onComplete);
    };

    // Phase 1: Capture Floor 1
    captureFloor(1, FLOOR1_AREA_BOUNDS, () => {
      // Phase 2: Capture Floor 2
      captureFloor(2, FLOOR2_AREA_BOUNDS, () => {
        // Phase 3: Capture Floor 3
        captureFloor(3, FLOOR3_AREA_BOUNDS, () => {
          // Restore Original State
          if (this.floorManager.currentFloor !== originalFloor) {
            this.clearWorld();
            this.rebuildFloor(originalFloor);
          }

          // Recreate player
          this.player = new Player(this, savedX, savedY);
          this.physics.add.collider(this.player, this.wallsGroup);
          this.physics.add.collider(this.player, this.groundLayer);

          this.cameras.main.setScroll(savedScrollX, savedScrollY);
          this.cameras.main.startFollow(this.player);
          this.cctvCapturing = false;
          EventBus.emit("cctv_frames", results);
        });
      });
    });
  }

  private captureStep(
    positions: AreaBounds[],
    index: number,
    results: { id: string; src: string }[],
    onComplete: () => void,
  ) {
    if (index >= positions.length) {
      this.cameras.main.setZoom(this.defaultZoom);
      onComplete();
      return;
    }

    const pos = positions[index];
    const startX = pos.startX * TILE;
    const startY = pos.startY * TILE;
    const endX = (pos.endX + 1) * TILE;
    const endY = (pos.endY + 1) * TILE;

    const width = endX - startX;
    const height = endY - startY;
    const centerX = startX + width / 2;
    const centerY = startY + height / 2;

    const cam = this.cameras.main;
    const zoomX = cam.width / width;
    const zoomY = cam.height / height;

    // Set zoom to fit the area bounds exactly and center the camera
    cam.setZoom(Math.min(zoomX, zoomY));
    cam.centerOn(centerX, centerY);

    // Wait for Phaser to render the new camera view
    this.time.delayedCall(150, () => {
      this.doSnapshot((src) => {
        results.push({ id: pos.id, src });
        this.captureStep(positions, index + 1, results, onComplete);
      });
    });
  }

  /** Snapshot with multiple fallbacks to guarantee a result */
  private doSnapshot(cb: (src: string) => void) {
    let called = false;
    const safeCb = (src: string) => {
      if (called) return;
      called = true;
      cb(src);
    };

    // Failsafe timeout: if snapshot doesn't complete in 300ms, force fallback
    setTimeout(() => {
      try {
        const src = this.game.canvas.toDataURL("image/png");
        if (src && src.length > 100) {
          safeCb(src);
          return;
        }
      } catch (_) {}
      safeCb(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==",
      );
    }, 300);

    try {
      const renderer = this.game.renderer;
      if (typeof (renderer as any).snapshot === "function") {
        (renderer as any).snapshot((img: HTMLImageElement) => {
          safeCb(img.src);
        });
        return;
      }
    } catch (_) {
      /* fall through */
    }

    try {
      const src = this.game.canvas.toDataURL("image/png");
      if (src && src.length > 100) {
        safeCb(src);
        return;
      }
    } catch (_) {
      /* fall through */
    }
  }
}
