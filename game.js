// ==========================================
// IT Support: The Vibe Coder - Game Engine
// ==========================================

const TILE = 48;
const PLAYER_SPEED = 160;
const INTERACT_RANGE = 56;

// ---- Audio ----
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function beep(freq, dur, type) {
    if (!audioCtx) audioCtx = new AudioCtx();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type || 'square';
    o.frequency.value = freq;
    g.gain.value = 0.08;
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
}
function sfxCorrect() { beep(523, 0.1); setTimeout(() => beep(659, 0.1), 100); setTimeout(() => beep(784, 0.15), 200); }
function sfxWrong() { beep(200, 0.2, 'sawtooth'); setTimeout(() => beep(150, 0.3, 'sawtooth'), 200); }
function sfxInteract() { beep(440, 0.05); beep(660, 0.05); }
function sfxComplete() { [523,659,784,1047].forEach((f,i) => setTimeout(() => beep(f, 0.15), i * 120)); }

// ---- State ----
let state = {
    screen: 'welcome',
    currentLevel: 0,
    unlockedLevels: [true, false, false],
    completedLevels: [false, false, false],
    playing: false,
    paused: false,
    timer: 0,
    timerActive: false,
    solvedCount: 0,
    totalObjects: 0,
    nearObject: null,
    quizActive: false,
    currentQuizObj: null
};

// ---- Player ----
let player = { x: 0, y: 0, w: 36, h: 36, dir: 'down', frame: 0, animT: 0, moving: false };

// ---- Objects in current level ----
let objects = [];

// ---- Current map ----
let currentMap = [];

// ---- Input ----
const keys = {};
document.addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;
    keys[e.code] = true;
    if (e.code === 'Space') e.preventDefault();
});
document.addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
});

// ---- Canvas ----
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ---- Camera ----
let camera = { x: 0, y: 0 };

// ---- Tile Colors ----
const TILE_COLORS = {
    0: '#1e1e2e', // floor
    1: '#12122a', // wall
    2: '#6b4f1d', // desk
    3: '#2a2a50', // server rack
    4: '#1a3a1a', // plant
    5: '#2a1e1e', // carpet
    6: '#3a3a4a', // chair
};
const WALL_BORDER = '#2a2a5a';
const FLOOR_GRID = '#252538';

