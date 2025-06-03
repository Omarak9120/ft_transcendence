/**
 * src/stats.ts  – Stats panel logic
 * ─────────────────────────────────────────────────────────
 * Uses Chart.js (loaded globally in index.html)
 */
/* ════════════════════════════════════════════════════════
   0) MOCK / LIVE SWITCH
   ════════════════════════════════════════════════════════ */
const USE_MOCK_DATA = true; // ← flip to false when backend is ready
/* ════════════════════════════════════════════════════════
   1) API ENDPOINTS  (adjust if backend differs)
   ════════════════════════════════════════════════════════ */
const API_WINS = "/api/stats/monthly-wins";
const API_GOALS_T = "/api/stats/goals";
const API_GOALS_M = "/api/stats/monthly-goals";
const API_STREAK = "/api/stats/win-streak";
const API_LONGEST = "/api/stats/longest-hit";
const API_TROPHY = "/api/users/me/trophies";
/* ════════════════════════════════════════════════════════
   2) MOCK DATA
   ════════════════════════════════════════════════════════ */
const MOCK_WINS = [14, 7, 9, 11, 13, 8, 10, 12, 6, 9, 15, 11];
const MOCK_GOALS_TOTAL = { scored: 120, conceded: 95 };
const MOCK_GOALS_MONTH = {
    scored: [10, 9, 8, 12, 11, 10, 13, 12, 9, 8, 15, 13],
    conceded: [7, 8, 6, 9, 8, 7, 9, 10, 7, 6, 11, 10]
};
const MOCK_STREAK = 7;
const MOCK_LONGEST = { longest: 37, opponent: "Karim" };
const MOCK_TROPHIES = 420;
/* ════════════════════════════════════════════════════════
   3) INIT
   ════════════════════════════════════════════════════════ */
let loaded = false;
export function initStatsTab() {
    if (loaded)
        return;
    loaded = true;
    drawMonthlyWins(); // bar
    drawLifePie(); // pie
    drawGoalsPie(); // pie
    drawMonthlyGoalsBars(); // grouped bars
    renderStreak(); // card
    renderLongestHit(); // card (with opponent)
    renderTrophies(); // card
}
/* ════════════════════════════════════════════════════════
   4) UTIL: last 12-month labels
   ════════════════════════════════════════════════════════ */
function last12MonthLabels(d = new Date()) {
    const fmt = { month: "short", year: "numeric" };
    return Array.from({ length: 12 }, (_, i) => {
        const dt = new Date(d.getFullYear(), d.getMonth() - 11 + i, 1);
        return dt.toLocaleString("en-US", fmt);
    });
}
/* UTIL: fetch array of numbers of exact length n */
async function fetchNums(url, n) {
    try {
        const r = await fetch(url, { credentials: "include" });
        if (!r.ok)
            throw new Error();
        const a = (await r.json());
        return Array.isArray(a) && a.length === n ? a : Array(n).fill(0);
    }
    catch (_a) {
        return Array(n).fill(0);
    }
}
/* ════════════════════════════════════════════════════════
   5) CHARTS
   ════════════════════════════════════════════════════════ */
