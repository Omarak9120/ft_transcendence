import { initStatsTab } from "./stats.js";
import { initHistoryTab } from "./history.js";
import "./welcome.js"; // hero / “Play Now” section

/* ── query helper ─────────────────────────── */
const $ = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector<T>(sel);

/* ── constants ────────────────────────────── */
const navMenu = $("#nav-menu");
const BURGER = $("#burger");
const MOBILE_BP = 640;

/* mobile dropdown classes */
const DROP = [
  "flex",
  "flex-col",
  "absolute",
  "left-0",
  "right-0",
  "top-16",
  "w-screen",
  "space-y-4",
  "items-center",
  "py-4",
  "bg-violet-950/95", // new colour
] as const;

/* ── tiny animation helpers ───────────────── */
function fadeIn(el: HTMLElement) {
  el.classList.add("animate__animated", "animate__fadeIn", "animate__faster");
  el.addEventListener(
    "animationend",
    () =>
      el.classList.remove(
        "animate__animated",
        "animate__fadeIn",
        "animate__faster"
      ),
    { once: true }
  );
}
function fadeOut(el: HTMLElement, done: () => void) {
  el.classList.add("animate__animated", "animate__fadeOut", "animate__faster");
  el.addEventListener(
    "animationend",
    () => {
      el.classList.remove(
        "animate__animated",
        "animate__fadeOut",
        "animate__faster"
      );
      done();
    },
    { once: true }
  );
}

/* ── dropdown helpers ─────────────────────── */
function applyMobileStyles(on: boolean) {
  if (!navMenu) return;
  DROP.forEach((c) => navMenu.classList[on ? "add" : "remove"](c));
}

/* open / close menu (used by burger + item clicks) */
function openMenu() {
  if (!navMenu) return;
  navMenu.classList.remove("hidden");
  applyMobileStyles(true);
  fadeIn(navMenu);
}
function closeMenu() {
  if (!navMenu) return;
  fadeOut(navMenu, () => {
    applyMobileStyles(false);
    navMenu!.classList.add("hidden");
  });
}

/* ── burger toggle ────────────────────────── */
BURGER?.addEventListener("click", () => {
  if (!navMenu) return;
  const isOpen = !navMenu.classList.contains("hidden");
  isOpen ? closeMenu() : openMenu();
});

/* auto-close after clicking a nav item on mobile */
navMenu?.querySelectorAll("button").forEach((btn) =>
  btn.addEventListener("click", () => {
    if (
      innerWidth < MOBILE_BP &&
      navMenu &&
      !navMenu.classList.contains("hidden")
    )
      closeMenu();
  })
);

/* ── handle viewport resize ───────────────── */
function onResize() {
  if (!navMenu) return;

  /* Desktop ≥ MOBILE_BP */
  if (innerWidth >= MOBILE_BP) {
    navMenu.classList.remove("hidden"); // keep top-bar visible
    applyMobileStyles(false); // strip mobile classes if any

    /* Mobile < MOBILE_BP */
  } else {
    if (navMenu.classList.contains("hidden")) {
      /* menu closed → keep mobile classes off */
      applyMobileStyles(false);
    } else {
      /* menu already open → ensure correct mobile styling */
      applyMobileStyles(true);
    }
  }
}
addEventListener("resize", onResize);
onResize(); // run once at load

/* ────────────────────────────────────────────
 * PROFILE overlay & tabs
 * ────────────────────────────────────────── */
const profile = $("#profile-overlay")!;
$("#nav-profile")?.addEventListener("click", () => {
  showOverlay(profile);
  updateUnderline();
});
$("#profile-close")?.addEventListener("click", () => hideOverlay(profile));
addEventListener("keydown", (e) => e.key === "Escape" && hideOverlay(profile));

$("#avatar-input")?.addEventListener("change", (ev) => {
  const f = (ev.currentTarget as HTMLInputElement).files?.[0];
  if (f) $<HTMLImageElement>("#avatar-img")!.src = URL.createObjectURL(f);
});

const tabBtns = document.querySelectorAll<HTMLButtonElement>(
  "#profile-tabs .tab-btn"
);
const panels = document.querySelectorAll<HTMLElement>("#tab-panels .panel");
const underline = $("#tab-underline")!;

tabBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    /* activate button */
    tabBtns.forEach((b) => {
      b.classList.toggle("text-white", b === btn);
      b.classList.toggle("text-white/70", b !== btn);
    });
    /* move underline */
    underline.style.width = `${btn.offsetWidth}px`;
    underline.style.transform = `translateX(${btn.offsetLeft}px)`;
    /* switch panel */
    panels.forEach((p) =>
      p.classList.toggle("hidden", p.dataset.panel !== btn.dataset.tab)
    );
    if (btn.dataset.tab === "stats") initStatsTab();
    if (btn.dataset.tab === "history") initHistoryTab();
  })
);
function updateUnderline() {
  const active = document.querySelector<HTMLButtonElement>(
    "#profile-tabs .tab-btn.text-white"
  );
  if (active) {
    underline.style.width = `${active.offsetWidth}px`;
    underline.style.transform = `translateX(${active.offsetLeft}px)`;
  }
}
addEventListener("resize", updateUnderline);

/* ────────────────────────────────────────────
 * Generic overlay helpers (used by Play → Difficulty)
 * ────────────────────────────────────────── */
function showOverlay(el: HTMLElement, inner?: HTMLElement) {
  el.classList.remove(
    "hidden",
    "opacity-0",
    "animate__fadeOut",
    "animate__animated"
  );
  if (inner) inner.classList.remove("scale-90");
  el.classList.add("opacity-0"); // start transparent
  requestAnimationFrame(() => {
    el.classList.add("animate__animated", "animate__fadeIn");
    el.classList.remove("opacity-0");
  });
}
function hideOverlay(el: HTMLElement, inner?: HTMLElement) {
  if (el.classList.contains("hidden")) return;
  el.classList.remove("animate__fadeIn");
  el.classList.add("animate__fadeOut");
  if (inner) inner.classList.add("scale-90");
  el.addEventListener(
    "animationend",
    () => {
      el.classList.add("hidden", "opacity-0");
      el.classList.remove("animate__animated", "animate__fadeOut");
    },
    { once: true }
  );
}

/* ────────────────────────────────────────────
 * PLAY → Difficulty flow
 * ────────────────────────────────────────── */
const playOverlay = $("#play-overlay")!;
$("#nav-play")?.addEventListener("click", () => showOverlay(playOverlay));
$("#play-close")?.addEventListener("click", () => hideOverlay(playOverlay));
addEventListener(
  "keydown",
  (e) => e.key === "Escape" && hideOverlay(playOverlay)
);

/* choose game mode */
document.querySelectorAll<HTMLButtonElement>(".mode-card").forEach((card) =>
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
  })
);

/* difficulty dialog */
const diffOv = $("#difficulty-overlay")!;
const diffBox = $("#difficulty-container")!;
$("#difficulty-close")?.addEventListener("click", () =>
  hideOverlay(diffOv, diffBox)
);
addEventListener(
  "keydown",
  (e) => e.key === "Escape" && hideOverlay(diffOv, diffBox)
);

/* choose difficulty */
document.querySelectorAll<HTMLButtonElement>(".diff-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    const diff = btn.dataset.diff as "easy" | "medium" | "hard";
    hideOverlay(diffOv, diffBox);

    const rate = diff === "easy" ? 1.0 : diff === "medium" ? 0.5 : 0.01;
    window.setAIRefresh(rate);
    window.setGameMode("ai");
  })
);
