/**
 * nav.ts – SPA navbar & overlays
 * Strict-mode TypeScript
 */

import { initStatsTab }   from "./stats.js";
import { initHistoryTab } from "./history.js";

/* Typed querySelector helper */
const $ = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector<T>(sel);

/* ── burger (mobile) ───────────────────────────────── */
$("#burger")?.addEventListener("click", () => {
  $<HTMLElement>("#nav-menu")?.classList.toggle("hidden");
});

/* ── overlay show / hide helpers ───────────────────── */
const show = (el: HTMLElement) => {
  el.classList.remove("hidden");
  requestAnimationFrame(() => el.classList.remove("opacity-0"));
};
const hide = (el: HTMLElement) => {
  el.classList.add("opacity-0");
  setTimeout(() => el.classList.add("hidden"), 300);
};

/* ── PROFILE overlay ───────────────────────────────── */
const profile = $("#profile-overlay")!;
$("#nav-profile")?.addEventListener("click", () => { show(profile); syncUnderline(); });
$("#profile-close")?.addEventListener("click", () => hide(profile));

/* ── PLAY overlay ─────────────────────────────────── */
const play = $("#play-overlay")!;
$("#nav-play")?.addEventListener("click", () => show(play));
$("#play-close")?.addEventListener("click", () => hide(play));

/* Esc closes any open overlay */
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hide(profile);
    hide(play);
  }
});

/* ── avatar preview ───────────────────────────────── */
$("#avatar-input")?.addEventListener("change", (ev) => {
  const f = (ev.currentTarget as HTMLInputElement).files?.[0];
  if (f) ($<HTMLImageElement>("#avatar-img")!).src = URL.createObjectURL(f);
});

/* ── tabs + sliding underline ─────────────────────── */
const tabs   = document.querySelectorAll<HTMLButtonElement>("#profile-tabs .tab-btn");
const panels = document.querySelectorAll<HTMLElement>("#tab-panels .panel");
const line   = $("#tab-underline")!;

tabs.forEach((btn) =>
  btn.addEventListener("click", () => {
    tabs.forEach((b) => {
      b.classList.toggle("text-white", b === btn);
      b.classList.toggle("text-white/70", b !== btn);
    });

    line.style.width = `${btn.offsetWidth}px`;
    line.style.transform = `translateX(${btn.offsetLeft}px)`;

    panels.forEach((p) =>
      p.classList.toggle("hidden", p.dataset.panel !== btn.dataset.tab)
    );
    if (btn.dataset.tab === "stats")   initStatsTab();
    if (btn.dataset.tab === "history") initHistoryTab();
  })
);
function syncUnderline(): void {
  const active = document.querySelector<HTMLButtonElement>("#profile-tabs .tab-btn.text-white");
  if (active) {
    line.style.width = `${active.offsetWidth}px`;
    line.style.transform = `translateX(${active.offsetLeft}px)`;
  }
}
window.addEventListener("resize", syncUnderline);

/* ── Play-mode cards ───────────────────────────────── */
document.querySelectorAll<HTMLButtonElement>(".mode-card").forEach((card) => {
  card.addEventListener("click", () => {
    const mode = card.dataset.mode as "ai" | "offline" | "remote" | "tournament";
    hide(play); // close the pop-up

    if (mode === "ai")         window.setGameMode("ai");
    else if (mode === "offline") window.setGameMode("pvp");
    else alert(`Mode "${mode}" coming soon!`);
  });
});