// ---- Rendering: Tiles ----
function drawTile(tx, ty, type, sx, sy) {
    const x = tx * TILE - sx;
    const y = ty * TILE - sy;
    ctx.fillStyle = TILE_COLORS[type] || '#1e1e2e';
    ctx.fillRect(x, y, TILE, TILE);

    if (type === 0 || type === 5 || type === 6) {
        ctx.strokeStyle = FLOOR_GRID;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, TILE, TILE);
    }
    if (type === 1) {
        ctx.strokeStyle = WALL_BORDER;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
        ctx.fillStyle = '#1a1a3a';
        ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
    }
    if (type === 2) {
        ctx.fillStyle = '#8B7332';
        ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
        ctx.strokeStyle = '#5a4010';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
    }
    if (type === 3) {
        ctx.fillStyle = '#3a3a6a';
        ctx.fillRect(x + 4, y + 2, TILE - 8, TILE - 4);
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#00ff41' : '#ffb000';
            ctx.fillRect(x + 8 + i * 10, y + 6, 4, 4);
        }
        ctx.strokeStyle = '#5a5a8a';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 4, y + 2, TILE - 8, TILE - 4);
    }
    if (type === 4) {
        ctx.fillStyle = '#2d5a27';
        ctx.beginPath();
        ctx.arc(x + TILE/2, y + TILE/2 - 4, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(x + TILE/2 - 3, y + TILE/2 + 6, 6, 12);
    }
    if (type === 5) {
        ctx.fillStyle = '#33202a';
        ctx.fillRect(x, y, TILE, TILE);
    }
    if (type === 6) {
        ctx.fillStyle = '#4a4a5a';
        ctx.beginPath();
        ctx.arc(x + TILE/2, y + TILE/2, 10, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawMap(sx, sy) {
    const startCol = Math.max(0, Math.floor(sx / TILE));
    const endCol = Math.min(currentMap[0].length, Math.ceil((sx + canvas.width) / TILE) + 1);
    const startRow = Math.max(0, Math.floor(sy / TILE));
    const endRow = Math.min(currentMap.length, Math.ceil((sy + canvas.height) / TILE) + 1);
    for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
            drawTile(c, r, currentMap[r][c], sx, sy);
        }
    }
}

// ---- Rendering: Objects ----
function drawObjects(sx, sy, time) {
    objects.forEach(obj => {
        if (obj.solved) return;
        const x = obj.x * TILE - sx;
        const y = obj.y * TILE - sy;
        // Blinking glow
        const blink = Math.sin(time * 4) * 0.5 + 0.5;
        const glowColor = obj.type === 'virus' ? `rgba(255,50,50,${0.2 + blink * 0.3})` : `rgba(255,180,0,${0.2 + blink * 0.3})`;
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(x + TILE/2, y + TILE/2, TILE/2 + 4, 0, Math.PI * 2);
        ctx.fill();
        // Emoji
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(obj.emoji, x + TILE/2, y + TILE/2 + 2);
        // Label
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffb000';
        ctx.fillText(obj.label, x + TILE/2, y - 6);
    });
}

// ---- Rendering: Player ----
function drawPlayer(sx, sy, time) {
    const x = player.x - sx;
    const y = player.y - sy;
    const bobble = player.moving ? Math.sin(time * 10) * 2 : 0;
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(x + player.w/2, y + player.h + 2, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const dirEmoji = { up: '🧑‍💻', down: '👨‍💻', left: '🏃', right: '🏃‍♂️' };
    ctx.fillText(dirEmoji[player.dir] || '👨‍💻', x + player.w/2, y + player.h/2 + bobble);
}

// ---- Collision ----
function isSolid(px, py, pw, ph) {
    const margin = 4;
    const corners = [
        [px + margin, py + margin],
        [px + pw - margin, py + margin],
        [px + margin, py + ph - margin],
        [px + pw - margin, py + ph - margin]
    ];
    for (const [cx, cy] of corners) {
        const col = Math.floor(cx / TILE);
        const row = Math.floor(cy / TILE);
        if (row < 0 || row >= currentMap.length || col < 0 || col >= currentMap[0].length) return true;
        if (SOLID_TILES.includes(currentMap[row][col])) return true;
    }
    return false;
}

// ---- Update ----
let lastTime = 0;
let gameTime = 0;

function update(dt) {
    if (!state.playing || state.quizActive || state.paused) return;

    // Timer (Level 3)
    if (state.timerActive && state.timer > 0) {
        state.timer -= dt;
        document.getElementById('timer-value').textContent = Math.ceil(state.timer);
        if (state.timer <= 0) {
            state.timer = 0;
            state.playing = false;
            showModal('gameover-modal');
            return;
        }
    }

    // Movement
    let dx = 0, dy = 0;
    player.moving = false;
    if (keys['arrowup'] || keys['w']) { dy = -1; player.dir = 'up'; player.moving = true; }
    if (keys['arrowdown'] || keys['s']) { dy = 1; player.dir = 'down'; player.moving = true; }
    if (keys['arrowleft'] || keys['a']) { dx = -1; player.dir = 'left'; player.moving = true; }
    if (keys['arrowright'] || keys['d']) { dx = 1; player.dir = 'right'; player.moving = true; }

    if (dx !== 0 && dy !== 0) {
        const diag = 1 / Math.sqrt(2);
        dx *= diag; dy *= diag;
    }

    const newX = player.x + dx * PLAYER_SPEED * dt;
    const newY = player.y + dy * PLAYER_SPEED * dt;

    if (!isSolid(newX, player.y, player.w, player.h)) player.x = newX;
    if (!isSolid(player.x, newY, player.w, player.h)) player.y = newY;

    // Camera
    const mapW = currentMap[0].length * TILE;
    const mapH = currentMap.length * TILE;
    camera.x = Math.max(0, Math.min(player.x + player.w/2 - canvas.width/2, mapW - canvas.width));
    camera.y = Math.max(0, Math.min(player.y + player.h/2 - canvas.height/2, mapH - canvas.height));

    // Proximity check
    state.nearObject = null;
    const pcx = player.x + player.w/2;
    const pcy = player.y + player.h/2;
    for (const obj of objects) {
        if (obj.solved) continue;
        const ocx = obj.x * TILE + TILE/2;
        const ocy = obj.y * TILE + TILE/2;
        const dist = Math.hypot(pcx - ocx, pcy - ocy);
        if (dist < INTERACT_RANGE) {
            state.nearObject = obj;
            break;
        }
    }

    const hint = document.getElementById('interaction-hint');
    if (state.nearObject) {
        hint.classList.remove('hidden');
    } else {
        hint.classList.add('hidden');
    }

    // Interact
    if (keys['Space'] && state.nearObject && !state.quizActive) {
        keys['Space'] = false;
        sfxInteract();
        openQuiz(state.nearObject);
    }
}

function render(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMap(camera.x, camera.y);
    drawObjects(camera.x, camera.y, time);
    drawPlayer(camera.x, camera.y, time);
}

function gameLoop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
    lastTime = timestamp;
    gameTime = timestamp / 1000;

    if (state.playing) {
        update(dt);
        render(gameTime);
    }
    requestAnimationFrame(gameLoop);
}

// ---- Screen Management ----
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function showModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function hideModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// ---- Level Select ----
function renderLevelCards() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    LEVELS.forEach((lvl, i) => {
        const card = document.createElement('div');
        card.className = 'level-card' + (state.unlockedLevels[i] ? '' : ' locked') + (state.completedLevels[i] ? ' completed' : '');
        card.innerHTML = `
            <span class="level-icon">${lvl.icon}</span>
            <h3>Level ${i + 1}</h3>
            <p>${lvl.name}</p>
            <span class="level-status">${state.completedLevels[i] ? '⭐' : state.unlockedLevels[i] ? '🔓' : '🔒'}</span>
        `;
        if (state.unlockedLevels[i]) {
            card.addEventListener('click', () => startLevel(i));
        }
        grid.appendChild(card);
    });
}

