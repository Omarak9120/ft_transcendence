/**
 * nav.ts – SPA navbar, overlays, tabs, “Play → Difficulty” logic
 * Strict-mode TypeScript
 */

import { initStatsTab }   from "./stats.js";
import { initHistoryTab } from "./history.js";

/* ── shorthand for querySelector ───────────────── */
const $ = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector<T>(sel);

/* ── burger menu ───────────────────────────────── */
$("#burger")?.addEventListener("click", () => {
  $<HTMLElement>("#nav-menu")?.classList.toggle("hidden");
});

/* ── show/hide utility for overlays ────────────── */
function showOverlay(el: HTMLElement, container?: HTMLElement) {
  el.classList.remove("hidden");
  requestAnimationFrame(() => {
    el.classList.remove("opacity-0");
    if (container) container.classList.remove("scale-90");
  });
}
function hideOverlay(el: HTMLElement, container?: HTMLElement) {
  if (container) container.classList.add("scale-90");
  el.classList.add("opacity-0");
  setTimeout(() => el.classList.add("hidden"), 300);
}

/* ── PROFILE overlay ───────────────────────────── */
const profile = $("#profile-overlay")!;
$("#nav-profile")?.addEventListener("click", () => {
  showOverlay(profile);
  repositionUnderline();
});
$("#profile-close")?.addEventListener("click", () => {
  hideOverlay(profile);
});

/* Close profile if ESC pressed */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideOverlay(profile);
  }
});

/* ── avatar preview ───────────────────────────── */
$("#avatar-input")?.addEventListener("change", (ev) => {
  const f = (ev.currentTarget as HTMLInputElement).files?.[0];
  if (f) {
    ($<HTMLImageElement>("#avatar-img")!).src = URL.createObjectURL(f);
  }
});

/* ── PROFILE tabs & sliding underline ─────────── */
const tabBtns = document.querySelectorAll<HTMLButtonElement>("#profile-tabs .tab-btn");
const panels  = document.querySelectorAll<HTMLElement>("#tab-panels .panel");
const line    = $("#tab-underline")!;

tabBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabBtns.forEach((b) => {
      b.classList.toggle("text-white", b === btn);
      b.classList.toggle("text-white/70", b !== btn);
    });
    line.style.width     = `${btn.offsetWidth}px`;
    line.style.transform = `translateX(${btn.offsetLeft}px)`;
    panels.forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== target));
    if (target === "stats")   initStatsTab();
    if (target === "history") initHistoryTab();
  })
);

function repositionUnderline() {
  const active = document.querySelector<HTMLButtonElement>(
    "#profile-tabs .tab-btn.text-white"
  );
  if (active) {
    line.style.width     = `${active.offsetWidth}px`;
    line.style.transform = `translateX(${active.offsetLeft}px)`;
  }
}
window.addEventListener("resize", repositionUnderline);

/* ── PLAY overlay ─────────────────────────────── */
const playOverlay = $("#play-overlay")!;
$("#nav-play")?.addEventListener("click", () => {
  showOverlay(playOverlay);
});
$("#play-close")?.addEventListener("click", () => {
  hideOverlay(playOverlay);
});

/* pressing ESC hides Play too */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideOverlay(playOverlay);
  }
});

/* ── clicking a mode-card inside the Play pop-up ─ */
document.querySelectorAll<HTMLButtonElement>(".mode-card").forEach((card) => {
  card.addEventListener("click", () => {
    const mode = card.dataset.mode as "ai" | "offline" | "remote" | "tournament";
    hideOverlay(playOverlay);

    if (mode === "ai") {
      // Show the difficulty pop-up
      showOverlay($("#difficulty-overlay")!, $("#difficulty-container")!);
    } else if (mode === "offline") {
      window.setGameMode("pvp");
    } else {
      alert(`Mode “${mode}” coming soon!`);
    }
  });
});

/* ── Difficulty pop-up close ───────────────────── */
const diffOverlay = $("#difficulty-overlay")!;
const diffContainer = $("#difficulty-container")!;

$("#difficulty-close")?.addEventListener("click", () => {
  hideOverlay(diffOverlay, diffContainer);
});

/* ESC hides difficulty pop-up as well */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideOverlay(diffOverlay, diffContainer);
  }
});

/* ── click on one of the three difficulty buttons ─ */
document.querySelectorAll<HTMLButtonElement>(".diff-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const diff = btn.dataset.diff as "easy" | "medium" | "hard";
    hideOverlay(diffOverlay, diffContainer);

    let refreshRate: number;
    if (diff === "easy") refreshRate = 1.0;
    else if (diff === "medium") refreshRate = 0.5;
    else refreshRate = 0.01;

    window.setAIRefresh(refreshRate);
    window.setGameMode("ai");
  });
});
