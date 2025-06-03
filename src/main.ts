export {}; // make this file a module so we can augment the global scope

/**
 * main.ts – Pong engine with optional AI opponent
 * Strict-mode TypeScript
 */

/* ═════════════ CONFIG ═════════════ */
const GAME_SPEED    = 1.25;
const BALL_SPEED_PX = 330;
const PADDLE_FR     = 0.45;      // fraction of canvas-height / second
const BALL_R        = 10;
const PAD_W         = 12;
const PAD_H         = 80;
const PAD_GAP       = 24;

/* ═════════════ COLOURS ═════════════ */
const COL_LEFT  = "#22d3ee";
const COL_RIGHT = "#fbbf24";
const COL_BALL  = "#f472b6";
const COL_LINE  = "#f3f4f6";

/* ═════════════ TYPES ═════════════ */
interface Vec   { x: number; y: number; }
interface Paddle extends Vec { w: number; h: number; }
interface Ball   extends Vec { v: Vec; r: number; }

/* ═════════════ DOM GRAB ═════════════ */
const cvs      = document.getElementById("pong-canvas") as HTMLCanvasElement;
const ctx      = cvs.getContext("2d")!;
const sLeft    = document.getElementById("score-left")!;
const sRight   = document.getElementById("score-right")!;
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;

/* ═════════════ STATE ═════════════ */
let left   : Paddle;
let right  : Paddle;
let ball   : Ball;
let scoreL = 0;
let scoreR = 0;
let playing  = false;
let gameMode : "pvp" | "ai" = "pvp";
let lastTime = performance.now();

/* AI TUNING */
const AI_REACTION = 0.6;   // [0..1], higher = “smarter”
const AI_MAX      = 0.9;   // max paddle speed as a fraction of human speed

/* ═════════════ INITIALISE ═════════════ */
resetObjects();
resizeCanvas();
render();
updateScore();

startBtn.addEventListener("click", () => {
  // If the user explicitly clicks ▶, start the loop.
  startBtn.classList.add("hidden");
  playing  = true;
  lastTime = performance.now();
  requestAnimationFrame(loop);
});

window.addEventListener("resize", resizeCanvas);

/* ═════════════ INPUT (keyboard) ═════════════ */
const keys: Record<string, boolean> = {};