// ---- Start Level ----
function startLevel(index) {
    state.currentLevel = index;
    const lvl = LEVELS[index];
    currentMap = lvl.map;
    player.x = lvl.playerStart.x * TILE + 6;
    player.y = lvl.playerStart.y * TILE + 6;
    player.dir = 'down';
    player.moving = false;

    objects = lvl.objects.map((o, i) => ({ ...o, solved: false, quizIndex: i }));

    state.solvedCount = 0;
    state.totalObjects = objects.length;
    state.nearObject = null;
    state.quizActive = false;
    state.playing = true;

    // Timer
    if (lvl.timer > 0) {
        state.timer = lvl.timer;
        state.timerActive = true;
        document.getElementById('hud-timer').classList.remove('hidden');
    } else {
        state.timerActive = false;
        document.getElementById('hud-timer').classList.add('hidden');
    }

    // HUD
    document.getElementById('hud-level').textContent = `Level ${index + 1}`;
    document.getElementById('hud-objective').textContent = lvl.objective;
    document.getElementById('hud-progress').textContent = `📊 ${state.solvedCount}/${state.totalObjects}`;

    camera.x = 0;
    camera.y = 0;

    showScreen('game-screen');
    hideModal('quiz-modal');
    hideModal('complete-modal');
    hideModal('gameover-modal');
    document.getElementById('interaction-hint').classList.add('hidden');
}

