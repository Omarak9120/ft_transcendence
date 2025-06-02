/**
 * Stats tab: rolling-year charts + trophy cabinet
 * (Chart.js is loaded globally via CDN in index.html)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const Chart: any;            // silence TS about global Chart

/* ───── mock vs real data switch ───── */
const USE_MOCK_DATA = true;          // ← set to false when API is ready
const API_URL       = "/api/stats/monthly-wins";

/* Twelve numbers in the rolling-year order (oldest → newest) */
const MOCK_WINS: number[] = [
  14,  7,  9, 11, 13,  8,
  10, 12,  6,  9, 15, 11
];

let loaded = false;                  // guard – init only once

export function initStatsTab(): void {
  if (loaded) return;
  loaded = true;

  drawMonthlyChart();   // async (fire-and-forget)
  drawLifePie();
  renderTrophies();
}

/* ───────────────────────────────────────────────────────── */
/* 1) Monthly average wins – last 12 months                  */
/* ───────────────────────────────────────────────────────── */

async function drawMonthlyChart(): Promise<void> {
  const labels = last12MonthLabels();          // ["Jul 2024", …, "Jun 2025"]
  const wins   = await fetchMonthlyWins(labels);

  new Chart(
    document.getElementById("monthly-chart") as HTMLCanvasElement,
    {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Avg wins",
            data: wins,
            backgroundColor: "rgba(252, 211, 77, 0.9)" // amber-300
          }
        ]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { color: "#fff" } },
          x: { ticks: { color: "#fff" } }
        }
      }
    }
  );
}

/* Build ["Jul 2024", "Aug 2024", …, "Jun 2025"] if today is Jun-2025 */
function last12MonthLabels(today: Date = new Date()): string[] {
  const opts = { month: "short", year: "numeric" } as const;
  const out: string[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    out.push(d.toLocaleString("en-US", opts));
  }
  return out;
}

/* Return wins in the same order as labels[] */
async function fetchMonthlyWins(labels: string[]): Promise<number[]> {
  /* —— MOCK MODE —— */
  if (USE_MOCK_DATA) return MOCK_WINS.slice(0, labels.length);

  /* —— API MODE —— */
  try {
    const res  = await fetch(API_URL, { credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as Record<string, number>; // { jan:15, … }

    return labels.map(lbl => {
      const short = lbl.slice(0, 3).toLowerCase();             // "May" → "may"
      return json[short] ?? 0;                                 // default 0
    });
  } catch (err) {
    console.warn("monthly-wins fetch failed – using zeros", err);
    return labels.map(() => 0);
  }
}

/* ───────────────────────────────────────────────────────── */
/* 2) Life-time wins vs losses pie                           */
/* ───────────────────────────────────────────────────────── */

function drawLifePie(): void {
  const lifeWins   = 69;     // TODO: replace with real data
  const lifeLosses = 31;

  new Chart(
    document.getElementById("life-chart") as HTMLCanvasElement,
    {
      type: "pie",
      data: {
        labels: ["Wins", "Losses"],
        datasets: [
          {
            data: [lifeWins, lifeLosses],
            backgroundColor: ["#4ade80", "#f87171"] // green / red
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            labels: { color: "#fff", boxWidth: 10, boxHeight: 10 }
          }
        }
      }
    }
  );
}

/* ───────────────────────────────────────────────────────── */
/* 3) Trophy total – fetched directly from backend           */
/* ───────────────────────────────────────────────────────── */

const TROPHY_API = "/api/users/me/trophies";   // ← change path if needed
const MOCK_TOTAL = 420;                        // demo number for mock mode

async function renderTrophies(): Promise<void> {
  const box = document.getElementById("trophies") as HTMLElement;
  box.innerHTML = "";                          // clear previous content

  /* — get total trophies — */
  let total = MOCK_TOTAL;

  if (!USE_MOCK_DATA) {
    try {
      const res = await fetch(TROPHY_API, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as { total: number };
      total = json.total ?? 0;
    } catch (err) {
      console.warn("trophy fetch failed – showing 0", err);
      total = 0;
    }
  }

  /* — render pretty single card — */
  const card = document.createElement("div");
  card.className =
    "flex flex-col items-center justify-center gap-2 p-6 " +
    "rounded-2xl bg-white/10 backdrop-blur border border-white/20";
  card.innerHTML = `
    <span class="text-6xl">🏆</span>
    <span class="text-4xl font-extrabold">${total}</span>
    <p class="text-sm text-white/70">Total trophies</p>
  `;
  box.appendChild(card);
}
