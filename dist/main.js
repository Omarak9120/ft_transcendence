/**
 * main.ts – Pong engine with 1 s / 0.5 s / 0.01 s AI
 * Strict-mode TypeScript
 */
/* ═════════════ CONFIG ═════════════ */
const GAME_SPEED = 1.25; // speed multiplier
const BALL_SPEED_PX = 330; // base ball speed
const PADDLE_FR = 0.45; // fraction of canvas-height per second
const BALL_R = 10;
const PAD_W = 12;
const PAD_H = 80;
const PAD_GAP = 24;
/* ═════════════ COLORS ═════════════ */
const COL_LEFT = "#22d3ee";
const COL_RIGHT = "#fbbf24";
const COL_BALL = "#f472b6";
const COL_LINE = "#f3f4f6";
/* ═════════════ DOM GRAB ═════════════ */
const cvs = document.getElementById("pong-canvas");
const ctx = cvs.getContext("2d");
const sLeft = document.getElementById("score-left");
const sRight = document.getElementById("score-right");
const startBtn = document.getElementById("start-btn");
/* ═════════════ STATE ═════════════ */
let left;
let right;
let ball;
let scoreL = 0;
let scoreR = 0;
let playing = false;
let gameMode = "pvp";
let lastTime = performance.now();
/* AI “refresh” interval (in seconds), set by difficulty */
let AI_REFRESH = 1.0; // default easy = 1 s
const AI_MAX_SPEED = 0.9; // can move at 90% of full paddle speed
let aiAccumulator = 0; // accumulates dt until ≥ AI_REFRESH
/* ═════════════ INITIALISE ═════════════ */
resetObjects();
resizeCanvas();
render();
updateScore();
startBtn.addEventListener("click", () => {
    // If the user clicks the ▶ button:
    startBtn.classList.add("hidden");
    playing = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
});
window.addEventListener("resize", resizeCanvas);
/* ═════════════ INPUT (keyboard) ═════════════ */
const keys = {};
for (const type of ["keydown", "keyup"]) {
    window.addEventListener(type, (evt) => {
        const e = evt;
        if (!["w", "s", "ArrowUp", "ArrowDown"].includes(e.key))
            return;
        e.preventDefault();
        keys[e.key] = type === "keydown";
    });
}
/* ═════════════ HELPERS ═════════════ */
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
function resetObjects() {
    left = { x: PAD_GAP, y: 0, w: PAD_W, h: PAD_H };
    right = { x: 0, y: 0, w: PAD_W, h: PAD_H };
    ball = { x: 0, y: 0, v: { x: 0, y: 0 }, r: BALL_R };
}
function resetPositions(dir) {
    left.y = (cvs.height - PAD_H) / 2;
    right.y = (cvs.height - PAD_H) / 2;
    ball.x = cvs.width / 2;
    ball.y = cvs.height / 2;
    const speed = BALL_SPEED_PX * GAME_SPEED;
    const angle = (Math.random() - 0.5) * (Math.PI / 3);
    ball.v.x = dir * speed * Math.cos(angle);
    ball.v.y = speed * Math.sin(angle);
}
function resizeCanvas() {
    cvs.width = cvs.clientWidth;
    cvs.height = cvs.clientHeight;
    right.x = cvs.width - PAD_GAP - right.w; // far right
    resetPositions(Math.random() < 0.5 ? 1 : -1);
    render();
}
/* ═════════════ GAME LOOP ═════════════ */
function loop(now) {
    const dt = (now - lastTime) / 1000;
    lastTime = now;
    if (playing) {
        update(dt);
        render();
    }
    requestAnimationFrame(loop);
}
function update(dt) {
    const paddleV = cvs.height * PADDLE_FR * GAME_SPEED;
    /* ––––– Left paddle (human) ––––– */
    if (keys["w"])
        left.y -= paddleV * dt;
    if (keys["s"])
        left.y += paddleV * dt;
    left.y = clamp(left.y, 0, cvs.height - left.h);
    /* ––––– Right paddle ––––– */
    if (gameMode === "pvp") {
        if (keys["ArrowUp"])
            right.y -= paddleV * dt;
        if (keys["ArrowDown"])
            right.y += paddleV * dt;
        right.y = clamp(right.y, 0, cvs.height - right.h);
    }
    else {
        // AI: accumulate time; once ≥ AI_REFRESH, decide again
        aiAccumulator += dt;
        if (aiAccumulator >= AI_REFRESH) {
            aiAccumulator -= AI_REFRESH;
            computeAIDecision();
        }
        // In between decisions, hold whichever key was last set
        if (keys["ArrowUp"])
            right.y -= paddleV * AI_MAX_SPEED * dt;
        if (keys["ArrowDown"])
            right.y += paddleV * AI_MAX_SPEED * dt;
        right.y = clamp(right.y, 0, cvs.height - right.h);
    }
    /* ––––– Ball physics ––––– */
    ball.x += ball.v.x * dt;
    ball.y += ball.v.y * dt;
    // bounce off top/bottom
    if (ball.y - BALL_R < 0 || ball.y + BALL_R > cvs.height) {
        ball.v.y *= -1;
        ball.y = clamp(ball.y, BALL_R, cvs.height - BALL_R);
    }
    // paddle collisions
    const hitPaddle = (p, side) => {
        const inY = ball.y >= p.y && ball.y <= p.y + p.h;
        if (!inY)
            return false;
        if (side === "left" && ball.v.x < 0 && ball.x - BALL_R <= p.x + p.w) {
            ball.x = p.x + p.w + BALL_R;
            return true;
        }
        if (side === "right" && ball.v.x > 0 && ball.x + BALL_R >= p.x) {
            ball.x = p.x - BALL_R;
            return true;
        }
        return false;
    };
    if (hitPaddle(left, "left") || hitPaddle(right, "right")) {
        const p = ball.v.x < 0 ? left : right;
        const rel = (ball.y - (p.y + p.h / 2)) / (p.h / 2);
        const ang = rel * (Math.PI / 3);
        const spd = BALL_SPEED_PX * GAME_SPEED;
        const dir = ball.v.x < 0 ? 1 : -1;
        ball.v.x = dir * spd * Math.cos(ang);
        ball.v.y = spd * Math.sin(ang);
    }
    /* ––––– Scoring ––––– */
    if (ball.x + BALL_R < 0) {
        scoreR++;
        updateScore();
        resetPositions(1);
    }
    else if (ball.x - BALL_R > cvs.width) {
        scoreL++;
        updateScore();
        resetPositions(-1);
    }
}
function updateScore() {
    sLeft.textContent = String(scoreL);
    sRight.textContent = String(scoreR);
}
/**
 * AI decision (once per AI_REFRESH seconds):
 * • Only “sees” when ball.v.x > 0 (moving toward AI). Otherwise, releases keys.
 * • Predicts top/bottom wall bounces until ball.x ≥ right.x, then chooses ArrowUp/ArrowDown.
 */