// ---- Quiz System ----
function openQuiz(obj) {
    state.quizActive = true;
    state.currentQuizObj = obj;
    const lvl = LEVELS[state.currentLevel];
    const quizIndex = Math.min(obj.quizIndex, lvl.quizzes.length - 1);
    const quiz = lvl.quizzes[quizIndex];

    document.getElementById('quiz-icon').textContent = quiz.icon;
    document.getElementById('quiz-title').textContent = quiz.title;
    document.getElementById('quiz-question').textContent = quiz.question;

    const optDiv = document.getElementById('quiz-options');
    optDiv.innerHTML = '';
    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.add('hidden');

    quiz.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => handleAnswer(i, quiz, btn));
        optDiv.appendChild(btn);
    });

    showModal('quiz-modal');
}

function handleAnswer(selected, quiz, btn) {
    const optBtns = document.querySelectorAll('.quiz-option');
    optBtns.forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });

    const feedback = document.getElementById('quiz-feedback');
    feedback.classList.remove('hidden', 'success', 'fail');

    if (selected === quiz.correct) {
        btn.classList.add('correct');
        feedback.classList.add('success');
        feedback.textContent = quiz.successMsg;
        sfxCorrect();

        // Mark solved
        if (state.currentQuizObj) {
            state.currentQuizObj.solved = true;
            state.solvedCount++;
            document.getElementById('hud-progress').textContent = `📊 ${state.solvedCount}/${state.totalObjects}`;
        }

        setTimeout(() => {
            hideModal('quiz-modal');
            state.quizActive = false;
            // Check win
            if (state.solvedCount >= state.totalObjects) {
                state.playing = false;
                state.timerActive = false;
                state.completedLevels[state.currentLevel] = true;
                // Unlock next
                if (state.currentLevel + 1 < LEVELS.length) {
                    state.unlockedLevels[state.currentLevel + 1] = true;
                }
                sfxComplete();
                if (state.currentLevel >= LEVELS.length - 1 && state.completedLevels.every(Boolean)) {
                    document.getElementById('interaction-hint').classList.add('hidden');
                    showModal('win-modal');
                } else {
                    document.getElementById('interaction-hint').classList.add('hidden');
                    const msg = document.getElementById('complete-message');
                    msg.textContent = `Level ${state.currentLevel + 1} selesai! Masalah "${LEVELS[state.currentLevel].name}" berhasil ditangani!`;
                    const nextBtn = document.getElementById('btn-next-level');
                    if (state.currentLevel + 1 >= LEVELS.length) {
                        nextBtn.classList.add('hidden');
                    } else {
                        nextBtn.classList.remove('hidden');
                    }
                    showModal('complete-modal');
                }
            }
        }, 1200);
    } else {
        btn.classList.add('wrong');
        feedback.classList.add('fail');
        feedback.textContent = quiz.failMsg;
        sfxWrong();

        setTimeout(() => {
            hideModal('quiz-modal');
            state.quizActive = false;
        }, 1800);
    }
}

// ---- Button Events ----
document.getElementById('btn-start').addEventListener('click', () => {
    beep(440, 0.1);
    renderLevelCards();
    showScreen('level-screen');
});

document.getElementById('btn-back-welcome').addEventListener('click', () => {
    showScreen('welcome-screen');
});

document.getElementById('btn-next-level').addEventListener('click', () => {
    hideModal('complete-modal');
    const next = state.currentLevel + 1;
    if (next < LEVELS.length) {
        startLevel(next);
    }
});

document.getElementById('btn-back-levels').addEventListener('click', () => {
    hideModal('complete-modal');
    state.playing = false;
    renderLevelCards();
    showScreen('level-screen');
});

document.getElementById('btn-retry').addEventListener('click', () => {
    hideModal('gameover-modal');
    startLevel(state.currentLevel);
});

document.getElementById('btn-play-again').addEventListener('click', () => {
    hideModal('win-modal');
    state.unlockedLevels = [true, false, false];
    state.completedLevels = [false, false, false];
    state.playing = false;
    renderLevelCards();
    showScreen('level-screen');
});

// ---- Init ----
requestAnimationFrame(gameLoop);
