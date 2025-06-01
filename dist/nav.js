/**
 * nav.ts
 * ─────────────────────────────────────────────────────────
 * ▸ mobile burger toggle
 * ▸ profile overlay (fade-in / fade-out)
 * ▸ avatar upload preview
 * ▸ tab switcher with sliding underline
 * ▸ lazy-initialises:
 *      – Stats charts / trophies  (first time “Stats”)
 *      – History table rows       (first time “History”)
 */
import { initStatsTab } from "./stats.js";
import { initHistoryTab } from "./history.js";
/* ─────────────────────────────────────────────────────────
   Burger menu (small screens)
   ───────────────────────────────────────────────────────── */
const burger = document.getElementById("burger");
const menu = document.getElementById("nav-menu");
burger === null || burger === void 0 ? void 0 : burger.addEventListener("click", () => menu === null || menu === void 0 ? void 0 : menu.classList.toggle("hidden"));
/* ─────────────────────────────────────────────────────────
   Profile overlay – fade-in / fade-out
   ───────────────────────────────────────────────────────── */
const profileLink = document.getElementById("nav-profile");
const profileOverlay = document.getElementById("profile-overlay");
const profileClose = document.getElementById("profile-close");
function openProfile(e) {
    e === null || e === void 0 ? void 0 : e.preventDefault();
    if (!profileOverlay)
        return;
    // 1) show (still transparent)
    profileOverlay.classList.remove("hidden");
    // 2) next paint → remove opacity-0 to fade in
    requestAnimationFrame(() => profileOverlay.classList.remove("opacity-0"));
    // underline under active tab
    const activeBtn = document.querySelector("#profile-tabs .tab-btn.text-white");
    if (activeBtn)
        moveUnderline(activeBtn);
}
function closeProfile() {
    if (!profileOverlay)
        return;
    // 1) fade out
    profileOverlay.classList.add("opacity-0");
    // 2) after transition, hide fully
    setTimeout(() => profileOverlay.classList.add("hidden"), 300);
}
profileLink === null || profileLink === void 0 ? void 0 : profileLink.addEventListener("click", openProfile);
profileClose === null || profileClose === void 0 ? void 0 : profileClose.addEventListener("click", closeProfile);
window.addEventListener("keydown", (e) => e.key === "Escape" && closeProfile());
/* ─────────────────────────────────────────────────────────
   Avatar upload preview
   ───────────────────────────────────────────────────────── */
const avatarInput = document.getElementById("avatar-input");
const avatarImg = document.getElementById("avatar-img");
avatarInput === null || avatarInput === void 0 ? void 0 : avatarInput.addEventListener("change", () => {
    var _a;
    if (!((_a = avatarInput.files) === null || _a === void 0 ? void 0 : _a.length))
        return;
    const file = avatarInput.files[0];
    avatarImg.src = URL.createObjectURL(file);
});
/* ─────────────────────────────────────────────────────────
   Tabs + sliding underline
   ───────────────────────────────────────────────────────── */
const tabBtns = document.querySelectorAll("#profile-tabs .tab-btn");
const panels = document.querySelectorAll("#tab-panels .panel");
const underline = document.getElementById("tab-underline");
function moveUnderline(btn) {
    if (!underline)
        return;
    underline.style.width = `${btn.offsetWidth}px`;
    underline.style.transform = `translateX(${btn.offsetLeft}px)`;
}
tabBtns.forEach((btn) => btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    // underline animation
    moveUnderline(btn);
    // active / inactive colours
    tabBtns.forEach((b) => {
        b.classList.toggle("text-white", b === btn);
        b.classList.toggle("text-white/70", b !== btn);
    });
    // show / hide panels
    panels.forEach((p) => p.classList.toggle("hidden", p.dataset.panel !== target));
    // lazy-initialise heavy panels
    if (target === "stats")
        initStatsTab();
    if (target === "history")
        initHistoryTab();
}));
// keep underline aligned on resize
window.addEventListener("resize", () => {
    const activeBtn = document.querySelector("#profile-tabs .tab-btn.text-white");
    if (activeBtn)
        moveUnderline(activeBtn);
});