function computeAIDecision() {
    if (ball.v.x <= 0) {
        // Ball moving away; do nothing
        keys["ArrowUp"] = false;
        keys["ArrowDown"] = false;
        return;
    }
    // Copy current ball state
    let bx = ball.x;
    let by = ball.y;
    let vx = ball.v.x;
    let vy = ball.v.y;
    // Project forward until bx ≥ right.x
    while (true) {
        const dtX = (right.x - bx) / vx;
        const nextY = by + vy * dtX;
        if (nextY >= BALL_R && nextY <= cvs.height - BALL_R) {
            by = nextY;
            break;
        }
        // Bounce off top/bottom
        if (vy > 0) {
            // heading down → bottom at y = cvs.height - BALL_R
            const dtW = ((cvs.height - BALL_R) - by) / vy;
            bx += vx * dtW;
            by = cvs.height - BALL_R;
            vy = -vy;
        }
        else {
            // heading up → top at y = BALL_R
            const dtW = (BALL_R - by) / vy;
            bx += vx * dtW;
            by = BALL_R;
            vy = -vy;
        }
    }
    // by is predicted intercept Y at right.x
    const paddleCenter = right.y + right.h / 2;
    if (by < paddleCenter - 5) {
        keys["ArrowUp"] = true;
        keys["ArrowDown"] = false;
    }
    else if (by > paddleCenter + 5) {
        keys["ArrowUp"] = false;
        keys["ArrowDown"] = true;
    }
    else {
        keys["ArrowUp"] = false;
        keys["ArrowDown"] = false;
    }
}
/* ═════════════ RENDER ═════════════ */
function render() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    drawNet();
    drawPaddle(left, COL_LEFT);
    drawPaddle(right, COL_RIGHT);
    drawBall();
}
function drawNet() {
    ctx.fillStyle = COL_LINE;
    const w = 4, h = 18, gap = 12, x = cvs.width / 2 - w / 2;
    for (let y = 0; y < cvs.height; y += h + gap) {
        ctx.fillRect(x, y, w, h);
    }
}
function drawPaddle(p, col) {
    ctx.fillStyle = col;
    ctx.fillRect(p.x, p.y, p.w, p.h);
}
function drawBall() {
    ctx.fillStyle = COL_BALL;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
}
/**
 * Called by nav.ts when user picks a difficulty:
 *   sec = 1.0 (easy) | 0.5 (medium) | 0.01 (impossible)
 */
window.setAIRefresh = (sec) => {
    AI_REFRESH = sec;
    aiAccumulator = 0; // reset timer
};
/**
 * Called by nav.ts when user picks PvP or VsAI:
 * • Resets scores, positions, etc.
 * • Hides ▶ button and immediately starts loop in chosen mode.
 */
window.setGameMode = (mode) => {
    gameMode = mode;
    scoreL = scoreR = 0;
    updateScore();
    // Immediately start playing
    playing = true;
    startBtn.classList.add("hidden");
    startBtn.textContent = mode === "ai"
        ? "▶ PLAY VS AI"
        : "▶ LET THE GAME BEGIN";
    // Reset objects + place right.x correctly
    resetObjects();
    resizeCanvas();
    lastTime = performance.now();
    aiAccumulator = 0;
    requestAnimationFrame(loop);
};
export {};