/* 5-a  Monthly wins */
async function drawMonthlyWins() {
    const labels = last12MonthLabels();
    const data = USE_MOCK_DATA ? MOCK_WINS
        : await fetchNums(API_WINS, labels.length);
    new Chart(document.getElementById("monthly-chart"), {
        type: "bar",
        data: {
            labels,
            datasets: [{
                    label: "Avg wins",
                    data,
                    backgroundColor: "rgba(252,211,77,0.9)" // amber-300
                }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { color: "#fff" } },
                x: { ticks: { color: "#fff" } } }
        }
    });
}
/* 5-b  Lifetime wins vs losses pie */
function drawLifePie() {
    const wins = 69, losses = 31; // placeholder until backend ready
    new Chart(document.getElementById("life-chart"), {
        type: "pie",
        data: {
            labels: ["Wins", "Losses"],
            datasets: [{
                    data: [wins, losses],
                    backgroundColor: ["#4ade80", "#f87171"] // green / red
                }]
        },
        options: { plugins: { legend: { labels: { color: "#fff", boxWidth: 10 } } } }
    });
}
/* 5-c  Goals scored vs conceded (total) pie */
async function drawGoalsPie() {
    const g = USE_MOCK_DATA
        ? MOCK_GOALS_TOTAL
        : await fetch(API_GOALS_T, { credentials: "include" })
            .then(r => r.json()).catch(() => ({ scored: 0, conceded: 0 }));
    new Chart(document.getElementById("goals-chart"), {
        type: "pie",
        data: {
            labels: ["Scored", "Conceded"],
            datasets: [{
                    data: [g.scored, g.conceded],
                    backgroundColor: ["#38bdf8", "#f87171"] // cyan / red
                }]
        },
        options: { plugins: { legend: { labels: { color: "#fff", boxWidth: 10 } } } }
    });
}
/* 5-d  Monthly goals scored vs conceded (grouped bars) */
async function drawMonthlyGoalsBars() {
    const labels = last12MonthLabels();
    const dataObj = USE_MOCK_DATA
        ? MOCK_GOALS_MONTH
        : await fetch(API_GOALS_M, { credentials: "include" })
            .then(r => r.json())
            .catch(() => ({ scored: Array(12).fill(0), conceded: Array(12).fill(0) }));
    new Chart(document.getElementById("hits-chart"), // reuse canvas
    {
        type: "bar",
        data: {
            labels,
            datasets: [
                { label: "Scored",
                    data: dataObj.scored,
                    backgroundColor: "rgba(34,211,238,0.9)" }, // cyan-400
                { label: "Conceded",
                    data: dataObj.conceded,
                    backgroundColor: "rgba(248,113,113,0.9)" } // red-400
            ]
        },
        options: {
            plugins: { legend: { labels: { color: "#fff" } } },
            scales: { y: { beginAtZero: true, ticks: { color: "#fff" } },
                x: { ticks: { color: "#fff" } } }
        }
    });
}
/* ════════════════════════════════════════════════════════
   6) CARDS
   ════════════════════════════════════════════════════════ */
/* 6-a  Win-streak */
async function renderStreak() {
    const streak = USE_MOCK_DATA
        ? MOCK_STREAK
        : await fetch(API_STREAK, { credentials: "include" })
            .then(r => r.json()).then(j => { var _a; return (_a = j.streak) !== null && _a !== void 0 ? _a : 0; }).catch(() => 0);
    document.querySelector("#streak-card span").textContent =
        String(streak);
}
async function renderLongestHit() {
    var _a;
    const data = USE_MOCK_DATA
        ? MOCK_LONGEST
        : await fetch(API_LONGEST, { credentials: "include" })
            .then(r => r.json()).catch(() => ({ longest: 0, opponent: "—" }));
    document.querySelector("#longest-hit-card span").textContent =
        String(data.longest);
    document.getElementById("longest-opponent").textContent =
        `vs ${(_a = data.opponent) !== null && _a !== void 0 ? _a : "—"}`;
}
/* 6-c  Trophy total */
async function renderTrophies() {
    const total = USE_MOCK_DATA
        ? MOCK_TROPHIES
        : await fetch(API_TROPHY, { credentials: "include" })
            .then(r => r.json()).then(j => { var _a; return (_a = j.total) !== null && _a !== void 0 ? _a : 0; }).catch(() => 0);
    document.getElementById("trophies").innerHTML = `
    <div class="flex flex-col items-center justify-center gap-2 p-6
                rounded-2xl bg-white/10 backdrop-blur border border-white/20">
      <span class="text-6xl">🏆</span>
      <span class="text-4xl font-extrabold">${total}</span>
      <p class="text-sm text-white/70">Total trophies</p>
    </div>`;
}