for (const type of ["keydown", "keyup"] as const) {
  window.addEventListener(type, (evt: Event) => {
    const e = evt as KeyboardEvent;
    if (!["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    keys[e.key] = type === "keydown";
  });
}

/* ═════════════ HELPERS ═════════════ */
const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

function resetObjects(): void {
  left  = { x: PAD_GAP, y: 0, w: PAD_W, h: PAD_H };
  right = { x: 0,       y: 0, w: PAD_W, h: PAD_H }; // will be set properly in resizeCanvas()
  ball  = { x: 0, y: 0, v: { x: 0, y: 0 }, r: BALL_R };
}

function resetPositions(dir: 1 | -1): void {
  left.y  = (cvs.height - PAD_H) / 2;
  right.y = (cvs.height - PAD_H) / 2;
  ball.x  = cvs.width  / 2;
  ball.y  = cvs.height / 2;

  const speed = BALL_SPEED_PX * GAME_SPEED;
  const angle = (Math.random() - 0.5) * (Math.PI / 3);
  ball.v.x = dir * speed * Math.cos(angle);
  ball.v.y =       speed * Math.sin(angle);
}

function resizeCanvas(): void {
  cvs.width  = cvs.clientWidth;
  cvs.height = cvs.clientHeight;
  // Now place the right paddle on the far right:
  right.x = cvs.width - PAD_GAP - right.w;
  // Reset ball + paddles to center:
  resetPositions(Math.random() < 0.5 ? 1 : -1);
  render();
}

/* ═════════════ GAME LOOP ═════════════ */
function loop(now: number): void {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  if (playing) {
    update(dt);
    render();
  }
  requestAnimationFrame(loop);
}

function update(dt: number): void {
  const paddleV = cvs.height * PADDLE_FR * GAME_SPEED;

  /* Left paddle always human */
  if (keys["w"]) left.y -= paddleV * dt;
  if (keys["s"]) left.y += paddleV * dt;

  /* Right paddle: human vs AI choice */
  if (gameMode === "pvp") {
    if (keys["ArrowUp"])   right.y -= paddleV * dt;
    if (keys["ArrowDown"]) right.y += paddleV * dt;
  } else { // simple AI
    const target = ball.y - right.h / 2;
    const diff   = target - right.y;
    const maxD   = paddleV * AI_MAX * dt;
    right.y += clamp(diff * AI_REACTION, -maxD, maxD);
  }

  // clamp both paddles inside canvas
  left.y  = clamp(left.y , 0, cvs.height - left.h);
  right.y = clamp(right.y, 0, cvs.height - right.h);

  /* Ball physics */
  ball.x += ball.v.x * dt;
  ball.y += ball.v.y * dt;

  // Bounce off top / bottom:
  if (ball.y - BALL_R < 0 || ball.y + BALL_R > cvs.height) {
    ball.v.y *= -1;
    ball.y = clamp(ball.y, BALL_R, cvs.height - BALL_R);
  }

  // Paddle collisions:
  const hitPaddle = (p: Paddle, side: "left" | "right"): boolean => {
    const inY = ball.y >= p.y && ball.y <= p.y + p.h;
    if (!inY) return false;
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
    const p   = ball.v.x < 0 ? left : right;
    const rel = (ball.y - (p.y + p.h / 2)) / (p.h / 2);  // –1..+1
    const ang = rel * (Math.PI / 3);                     // ±60°
    const spd = BALL_SPEED_PX * GAME_SPEED;
    const dir = ball.v.x < 0 ? 1 : -1;
    ball.v.x = dir * spd * Math.cos(ang);
    ball.v.y =       spd * Math.sin(ang);
  }

  // Scoring:
  if (ball.x + BALL_R < 0) {
    scoreR++; updateScore(); resetPositions(1);
  } else if (ball.x - BALL_R > cvs.width) {
    scoreL++; updateScore(); resetPositions(-1);
  }
}

function updateScore(): void {
  sLeft .textContent = String(scoreL);
  sRight.textContent = String(scoreR);
}

/* ═════════════ RENDER ═════════════ */
function render(): void {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  drawNet();
  drawPaddle(left , COL_LEFT );
  drawPaddle(right, COL_RIGHT);
  drawBall();
}

function drawNet(): void {
  ctx.fillStyle = COL_LINE;
  const w = 4, h = 18, gap = 12, x = cvs.width / 2 - w / 2;
  for (let y = 0; y < cvs.height; y += h + gap) {
    ctx.fillRect(x, y, w, h);
  }
}

function drawPaddle(p: Paddle, col: string): void {
  ctx.fillStyle = col;
  ctx.fillRect(p.x, p.y, p.w, p.h);
}

function drawBall(): void {
  ctx.fillStyle = COL_BALL;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
}

/* ═════════════ GLOBAL setGameMode ═════════════ */
declare global {
  interface Window {
    setGameMode: (m: "pvp" | "ai") => void;
  }
}

window.setGameMode = (mode: "pvp" | "ai"): void => {
  gameMode = mode;
  scoreL = scoreR = 0;
  updateScore();

  // Immediately start the game (no need to click ▶ again)
  playing = true;
  startBtn.classList.add("hidden");
  startBtn.textContent = mode === "ai"
    ? "▶ PLAY VS AI"
    : "▶ LET THE GAME BEGIN";

  // Reset everything, including right.x via resizeCanvas()
  resetObjects();
  resizeCanvas();

  // Kick off the loop
  lastTime = performance.now();
  requestAnimationFrame(loop);
};
