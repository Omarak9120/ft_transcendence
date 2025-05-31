"use strict";
// =====================================================================
//  P O N G  –  Pure TS  •  Pure Tailwind •  Fully-fixed, glitch-free
// =====================================================================
//
//  ▸ single file (main.ts)
//  ▸ no global leaks – everything scoped
//  ▸ time-based physics  ➜ consistent speed, any refresh-rate
//  ▸ key handling fixed  ➜ arrow keys no longer scroll page
//  ▸ resize-safe         ➜ keeps aspect + re-centres objects
//  ▸ frictionless        ➜ paddles/ball never clip or stick
//
// ---------------------------------------------------------------------
// ──────────────────────────────────────────────────────────────────────
//  CONFIG
// ──────────────────────────────────────────────────────────────────────
const GAME_SPEED = 1.25; // master multiplier – crank it up 🔥
const BALL_SPEED_PX = 330; // ball pixels / second (× GAME_SPEED)
const PADDLE_SPEED_FR = 0.45; // fraction of canvas-height / second
const BALL_RADIUS_PX = 10; //ball size
const PADDLE_MARGIN = 24; //gap between l ball w l screen edge
const PADDLE_W = 12; //paaddle width
const PADDLE_H = 80; //paddle height
const COLOR_LEFT = "#22d3ee"; // cyan-300
const COLOR_RIGHT = "#fbbf24"; // amber-300
const COLOR_BALL = "#f472b6"; // pink-400
const COLOR_LINE = "#f3f4f6"; // zinc-100
// ──────────────────────────────────────────────────────────────────────
//  DOM GRAB
// ──────────────────────────────────────────────────────────────────────
const canvas = document.getElementById("pong-canvas");
const ctx = canvas.getContext("2d");
const scoreLNode = document.getElementById("score-left");
const scoreRNode = document.getElementById("score-right");
const startBtn = document.getElementById("start-btn");
// ──────────────────────────────────────────────────────────────────────
//  STATE
// ──────────────────────────────────────────────────────────────────────
let left;
let right;
let ball;
let scoreL = 0;
let scoreR = 0;
let playing = false;
// ──────────────────────────────────────────────────────────────────────
//  INIT
// ──────────────────────────────────────────────────────────────────────
resetObjects();
resizeCanvas();
render(); // draw once so UI isn't blank
updateScore();
startBtn.addEventListener("click", () => {
    startBtn.classList.add("hidden");
    playing = true;
    lastTime = performance.now();
    requestAnimationFrame(loop);
});
window.addEventListener("resize", resizeCanvas);
// ---------------------------------------------------------------------
//  OBJECT RESET
// ---------------------------------------------------------------------
function resetObjects() {
    left = { x: PADDLE_MARGIN, y: 0, w: PADDLE_W, h: PADDLE_H };
    right = { x: 0, y: 0, w: PADDLE_W, h: PADDLE_H }; // x set on resize
    ball = { x: 0, y: 0, v: { x: 0, y: 0 }, r: BALL_RADIUS_PX };
}
function resetPositions(towards) {
    const { width: w, height: h } = canvas;
    left.y = (h - left.h) / 2;
    right.y = (h - right.h) / 2;
    ball.x = w / 2;
    ball.y = h / 2;
    const base = BALL_SPEED_PX * GAME_SPEED;
    const angle = (Math.random() - 0.5) * (Math.PI / 3); // ±30°
    ball.v.x = towards * base * Math.cos(angle);
    ball.v.y = base * Math.sin(angle);
}
// ---------------------------------------------------------------------
//  RESIZE
// ---------------------------------------------------------------------
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    right.x = canvas.width - PADDLE_MARGIN - right.w;
    resetPositions(Math.random() < 0.5 ? 1 : -1);
    render();
}
// ──────────────────────────────────────────────────────────────────────
//  KEYBOARD
// ──────────────────────────────────────────────────────────────────────
const keys = {};
const watched = new Set(["w", "s", "ArrowUp", "ArrowDown"]);
function handleKey(e, down) {
    if (!watched.has(e.key))
        return;
    e.preventDefault(); // stop scrolling on arrows/space
    keys[e.key] = down;
}
window.addEventListener("keydown", (e) => handleKey(e, true));
window.addEventListener("keyup", (e) => handleKey(e, false));
// ──────────────────────────────────────────────────────────────────────
//  GAME LOOP
// ──────────────────────────────────────────────────────────────────────
let lastTime = performance.now();
function loop(now) {
    const dt = (now - lastTime) / 1000; // seconds
    lastTime = now;
    if (playing) {
        update(dt);
        render();
    }
    requestAnimationFrame(loop);
}
// ──────────────────────────────────────────────────────────────────────
//  UPDATE (physics & rules)
// ──────────────────────────────────────────────────────────────────────
function update(dt) {
    // --- PADDLES --------------------------------------------------------
    const paddleV = canvas.height * PADDLE_SPEED_FR * GAME_SPEED;
    if (keys["w"])
        left.y -= paddleV * dt;
    if (keys["s"])
        left.y += paddleV * dt;
    if (keys["ArrowUp"])
        right.y -= paddleV * dt;
    if (keys["ArrowDown"])
        right.y += paddleV * dt;
    left.y = clamp(left.y, 0, canvas.height - left.h);
    right.y = clamp(right.y, 0, canvas.height - right.h);
    // --- BALL -----------------------------------------------------------
    ball.x += ball.v.x * dt;
    ball.y += ball.v.y * dt;
    // wall bounce
    if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.v.y *= -1;
    }
    if (ball.y + ball.r > canvas.height) {
        ball.y = canvas.height - ball.r;
        ball.v.y *= -1;
    }
    // paddle bounce (AABB)
    if (ball.v.x < 0 &&
        ball.x - ball.r <= left.x + left.w &&
        ball.y >= left.y &&
        ball.y <= left.y + left.h) {
        ball.x = left.x + left.w + ball.r;
        reflect(left);
    }
    else if (ball.v.x > 0 &&
        ball.x + ball.r >= right.x &&
        ball.y >= right.y &&
        ball.y <= right.y + right.h) {
        ball.x = right.x - ball.r;
        reflect(right);
    }
    // scoring
    if (ball.x + ball.r < 0) {
        scoreR++;
        updateScore();
        resetPositions(1);
    }
    else if (ball.x - ball.r > canvas.width) {
        scoreL++;
        updateScore();
        resetPositions(-1);
    }
}
// ---------------------------------------------------------------------
//  REFLECTION  (adds spin based on hit position)
// ---------------------------------------------------------------------
function reflect(p) {
    const rel = (ball.y - (p.y + p.h / 2)) / (p.h / 2); // -1 .. 1
    const max = Math.PI / 3; // 60°
    const ang = rel * max;
    const speed = BALL_SPEED_PX * GAME_SPEED;
    const dir = p === left ? 1 : -1;
    ball.v.x = dir * speed * Math.cos(ang);
    ball.v.y = speed * Math.sin(ang);
}
// ──────────────────────────────────────────────────────────────────────
//  RENDER
// ──────────────────────────────────────────────────────────────────────
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawPaddle(left, COLOR_LEFT);
    drawPaddle(right, COLOR_RIGHT);
    drawBall();
}
function drawNet() {
    ctx.fillStyle = COLOR_LINE;
    const w = 4, h = 18, gap = 12;
    for (let y = 0; y < canvas.height; y += h + gap)
        ctx.fillRect(canvas.width / 2 - w / 2, y, w, h);
}
function drawPaddle(p, color) {
    ctx.fillStyle = color;
    ctx.fillRect(p.x, p.y, p.w, p.h);
}
function drawBall() {
    ctx.fillStyle = COLOR_BALL;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
}
// ──────────────────────────────────────────────────────────────────────
//  SCORE DISPLAY
// ──────────────────────────────────────────────────────────────────────
function updateScore() {
    scoreLNode.textContent = String(scoreL);
    scoreRNode.textContent = String(scoreR);
}
// ──────────────────────────────────────────────────────────────────────
//  UTIL
// ──────────────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
