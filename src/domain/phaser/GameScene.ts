import Phaser from 'phaser';
import { getAllSpriteUris, decorSpriteKey, npcSpriteKey } from '../../infrastructure/assets/AssetManager';
import { FloorManager } from '../FloorManager';
import { GameState } from '../GameState';
import { AudioManager } from '../../infrastructure/assets/AudioManager';
import { EventBus } from '../../infrastructure/events/EventBus';
import { ELEVATOR_POS, SOLID_TILES } from '../../infrastructure/data/maps';
import { AreaBounds, FLOOR1_AREA_BOUNDS, FLOOR2_AREA_BOUNDS } from '../../infrastructure/data/floorData';

const TILE = 48;
const TILE_COLORS: Record<number, number> = {
  0: 0xe8f0f8, 1: 0x90caf9, 2: 0x8d6e63,
  3: 0xcfd8dc, 4: 0x66bb6a, 5: 0xbbdefb, 6: 0x9e9e9e,
  7: 0x34495e, 8: 0x7f8c8d, // 7: Road, 8: Parking
};

export class GameScene extends Phaser.Scene {
  player!: Phaser.Physics.Arcade.Sprite;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  keys!: any;
  
  floorManager!: FloorManager;
  gameState!: GameState;
  
  objectsGroup!: Phaser.GameObjects.Group;
  wallsGroup!: Phaser.Physics.Arcade.StaticGroup;
  decorationsGroup!: Phaser.GameObjects.Group;
  npcsGroup!: Phaser.GameObjects.Group;
  private cctvCapturing = false;

  constructor() {
    super('GameScene');
  }

  init(data: { floorManager: FloorManager, gameState: GameState }) {
    this.floorManager = data.floorManager;
    this.gameState = data.gameState;
  }

  preload() {
    const uris = getAllSpriteUris();
    for (const [key, uri] of Object.entries(uris)) {
      this.load.image(key, uri);
    }
  }

  create() {
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
    let px = 3 * TILE + TILE/2;
    let py = 3 * TILE + TILE/2;
    if (this.floorManager.currentFloor === 2) {
      px = ELEVATOR_POS.x * TILE - TILE/2;
      py = ELEVATOR_POS.y * TILE + TILE/2;
    }
    this.player = this.physics.add.sprite(px, py, 'player');
    this.player.setSize(24, 24);
    this.player.setOffset(12, 24);
    this.player.setDepth(10);
    this.player.setCollideWorldBounds(true);

    // Collision
    this.physics.add.collider(this.player, this.wallsGroup);

    // Camera
    const mapW = this.floorManager.map[0].length * TILE;
    const mapH = this.floorManager.map.length * TILE;
    this.physics.world.setBounds(0, 0, mapW, mapH);
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor('#e0e8f0');

    // Controls
    if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE');
    }

