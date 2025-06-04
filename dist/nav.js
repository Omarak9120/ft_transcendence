/**
 * nav.ts – SPA navbar, overlays, tabs, “Play → Difficulty” logic
 * Strict-mode TypeScript
 */
var _a, _b, _c, _d, _e, _f, _g;
import { initStatsTab } from "./stats.js";
import { initHistoryTab } from "./history.js";
/* ── shorthand for querySelector ───────────────── */
const $ = (sel) => document.querySelector(sel);
/* ── burger menu ───────────────────────────────── */
(_a = $("#burger")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    var _a;
    (_a = $("#nav-menu")) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
});
/* ── show/hide utility for overlays ────────────── */
function showOverlay(el, container) {
    el.classList.remove("hidden");
    requestAnimationFrame(() => {
        el.classList.remove("opacity-0");
        if (container)
            container.classList.remove("scale-90");
    });
}
function hideOverlay(el, container) {
    if (container)
        container.classList.add("scale-90");
    el.classList.add("opacity-0");
    setTimeout(() => el.classList.add("hidden"), 300);
}
/* ── PROFILE overlay ───────────────────────────── */
const profile = $("#profile-overlay");
(_b = $("#nav-profile")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
    showOverlay(profile);
    repositionUnderline();
});
(_c = $("#profile-close")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    hideOverlay(profile);
});
/* Close profile if ESC pressed */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        hideOverlay(profile);
    }
});
/* ── avatar preview ───────────────────────────── */
(_d = $("#avatar-input")) === null || _d === void 0 ? void 0 : _d.addEventListener("change", (ev) => {
    var _a;
    const f = (_a = ev.currentTarget.files) === null || _a === void 0 ? void 0 : _a[0];
    if (f) {
        ($("#avatar-img")).src = URL.createObjectURL(f);
    }
});
/* ── PROFILE tabs & sliding underline ─────────── */
const tabBtns = document.querySelectorAll("#profile-tabs .tab-btn");
const panels = document.querySelectorAll("#tab-panels .panel");
const line = $("#tab-underline");
tabBtns.forEach((btn) => btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    tabBtns.forEach((b) => {
        b.classList.toggle("text-white", b === btn);
        b.classList.toggle("text-white/70", b !== btn);
    });
    line.style.width = `${btn.offsetWidth}px`;
    line.style.transform = `translateX(${btn.offsetLeft}px)`;
    panels.forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== target));
    if (target === "stats")
        initStatsTab();
    if (target === "history")
        initHistoryTab();
}));
function repositionUnderline() {
    const active = document.querySelector("#profile-tabs .tab-btn.text-white");
    if (active) {
        line.style.width = `${active.offsetWidth}px`;
        line.style.transform = `translateX(${active.offsetLeft}px)`;
    }
}
window.addEventListener("resize", repositionUnderline);
/* ── PLAY overlay ─────────────────────────────── */
const playOverlay = $("#play-overlay");
(_e = $("#nav-play")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
    showOverlay(playOverlay);
});
(_f = $("#play-close")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => {
    hideOverlay(playOverlay);
});
/* pressing ESC hides Play too */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        hideOverlay(playOverlay);
    }
});
/* ── clicking a mode-card inside the Play pop-up ─ */
document.querySelectorAll(".mode-card").forEach((card) => {
    card.addEventListener("click", () => {
        const mode = card.dataset.mode;
        hideOverlay(playOverlay);
        if (mode === "ai") {
            // Show the difficulty pop-up
            showOverlay($("#difficulty-overlay"), $("#difficulty-container"));
        }
        else if (mode === "offline") {
            window.setGameMode("pvp");
        }
        else {
            alert(`Mode “${mode}” coming soon!`);
        }
    });
});
/* ── Difficulty pop-up close ───────────────────── */
const diffOverlay = $("#difficulty-overlay");
const diffContainer = $("#difficulty-container");
(_g = $("#difficulty-close")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", () => {
    hideOverlay(diffOverlay, diffContainer);
});
/* ESC hides difficulty pop-up as well */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        hideOverlay(diffOverlay, diffContainer);
    }
});
/* ── click on one of the three difficulty buttons ─ */
document.querySelectorAll(".diff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const diff = btn.dataset.diff;
        hideOverlay(diffOverlay, diffContainer);
        let refreshRate;
        if (diff === "easy")
            refreshRate = 1.0;
        else if (diff === "medium")
            refreshRate = 0.5;
        else
            refreshRate = 0.01;
        window.setAIRefresh(refreshRate);
        window.setGameMode("ai");
    });
});
