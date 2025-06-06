/**
 * nav.ts – SPA navbar, overlays, tabs, “Play → Difficulty” logic
 * Strict-mode TypeScript
 */
var _a, _b, _c, _d, _e, _f, _g, _h;
import { initStatsTab } from "./stats.js";
import { initHistoryTab } from "./history.js";
/* ── shorthand for querySelector ───────────────── */
const $ = (sel) => document.querySelector(sel);
/* grab nav-menu once so we reuse it everywhere */
const navMenu = $("#nav-menu");
/* ── breakpoints & helper lists ────────────────── */
const MOBILE_BP = 640;
/**
 * Tailwind classes applied **only** while the burger-menu is open
 * below the `sm` breakpoint.  The two “inset” classes make the
 * dropdown span the entire viewport width, centred under the bar.
 */
const MOBILE_DROPDOWN = [
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
function setMobileDropdown(enabled) {
    if (!navMenu)
        return;
    MOBILE_DROPDOWN.forEach((cls) => navMenu.classList[enabled ? "add" : "remove"](cls));
}
/* ── handle resize so the menu never gets “stuck” ── */
function onResize() {
    if (!navMenu)
        return;
    if (window.innerWidth >= MOBILE_BP) {
        /* back to desktop: always visible & horizontal */
        navMenu.classList.remove("hidden");
        setMobileDropdown(false);
    }
    else {
        /* back to mobile: keep dropdown classes only while open */
        if (navMenu.classList.contains("hidden"))
            setMobileDropdown(false);
    }
}
window.addEventListener("resize", onResize);
onResize(); // run immediately
/* ── burger-menu toggle ─────────────────────────── */
(_a = $("#burger")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    if (!navMenu)
        return;
    const willOpen = navMenu.classList.contains("hidden");
    navMenu.classList.toggle("hidden");
    if (window.innerWidth < MOBILE_BP)
        setMobileDropdown(willOpen);
});
/* auto-close dropdown after any link tap on mobile */
navMenu === null || navMenu === void 0 ? void 0 : navMenu.querySelectorAll("button").forEach((btn) => btn.addEventListener("click", () => {
    var _a;
    if (window.innerWidth < MOBILE_BP &&
        !navMenu.classList.contains("hidden")) {
        (_a = $("#burger")) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new Event("click"));
    }
}));

/* ── SIGN-OUT button — stub ─────────────────────── */
(_b = $("#nav-signout")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", async () => {
    alert("gonfle le");
});
/* ── small helpers for the various overlays ─────── */
function showOverlay(el, inner) {
    el.classList.remove("hidden");
    requestAnimationFrame(() => {
        el.classList.remove("opacity-0");
        if (inner)
            inner.classList.remove("scale-90");
    });
}
function hideOverlay(el, inner) {
    if (inner)
        inner.classList.add("scale-90");
    el.classList.add("opacity-0");
    setTimeout(() => el.classList.add("hidden"), 300);
}
/* ─────────────────────────────────────────────── *
 * Everything below here is unchanged
 * (tabs, profile overlay, play dialogs, etc.)
 * ─────────────────────────────────────────────── */
const profile = $("#profile-overlay");
(_c = $("#nav-profile")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
    showOverlay(profile);
    repositionUnderline();
});
(_d = $("#profile-close")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => hideOverlay(profile));
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
        hideOverlay(profile);
});
(_e = $("#avatar-input")) === null || _e === void 0 ? void 0 : _e.addEventListener("change", (ev) => {
    var _a;
    const f = (_a = ev.currentTarget.files) === null || _a === void 0 ? void 0 : _a[0];
    if (f)
        $("#avatar-img").src = URL.createObjectURL(f);
});
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
const playOverlay = $("#play-overlay");
(_f = $("#nav-play")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => showOverlay(playOverlay));
(_g = $("#play-close")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", () => hideOverlay(playOverlay));
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
        hideOverlay(playOverlay);
});
document.querySelectorAll(".mode-card").forEach((card) => {
    card.addEventListener("click", () => {
        const mode = card.dataset.mode;
        hideOverlay(playOverlay);
        if (mode === "ai") {
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
const diffOverlay = $("#difficulty-overlay");
const diffContainer = $("#difficulty-container");
(_h = $("#difficulty-close")) === null || _h === void 0 ? void 0 : _h.addEventListener("click", () => hideOverlay(diffOverlay, diffContainer));
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape")
        hideOverlay(diffOverlay, diffContainer);
});
document.querySelectorAll(".diff-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const diff = btn.dataset.diff;
        hideOverlay(diffOverlay, diffContainer);
        const rate = diff === "easy" ? 1.0 : diff === "medium" ? 0.5 : 0.01;
        window.setAIRefresh(rate);
        window.setGameMode("ai");
    });
});