    // Events
    EventBus.on('quiz_closed', this.onQuizClosed, this);
    EventBus.on('request_cctv_capture', this.startCCTVCapture, this);
    this.events.on('shutdown', () => {
      EventBus.off('quiz_closed', this.onQuizClosed, this);
      EventBus.off('request_cctv_capture', this.startCCTVCapture, this);
    });
  }

  onQuizClosed(solved: boolean) {
    if (solved && this.gameState.quizObjectIndex !== null) {
      this.floorManager.allObjects[this.gameState.quizObjectIndex].solve();
      // Re-render to update object visually (stop blink/red)
      this.scene.restart({ floorManager: this.floorManager, gameState: this.gameState });
      
      if (this.floorManager.allSolved) {
        EventBus.emit('game_won');
      }
    }
    this.gameState.quizActive = false;
    this.gameState.quizObjectIndex = null;
  }

  renderMap() {
    const map = this.floorManager.map;
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[0].length; c++) {
        const type = map[r][c];
        const x = c * TILE;
        const y = r * TILE;
        
        // Base tile
        const color = TILE_COLORS[type] || 0xe8f0f8;
        const rect = this.add.rectangle(x + TILE/2, y + TILE/2, TILE, TILE, color);
        rect.setDepth(0);

        if ([0, 5, 6].includes(type)) {
          rect.setStrokeStyle(1, 0xd6e4f0);
        }

        if (SOLID_TILES.includes(type)) {
          const wall = this.add.rectangle(x + TILE/2, y + TILE/2, TILE, TILE, 0x000000, 0);
          this.wallsGroup.add(wall);
          
          if (type === 1) {
             const innerWall = this.add.rectangle(x + TILE/2, y + TILE/2, TILE - 8, TILE - 8, 0x42a5f5);
             innerWall.setStrokeStyle(2, 0x64b5f6);
             innerWall.setDepth(1);
          } else if (type === 2) {
             const desk = this.add.rectangle(x + TILE/2, y + TILE/2, TILE - 4, TILE - 4, 0xa1887f);
             desk.setStrokeStyle(1, 0x6d4c41);
             desk.setDepth(1);
          } else if (type === 3) {
             const bed = this.add.rectangle(x + TILE/2, y + TILE/2, TILE - 8, TILE - 4, 0xeceff1);
             bed.setStrokeStyle(1, 0xb0bec5);
             bed.setDepth(1);
          }
        }
      }
    }

    // Room labels
    for (const lbl of this.floorManager.labels) {
      const text = this.add.text(lbl.x * TILE + TILE/2, lbl.y * TILE + TILE/2, lbl.text, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '7px',
        color: '#2196f3',
      }).setOrigin(0.5).setDepth(2);
    }
  }

  renderDecorations() {
    for (const dec of this.floorManager.decorations) {
      const key = decorSpriteKey(dec.type as any);
      const x = dec.x * TILE + TILE/2;
      const y = dec.y * TILE + TILE/2;

      if (dec.type === 'cctvCamera') {
        // CCTV Camera: ceiling-mounted, high Z, 70% opacity
        const spr = this.add.image(x, y, key);
        spr.setDepth(90);
        spr.setAlpha(0.7);
        // Blink the red LED indicator
        const led = this.add.circle(x + 14, y - 10, 3, 0xe74c3c);
        led.setDepth(91);
        this.tweens.add({
          targets: led,
          alpha: 0,
          yoyo: true,
          repeat: -1,
          duration: 800 + Math.random() * 400,
        });
      } else if (dec.type === 'cctvMonitor') {
        // CCTV Monitor: large screen with pulsing blue glow
        const glow = this.add.rectangle(x, y, TILE + 10, TILE + 10, 0x4fc3f7, 0.25);
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
        this.add.text(x, y - 30, 'Monitor CCTV', {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '5px',
          color: '#4fc3f7',
        }).setOrigin(0.5).setDepth(5);
      } else if (dec.type === 'accessPoint') {
        // Access Point Rule: rendered on ceiling, highest Z-index, 60% opacity
        const spr = this.add.image(x, y, key);
        spr.setDepth(100);
        spr.setAlpha(0.6);
      } else {
        const spr = this.wallsGroup.create(x, y, key) as Phaser.Physics.Arcade.Sprite;
        spr.setDepth(2);
      }
    }
  }

  renderElevator() {
    const ex = ELEVATOR_POS.x * TILE + TILE/2;
    const ey = ELEVATOR_POS.y * TILE + TILE/2;
    const elev = this.add.image(ex, ey, 'elevator');
    elev.setDepth(2);
  }

  renderNPCs() {
    for (const npc of this.floorManager.npcs) {
      const x = npc.x * TILE + TILE/2;
      const y = npc.y * TILE + TILE/2;
      const spr = this.add.image(x, y, npc.spriteKey);
      spr.setDepth(5);

      const labelText = this.add.text(x, y - 24, npc.label, {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '6px',
        color: '#1565c0'
      }).setOrigin(0.5).setDepth(5);
      
      if (['guest', 'nurseWheelchair', 'nurseBed', 'walkingNurse'].includes(npc.role)) {
        const distance = (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 150);
        this.tweens.add({
          targets: [spr, labelText],
          x: x + distance,
          yoyo: true,
          repeat: -1,
          duration: 3000 + Math.random() * 2000,
          onYoyo: () => { spr.setFlipX(distance > 0); },
          onRepeat: () => { spr.setFlipX(distance < 0); }
        });
      } else if (npc.role === 'security') {
        // Security: short patrol near post
        const d = (Math.random() > 0.5 ? 1 : -1) * 40;
        this.tweens.add({
          targets: [spr, labelText],
          x: x + d,
          yoyo: true,
          repeat: -1,
          duration: 2000,
          onYoyo: () => { spr.setFlipX(d > 0); },
          onRepeat: () => { spr.setFlipX(d < 0); }
        });
      } else {
        // Bob animation for stationary NPCs
        this.tweens.add({
          targets: spr,
          y: y - 3,
          yoyo: true,
          repeat: -1,
          duration: 800 + Math.random() * 400
        });
      }
    }
  }

  renderObjects() {
    for (const obj of this.floorManager.floorObjects) {
      const x = obj.x * TILE + TILE/2;
      const y = obj.y * TILE + TILE/2;
      
      if (!obj.solved) {
        // Glow effect for broken objects
        const glow = this.add.rectangle(x, y, TILE + 8, TILE + 8, 0xff3232, 0.3);
        glow.setDepth(1);
        this.tweens.add({
          targets: glow,
          alpha: 0.1,
          yoyo: true,
          repeat: -1,
          duration: 500
        });

        this.add.text(x, y - 24, obj.label, {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '6px',
          color: '#ff5252'
        }).setOrigin(0.5).setDepth(5);
      }
      
      const spr = this.wallsGroup.create(x, y, obj.spriteKey) as Phaser.Physics.Arcade.Sprite;
      spr.setDepth(4);
    }
  }

  update(time: number, delta: number) {
    if (this.cctvCapturing || !this.player || !this.player.active) return;

    if (this.gameState.screen !== 'playing' || this.gameState.quizActive || this.gameState.isPaused) {
      this.player.setVelocity(0);
      return;
    }

    const speed = 180;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown || this.keys.A.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.keys.D.isDown) vx = speed;

    if (this.cursors.up.isDown || this.keys.W.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.keys.S.isDown) vy = speed;

    this.player.setVelocity(vx, vy);

    // Player bobbing animation based on velocity
    if (vx !== 0 || vy !== 0) {
      this.player.setAngle(Math.sin(time / 100) * 10);
    } else {
      this.player.setAngle(0);
    }

    // Interaction checks
    this.checkInteractions();
  }

  checkInteractions() {
    const px = this.player.x;
    const py = this.player.y;
    
    // Check nearest broken object
    const nearObj = this.floorManager.nearestObject(px, py);
    const nearIdx = nearObj ? this.floorManager.allObjects.indexOf(nearObj) : null;
    
    if (this.gameState.nearObjectIndex !== nearIdx) {
      this.gameState.nearObjectIndex = nearIdx;
      EventBus.emit('near_object', nearIdx);
    }

    // Check elevator
    const nearElevator = this.floorManager.isNearElevator(px, py);
    if (this.gameState.nearElevator !== nearElevator) {
      this.gameState.nearElevator = nearElevator;
      EventBus.emit('near_elevator', nearElevator);
    }

    // Check CCTV monitor (only Floor 1)
    const nearCCTV = this.floorManager.isNearCCTVMonitor(px, py);
    if (this.gameState.nearCCTV !== nearCCTV) {
      this.gameState.nearCCTV = nearCCTV;
      EventBus.emit('near_cctv', nearCCTV);
    }

    // Space interaction
    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
      if (nearObj) {
        AudioManager.interact();
        this.gameState.quizActive = true;
        this.gameState.quizObjectIndex = nearIdx;
        EventBus.emit('open_quiz', nearIdx);
      } else if (nearCCTV) {
        AudioManager.interact();
        EventBus.emit('open_cctv');
      } else if (nearElevator) {
        AudioManager.elevator();
        const targetFloor = this.floorManager.oppositeFloor();
        this.floorManager.loadFloor(targetFloor);
        EventBus.emit('floor_changed', targetFloor);
        this.scene.restart({ floorManager: this.floorManager, gameState: this.gameState });
      }
    }
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

  private rebuildFloor(floor: 1 | 2) {
    this.floorManager.loadFloor(floor);
    const mapW = this.floorManager.map[0].length * TILE;
    const mapH = this.floorManager.map.length * TILE;
    this.physics.world.setBounds(0, 0, mapW, mapH);
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.renderMap();
    this.renderDecorations();
    this.renderElevator();
    this.renderNPCs();
    this.renderObjects();
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

    const captureFloor = (floor: 1 | 2, cams: any[], onComplete: () => void) => {
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
        // Phase 3: Restore Original State
        if (this.floorManager.currentFloor !== originalFloor) {
          this.clearWorld();
          this.rebuildFloor(originalFloor);
        }

        // Recreate player
        this.player = this.physics.add.sprite(savedX, savedY, 'player');
        this.player.setSize(24, 24);
        this.player.setOffset(12, 24);
        this.player.setDepth(10);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.wallsGroup);

        this.cameras.main.setScroll(savedScrollX, savedScrollY);
        this.cameras.main.startFollow(this.player);
        this.cctvCapturing = false;
        EventBus.emit('cctv_frames', results);
      });
    });
  }

  private captureStep(
    positions: AreaBounds[],
    index: number,
    results: { id: string; src: string }[],
    onComplete: () => void
  ) {
    if (index >= positions.length) {
      this.cameras.main.setZoom(1);
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
        const src = this.game.canvas.toDataURL('image/png');
        if (src && src.length > 100) { safeCb(src); return; }
      } catch (_) {}
      safeCb('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==');
    }, 300);

    try {
      const renderer = this.game.renderer;
      if (typeof (renderer as any).snapshot === 'function') {
        (renderer as any).snapshot((img: HTMLImageElement) => {
          safeCb(img.src);
        });
        return;
      }
    } catch (_) { /* fall through */ }

    try {
      const src = this.game.canvas.toDataURL('image/png');
      if (src && src.length > 100) { safeCb(src); return; }
    } catch (_) { /* fall through */ }
  }
}
