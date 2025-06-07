/**
 * stats.ts – all graphs & cards in the Stats tab
 * Strict-mode TypeScript
 */
/* toggle mock data */
const USE_MOCK_DATA = false;
/* base URL */
const API_BASE = "http://localhost:3000";
/* REST endpoints */
const ENDPOINT = {
    winsMonth: `${API_BASE}/api/stats/monthly-wins`,
    winsTotal: `${API_BASE}/api/stats/wins`,
    goalsTotal: `${API_BASE}/api/stats/goals`,
    goalsMonth: `${API_BASE}/api/stats/monthly-goals`,
    streak: `${API_BASE}/api/stats/win-streak`,
    longest: `${API_BASE}/api/stats/longest-hit`,
    trophy: `${API_BASE}/api/users/me/trophies`,
};
/* mock payloads (optional offline mode) */
const MOCK = {
    winsMonth: [14, 7, 9, 11, 13, 8, 10, 12, 6, 9, 15, 11],
    winsTotal: { wins: 69, losses: 31 },
    goalsTotal: { scored: 120, conceded: 95 },
    goalsMonth: {
        scored: [10, 9, 8, 12, 11, 10, 13, 12, 9, 8, 15, 13],
        conceded: [7, 8, 6, 9, 8, 7, 9, 10, 7, 6, 11, 10],
    },
    streak: { streak: 7 },
    longest: { longest: 37, opponent: "Karim" },
    trophy: { total: 420 },
};
/* one-time init guard */
let loaded = false;
export function initStatsTab() {
    if (loaded)
        return;
    loaded = true;
    drawMonthlyWins();
    drawLifePie();
    drawGoalsPie();
    drawMonthlyGoalsBars();
    renderStreak();
    renderTrophies();
}
/* ───── helpers ───── */
function last12Labels(d = new Date()) {
    return Array.from({ length: 12 }, (_, i) => new Date(d.getFullYear(), d.getMonth() - 11 + i, 1).toLocaleString("en-US", { month: "short", year: "numeric" }));
}
async function fetchJSON(url) {
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok)
        throw new Error(String(r.status));
    return (await r.json());
}
/* 1) Monthly win-rate bar */
async function drawMonthlyWins() {
    const labels = last12Labels();
    const raw = USE_MOCK_DATA
        ? labels.map((_, i) => {
            var _a;
            return ({
                month: labels[i].slice(0, 3),
                winRate: (_a = MOCK.winsMonth[i]) !== null && _a !== void 0 ? _a : 0,
            });
        })
        : await fetchJSON(ENDPOINT.winsMonth).catch(() => []);
    const dict = {};
    for (const r of raw)
        dict[r.month] = r.winRate;
    const data = labels.map((lbl) => { var _a; return (_a = dict[lbl.slice(0, 3)]) !== null && _a !== void 0 ? _a : 0; });
    new Chart(document.getElementById("monthly-chart"), {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Win rate (%)",
                    data,
                    backgroundColor: "rgba(252,211,77,0.9)",
                },
            ],
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, ticks: { color: "#fff" } },
                x: { ticks: { color: "#fff" } },
            },
        },
    });
}
/* 2) Life-time wins vs losses pie */
async function drawLifePie() {
    const t = USE_MOCK_DATA
        ? MOCK.winsTotal
        : await fetchJSON(ENDPOINT.winsTotal).catch(() => ({
            wins: 0,
            losses: 0,
        }));
    new Chart(document.getElementById("life-chart"), {
        type: "pie",
        data: {
            labels: ["Wins", "Losses"],
            datasets: [
                {
                    data: [t.wins, t.losses],
                    backgroundColor: ["#4ade80", "#f87171"],
                },
            ],
        },
        options: {
            plugins: { legend: { labels: { color: "#fff", boxWidth: 10 } } },
        },
    });
}
/* 3) Total goals pie */
async function drawGoalsPie() {
    const g = USE_MOCK_DATA
        ? MOCK.goalsTotal
        : await fetchJSON(ENDPOINT.goalsTotal).catch(() => ({
            scored: 0,
            conceded: 0,
        }));
    new Chart(document.getElementById("goals-chart"), {
        type: "pie",
        data: {
            labels: ["Scored", "Conceded"],
            datasets: [
                {
                    data: [g.scored, g.conceded],
                    backgroundColor: ["#38bdf8", "#f87171"],
                },
            ],
        },
        options: {
            plugins: { legend: { labels: { color: "#fff", boxWidth: 10 } } },
        },
    });
}
/* 4) Monthly goals scored vs conceded bars */
async function drawMonthlyGoalsBars() {
    const labels = last12Labels();
    const raw = USE_MOCK_DATA
        ? labels.map((_, i) => {
            var _a, _b;
            return ({
                month: labels[i].slice(0, 3),
                scored: (_a = MOCK.goalsMonth.scored[i]) !== null && _a !== void 0 ? _a : 0,
                conceded: (_b = MOCK.goalsMonth.conceded[i]) !== null && _b !== void 0 ? _b : 0,
            });
        })
        : await fetchJSON(ENDPOINT.goalsMonth).catch(() => []);
    const scoredDict = {};
    const concDict = {};
    for (const r of raw) {
        scoredDict[r.month] = r.scored;
        concDict[r.month] = r.conceded;
    }
    const scored = labels.map((lbl) => { var _a; return (_a = scoredDict[lbl.slice(0, 3)]) !== null && _a !== void 0 ? _a : 0; });
    const conceded = labels.map((lbl) => { var _a; return (_a = concDict[lbl.slice(0, 3)]) !== null && _a !== void 0 ? _a : 0; });
    new Chart(document.getElementById("hits-chart"), {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Scored",
                    data: scored,
                    backgroundColor: "rgba(34,211,238,0.9)",
                },
                {
                    label: "Conceded",
                    data: conceded,
                    backgroundColor: "rgba(248,113,113,0.9)",
                },
            ],
        },
        options: {
            plugins: { legend: { labels: { color: "#fff" } } },
            scales: {
                y: { beginAtZero: true, ticks: { color: "#fff" } },
                x: { ticks: { color: "#fff" } },
            },
        },
    });
}
/* 5) Cards – streak + trophies only */
function setCardText(sel, txt) {
    const el = document.querySelector(sel);
    if (el)
        el.textContent = txt;
}
/* 5-a  current win-streak */
async function renderStreak() {
    const streak = USE_MOCK_DATA
        ? MOCK.streak.streak
        : await fetchJSON(ENDPOINT.streak)
            .then((d) => d.streak)
            .catch(() => 0);
    setCardText("#streak-card span", String(streak));
}
/* 5-b  total trophies */
async function renderTrophies() {
    const total = USE_MOCK_DATA
        ? MOCK.trophy.total
        : await fetchJSON(ENDPOINT.trophy)
            .then((d) => d.total)
            .catch(() => 0);
    document.getElementById("trophies").innerHTML = `
    <div class="flex flex-col items-center justify-center gap-2 p-6
                rounded-2xl bg-white/10 backdrop-blur border border-white/20">
      <span class="text-6xl">🏆</span>
      <span class="text-4xl font-extrabold">${total}</span>
      <p class="text-sm text-white/70">Total trophies</p>
    </div>`;
}
