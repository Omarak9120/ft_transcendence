/**
 * stats.ts – all graphs & cards in the Stats tab
 * 100 % strict-mode types
 */
/* ───── mock toggle ───── */
const USE_MOCK_DATA = true;
/* ───── endpoints ───── */
const ENDPOINT = {
    winsMonth: "/api/stats/monthly-wins",
    winsTotal: "/api/stats/wins",
    goalsTotal: "/api/stats/goals",
    goalsMonth: "/api/stats/monthly-goals",
    streak: "/api/stats/win-streak",
    longest: "/api/stats/longest-hit",
    trophy: "/api/users/me/trophies"
};
/* ───── mock payloads ───── */
const MOCK = {
    winsMonth: [14, 7, 9, 11, 13, 8, 10, 12, 6, 9, 15, 11],
    winsTotal: { wins: 69, losses: 31 },
    goalsTotal: { scored: 120, conceded: 95 },
    goalsMonth: {
        scored: [10, 9, 8, 12, 11, 10, 13, 12, 9, 8, 15, 13],
        conceded: [7, 8, 6, 9, 8, 7, 9, 10, 7, 6, 11, 10]
    },
    streak: { streak: 7 },
    longest: { longest: 37, opponent: "Karim" },
    trophy: { total: 420 }
};
/* ───── init guard ───── */
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
    renderLongestHit();
    renderTrophies();
}
function last12Labels(d = new Date()) {
    return Array.from({ length: 12 }, (_, i) => new Date(d.getFullYear(), d.getMonth() - 11 + i, 1)
        .toLocaleString("en-US", { month: "short", year: "numeric" }));
}
async function fetchJSON(url) {
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok)
        throw new Error(String(r.status));
    return r.json();
}
/* ═════════ 1) Monthly wins bar ════════ */
async function drawMonthlyWins() {
    const labels = last12Labels();
    const data = USE_MOCK_DATA
        ? MOCK.winsMonth
        : await fetchJSON(ENDPOINT.winsMonth).catch(() => labels.map(() => 0));
    new Chart(document.getElementById("monthly-chart"), { type: "bar",
        data: { labels,
            datasets: [{ label: "Avg wins", data,
                    backgroundColor: "rgba(252,211,77,0.9)" }] },
        options: { plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { color: "#fff" } },
                x: { ticks: { color: "#fff" } } } }
    });
}
/* ═════════ 2) Life wins vs losses pie ════════ */
async function drawLifePie() {
    const t = USE_MOCK_DATA
        ? MOCK.winsTotal
        : await fetchJSON(ENDPOINT.winsTotal).catch(() => ({ wins: 0, losses: 0 }));
    new Chart(document.getElementById("life-chart"), { type: "pie",
        data: { labels: ["Wins", "Losses"],
            datasets: [{ data: [t.wins, t.losses],
                    backgroundColor: ["#4ade80", "#f87171"] }] },
        options: { plugins: { legend: { labels: { color: "#fff", boxWidth: 10 } } } }
    });
}
/* ═════════ 3) Total goals pie ════════ */
async function drawGoalsPie() {
    const g = USE_MOCK_DATA
        ? MOCK.goalsTotal
        : await fetchJSON(ENDPOINT.goalsTotal).catch(() => ({ scored: 0, conceded: 0 }));
    new Chart(document.getElementById("goals-chart"), { type: "pie",
        data: { labels: ["Scored", "Conceded"],
            datasets: [{ data: [g.scored, g.conceded],
                    backgroundColor: ["#38bdf8", "#f87171"] }] },
        options: { plugins: { legend: { labels: { color: "#fff", boxWidth: 10 } } } }
    });
}
/* ═════════ 4) Monthly goals grouped bars ════════ */
async function drawMonthlyGoalsBars() {
    const labels = last12Labels();
    const m = USE_MOCK_DATA
        ? MOCK.goalsMonth
        : await fetchJSON(ENDPOINT.goalsMonth)
            .catch(() => ({ scored: Array(12).fill(0), conceded: Array(12).fill(0) }));
    new Chart(document.getElementById("hits-chart"), { type: "bar",
        data: { labels,
            datasets: [
                { label: "Scored", data: m.scored,
                    backgroundColor: "rgba(34,211,238,0.9)" },
                { label: "Conceded", data: m.conceded,
                    backgroundColor: "rgba(248,113,113,0.9)" }
            ] },
        options: { plugins: { legend: { labels: { color: "#fff" } } },
            scales: { y: { beginAtZero: true, ticks: { color: "#fff" } },
                x: { ticks: { color: "#fff" } } } }
    });
}
/* ═════════ 5) Cards ════════ */
function setCardText(sel, txt) {
    document.querySelector(sel).textContent = txt;
}
/* 5-a win streak */
async function renderStreak() {
    const s = USE_MOCK_DATA
        ? MOCK.streak.streak
        : await fetchJSON(ENDPOINT.streak).then(d => d.streak).catch(() => 0);
    setCardText("#streak-card span", String(s));
}
/* 5-b longest hit */
async function renderLongestHit() {
    const d = USE_MOCK_DATA
        ? MOCK.longest
        : await fetchJSON(ENDPOINT.longest).catch(() => ({ longest: 0, opponent: "—" }));
    setCardText("#longest-hit-card span", String(d.longest));
    setCardText("#longest-opponent", `vs ${d.opponent}`);
}
/* 5-c trophies */
async function renderTrophies() {
    const t = USE_MOCK_DATA
        ? MOCK.trophy.total
        : await fetchJSON(ENDPOINT.trophy).then(d => d.total).catch(() => 0);
    document.getElementById("trophies").innerHTML = `
    <div class="flex flex-col items-center justify-center gap-2 p-6
                rounded-2xl bg-white/10 backdrop-blur border border-white/20">
      <span class="text-6xl">🏆</span>
      <span class="text-4xl font-extrabold">${t}</span>
      <p class="text-sm text-white/70">Total trophies</p>
    </div>`;
}
