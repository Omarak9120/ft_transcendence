/**
 * src/stats.ts  – Stats panel logic
 * (Chart.js is loaded globally via CDN in index.html)
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const Chart: any;

/* ═════════ 0) Mock / live switch ═════════ */
const USE_MOCK_DATA = true;                // flip to false with live backend

/* ═════════ 1) Endpoints ═════════ */
const API_WINS_MONTH  = "/api/stats/monthly-wins";
const API_WINS_TOTAL  = "/api/stats/wins";           // NEW ← life wins vs losses
const API_GOALS_TOTAL = "/api/stats/goals";
const API_GOALS_MONTH = "/api/stats/monthly-goals";
const API_STREAK      = "/api/stats/win-streak";
const API_LONGEST     = "/api/stats/longest-hit";
const API_TROPHY      = "/api/users/me/trophies";

/* ═════════ 2) Mock data ═════════ */
const MOCK_WINS_MONTH   = [14,7,9,11,13,8,10,12,6,9,15,11];
const MOCK_WINS_TOTAL   = { wins: 69, losses: 31 };   // NEW
const MOCK_GOALS_TOTAL  = { scored: 120, conceded: 95 };
const MOCK_GOALS_MONTH  = {
  scored:    [10,9,8,12,11,10,13,12,9,8,15,13],
  conceded:  [ 7,8,6, 9, 8, 7, 9,10,7,6,11,10]
};
const MOCK_STREAK       = 7;
const MOCK_LONGEST      = { longest: 37, opponent: "Karim" };
const MOCK_TROPHIES     = 420;

/* ═════════ 3) Init guard ═════════ */
let loaded = false;
export function initStatsTab(): void {
  if (loaded) return;
  loaded = true;

  drawMonthlyWins();
  drawLifePie();            // now API-driven
  drawGoalsPie();
  drawMonthlyGoalsBars();
  renderStreak();
  renderLongestHit();
  renderTrophies();
}

/* ═════════ helpers ═════════ */
function last12MonthLabels(d: Date = new Date()): string[] {
  const fmt = { month: "short", year: "numeric" } as const;
  return Array.from({ length: 12 }, (_, i) => {
    const dt = new Date(d.getFullYear(), d.getMonth() - 11 + i, 1);
    return dt.toLocaleString("en-US", fmt);
  });
}
async function fetchNums(url: string, n: number): Promise<number[]> {
  try {
    const r = await fetch(url, { credentials: "include" });
    const a = (await r.json()) as number[];
    return Array.isArray(a) && a.length === n ? a : Array(n).fill(0);
  } catch { return Array(n).fill(0); }
}

/* ═════════ 4-a) Monthly wins bar ═════════ */
async function drawMonthlyWins(): Promise<void> {
  const labels = last12MonthLabels();
  const data   = USE_MOCK_DATA ? MOCK_WINS_MONTH
                               : await fetchNums(API_WINS_MONTH, labels.length);

  new Chart(
    document.getElementById("monthly-chart") as HTMLCanvasElement,
    { type:"bar",
      data:{ labels,
        datasets:[{ label:"Avg wins", data,
                    backgroundColor:"rgba(252,211,77,0.9)"}] },
      options:{ plugins:{ legend:{ display:false }},
                scales:{ y:{ beginAtZero:true, ticks:{ color:"#fff" }},
                         x:{ ticks:{ color:"#fff" }} } } }
  );
}

/* ═════════ 4-b) Life wins vs losses pie  (API) ═════════ */
async function drawLifePie(): Promise<void> {
  const t = USE_MOCK_DATA
    ? MOCK_WINS_TOTAL
    : await fetch(API_WINS_TOTAL, { credentials:"include" })
        .then(r=>r.json())
        .catch(()=>({ wins:0, losses:0 }));

  new Chart(
    document.getElementById("life-chart") as HTMLCanvasElement,
    { type:"pie",
      data:{ labels:["Wins","Losses"],
        datasets:[{ data:[t.wins, t.losses],
                    backgroundColor:["#4ade80","#f87171"] }] },
      options:{ plugins:{ legend:{ labels:{ color:"#fff", boxWidth:10 } } } }
    }
  );
}

/* ═════════ 4-c) Goals pie (total) ═════════ */
async function drawGoalsPie(): Promise<void> {
  const g = USE_MOCK_DATA ? MOCK_GOALS_TOTAL
    : await fetch(API_GOALS_TOTAL,{credentials:"include"})
        .then(r=>r.json()).catch(()=>({ scored:0, conceded:0 }));

  new Chart(
    document.getElementById("goals-chart") as HTMLCanvasElement,
    { type:"pie",
      data:{ labels:["Scored","Conceded"],
        datasets:[{ data:[g.scored,g.conceded],
                    backgroundColor:["#38bdf8","#f87171"] }] },
      options:{ plugins:{ legend:{ labels:{ color:"#fff", boxWidth:10 } } } }
    }
  );
}

/* ═════════ 4-d) Monthly goals grouped bars ═════════ */
async function drawMonthlyGoalsBars(): Promise<void> {
  const labels = last12MonthLabels();
  const d = USE_MOCK_DATA ? MOCK_GOALS_MONTH
    : await fetch(API_GOALS_MONTH,{credentials:"include"})
        .then(r=>r.json())
        .catch(()=>({ scored:Array(12).fill(0), conceded:Array(12).fill(0) }));

  new Chart(
    document.getElementById("hits-chart") as HTMLCanvasElement,
    { type:"bar",
      data:{ labels,
        datasets:[
          { label:"Scored",   data:d.scored,
            backgroundColor:"rgba(34,211,238,0.9)" },
          { label:"Conceded", data:d.conceded,
            backgroundColor:"rgba(248,113,113,0.9)" }
        ] },
      options:{ plugins:{ legend:{ labels:{ color:"#fff" } } },
        scales:{ y:{ beginAtZero:true, ticks:{ color:"#fff" }},
                 x:{ ticks:{ color:"#fff" }} } }
    }
  );
}

/* ═════════ 5-a) Win-streak card ═════════ */
async function renderStreak(): Promise<void> {
  const s = USE_MOCK_DATA ? MOCK_STREAK
    : await fetch(API_STREAK,{credentials:"include"})
        .then(r=>r.json()).then(j=>j.streak??0).catch(()=>0);

  (document.querySelector("#streak-card span") as HTMLElement).textContent =
    String(s);
}

/* ═════════ 5-b) Longest paddle-hit card ═════════ */
interface LongestResp { longest:number; opponent:string; }

async function renderLongestHit(): Promise<void> {
  const d: LongestResp = USE_MOCK_DATA ? MOCK_LONGEST
    : await fetch(API_LONGEST,{credentials:"include"})
        .then(r=>r.json()).catch(()=>({longest:0,opponent:"—"}));

  (document.querySelector("#longest-hit-card span") as HTMLElement).textContent =
    String(d.longest);
  (document.getElementById("longest-opponent") as HTMLElement).textContent =
    `vs ${d.opponent ?? "—"}`;
}

/* ═════════ 5-c) Trophy total card ═════════ */
async function renderTrophies(): Promise<void> {
  const total = USE_MOCK_DATA ? MOCK_TROPHIES
    : await fetch(API_TROPHY,{credentials:"include"})
        .then(r=>r.json()).then(j=>j.total??0).catch(()=>0);

  document.getElementById("trophies")!.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-2 p-6
                rounded-2xl bg-white/10 backdrop-blur border border-white/20">
      <span class="text-6xl">🏆</span>
      <span class="text-4xl font-extrabold">${total}</span>
      <p class="text-sm text-white/70">Total trophies</p>
    </div>`;
}
