/**
 * nav.ts – SPA navbar, overlays, tabs, “Play → Difficulty” logic
 * Strict-mode TypeScript
 */

import { initStatsTab } from "./stats.js";
import { initHistoryTab } from "./history.js";

/* ── shorthand for querySelector ───────────────── */
const $ = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector<T>(sel);

/* grab nav-menu once so we reuse it everywhere */
const navMenu = $("#nav-menu");

/* ── breakpoints & helper lists ────────────────── */
const MOBILE_BP = 640;

/**
 * Tailwind classes applied **only** while the burger-menu is open
 * below the `sm` breakpoint.  The two “inset” classes make the
 * dropdown span the entire viewport width, centred under the bar.
 */
const MOBILE_DROPDOWN: readonly string[] = [
  "flex",
  "flex-col",
  "absolute",
  "left-0",
  "right-0",
  "top-16", // sits just under the 4-rem-tall navbar
  "w-screen", // full viewport width
  "bg-black/90",
  "space-y-4",
  "items-center",
  "py-4",
];

/* small helper so we’re not repeating loops */
function setMobileDropdown(enabled: boolean) {
  if (!navMenu) return;
  MOBILE_DROPDOWN.forEach((cls) =>
    navMenu.classList[enabled ? "add" : "remove"](cls)
  );
}

/* ── handle resize so the menu never gets “stuck” ── */
function onResize() {
  if (!navMenu) return;

  if (window.innerWidth >= MOBILE_BP) {
    /* back to desktop: always visible & horizontal */
    navMenu.classList.remove("hidden");
    setMobileDropdown(false);
  } else {
    /* back to mobile: keep dropdown classes only while open */
    if (navMenu.classList.contains("hidden")) setMobileDropdown(false);
  }
}
window.addEventListener("resize", onResize);
onResize(); // run immediately

/* ── burger-menu toggle ─────────────────────────── */
$("#burger")?.addEventListener("click", () => {
  if (!navMenu) return;

  const willOpen = navMenu.classList.contains("hidden");
  navMenu.classList.toggle("hidden");

  if (window.innerWidth < MOBILE_BP) setMobileDropdown(willOpen);
});

/* auto-close dropdown after any link tap on mobile */
navMenu?.querySelectorAll("button").forEach((btn) =>
  btn.addEventListener("click", () => {
    if (
      window.innerWidth < MOBILE_BP &&
      !navMenu!.classList.contains("hidden")
    ) {
      $("#burger")?.dispatchEvent(new Event("click"));
    }
  })
);

/* ── SIGN-OUT button — stub ─────────────────────── */
$("#nav-signout")?.addEventListener("click", async () => {
  // plug real logout endpoint here
  alert("Signed out 👍");
});

/* ── small helpers for the various overlays ─────── */
function showOverlay(el: HTMLElement, inner?: HTMLElement) {
  el.classList.remove("hidden");
  requestAnimationFrame(() => {
    el.classList.remove("opacity-0");
    if (inner) inner.classList.remove("scale-90");
  });
}
function hideOverlay(el: HTMLElement, inner?: HTMLElement) {
  if (inner) inner.classList.add("scale-90");
  el.classList.add("opacity-0");
  setTimeout(() => el.classList.add("hidden"), 300);
}

/* ─────────────────────────────────────────────── *
 * Everything below here is unchanged
 * (tabs, profile overlay, play dialogs, etc.)
 * ─────────────────────────────────────────────── */

const profile = $("#profile-overlay")!;
$("#nav-profile")?.addEventListener("click", () => {
  showOverlay(profile);
  repositionUnderline();
});
$("#profile-close")?.addEventListener("click", () => hideOverlay(profile));

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideOverlay(profile);
});

$("#avatar-input")?.addEventListener("change", (ev) => {
  const f = (ev.currentTarget as HTMLInputElement).files?.[0];
  if (f) $<HTMLImageElement>("#avatar-img")!.src = URL.createObjectURL(f);
});

const tabBtns = document.querySelectorAll<HTMLButtonElement>(
  "#profile-tabs .tab-btn"
);
const panels = document.querySelectorAll<HTMLElement>("#tab-panels .panel");
const line = $("#tab-underline")!;

tabBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabBtns.forEach((b) => {
      b.classList.toggle("text-white", b === btn);
      b.classList.toggle("text-white/70", b !== btn);
    });
    line.style.width = `${btn.offsetWidth}px`;
    line.style.transform = `translateX(${btn.offsetLeft}px)`;
    panels.forEach((p) =>
      p.classList.toggle("hidden", p.dataset.panel !== target)
    );
    if (target === "stats") initStatsTab();
    if (target === "history") initHistoryTab();
  })
);

function repositionUnderline() {
  const active = document.querySelector<HTMLButtonElement>(
    "#profile-tabs .tab-btn.text-white"
  );
  if (active) {
    line.style.width = `${active.offsetWidth}px`;
    line.style.transform = `translateX(${active.offsetLeft}px)`;
  }
}
window.addEventListener("resize", repositionUnderline);

const playOverlay = $("#play-overlay")!;
$("#nav-play")?.addEventListener("click", () => showOverlay(playOverlay));
$("#play-close")?.addEventListener("click", () => hideOverlay(playOverlay));

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideOverlay(playOverlay);
});

document.querySelectorAll<HTMLButtonElement>(".mode-card").forEach((card) => {
  card.addEventListener("click", () => {
    const mode = card.dataset.mode as
      | "ai"
      | "offline"
      | "remote"
      | "tournament";
    hideOverlay(playOverlay);

    if (mode === "ai") {
      showOverlay($("#difficulty-overlay")!, $("#difficulty-container")!);
    } else if (mode === "offline") {
      window.setGameMode("pvp");
    } else {
      alert(`Mode “${mode}” coming soon!`);
    }
  });
});

const diffOverlay = $("#difficulty-overlay")!;
const diffContainer = $("#difficulty-container")!;
$("#difficulty-close")?.addEventListener("click", () =>
  hideOverlay(diffOverlay, diffContainer)
);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideOverlay(diffOverlay, diffContainer);
});

document.querySelectorAll<HTMLButtonElement>(".diff-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const diff = btn.dataset.diff as "easy" | "medium" | "hard";
    hideOverlay(diffOverlay, diffContainer);

    const rate = diff === "easy" ? 1.0 : diff === "medium" ? 0.5 : 0.01;
    window.setAIRefresh(rate);
    window.setGameMode("ai");
  });
});
