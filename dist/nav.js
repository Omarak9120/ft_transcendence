/**
 * nav.ts – SPA navbar & overlays
 * Strict-mode TypeScript
 */
var _a, _b, _c, _d, _e, _f;
import { initStatsTab } from "./stats.js";
import { initHistoryTab } from "./history.js";
/* Typed querySelector helper */
const $ = (sel) => document.querySelector(sel);
/* ── burger (mobile) ───────────────────────────────── */
(_a = $("#burger")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    var _a;
    (_a = $("#nav-menu")) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
});
/* ── overlay show / hide helpers ───────────────────── */
const show = (el) => {
    el.classList.remove("hidden");
    requestAnimationFrame(() => el.classList.remove("opacity-0"));
};
const hide = (el) => {
    el.classList.add("opacity-0");
    setTimeout(() => el.classList.add("hidden"), 300);
};
/* ── PROFILE overlay ───────────────────────────────── */
const profile = $("#profile-overlay");
(_b = $("#nav-profile")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { show(profile); syncUnderline(); });
(_c = $("#profile-close")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => hide(profile));
/* ── PLAY overlay ─────────────────────────────────── */
const play = $("#play-overlay");
(_d = $("#nav-play")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => show(play));
(_e = $("#play-close")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => hide(play));
/* Esc closes any open overlay */
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        hide(profile);
        hide(play);
    }
});
/* ── avatar preview ───────────────────────────────── */
(_f = $("#avatar-input")) === null || _f === void 0 ? void 0 : _f.addEventListener("change", (ev) => {
    var _a;
    const f = (_a = ev.currentTarget.files) === null || _a === void 0 ? void 0 : _a[0];
    if (f)
        ($("#avatar-img")).src = URL.createObjectURL(f);
});
/* ── tabs + sliding underline ─────────────────────── */
const tabs = document.querySelectorAll("#profile-tabs .tab-btn");
const panels = document.querySelectorAll("#tab-panels .panel");
const line = $("#tab-underline");
tabs.forEach((btn) => btn.addEventListener("click", () => {
    tabs.forEach((b) => {
        b.classList.toggle("text-white", b === btn);
        b.classList.toggle("text-white/70", b !== btn);
    });
    line.style.width = `${btn.offsetWidth}px`;
    line.style.transform = `translateX(${btn.offsetLeft}px)`;
    panels.forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== btn.dataset.tab));
    if (btn.dataset.tab === "stats")
        initStatsTab();
    if (btn.dataset.tab === "history")
        initHistoryTab();
}));
function syncUnderline() {
    const active = document.querySelector("#profile-tabs .tab-btn.text-white");
    if (active) {
        line.style.width = `${active.offsetWidth}px`;
        line.style.transform = `translateX(${active.offsetLeft}px)`;
    }
}
window.addEventListener("resize", syncUnderline);
/* ── Play-mode cards ───────────────────────────────── */
document.querySelectorAll(".mode-card").forEach((card) => {
    card.addEventListener("click", () => {
        const mode = card.dataset.mode;
        hide(play); // close the pop-up
        if (mode === "ai")
            window.setGameMode("ai");
        else if (mode === "offline")
            window.setGameMode("pvp");
        else
            alert(`Mode "${mode}" coming soon!`);
    });
});
