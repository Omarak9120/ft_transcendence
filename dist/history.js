/**
 * history.ts – Recent Games tab (API-only version)
 * ------------------------------------------------
 * Expects the backend to return an array of objects:
 * [
 *   { id:"034", date:"2025-06-04", opponent:"mhaisen",
 *     score:"4 – 11", result:"Win" },
 *   ...
 * ]
 */
/* Endpoint */
const API_BASE = "http://localhost:3000";
const ENDPOINT = `${API_BASE}/api/matches/history`;
/* One-time guard */
let loaded = false;
function getAuthHeader() {
    console.log("HERE2\n");
    const token = localStorage.getItem('token');
    console.log("HERE1 " + token + "\n");
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}
/* Called from nav.ts when the History tab is opened */
export async function initHistoryTab() {
    if (loaded)
        return;
    loaded = true;
    try {
        /* 1) Fetch + parse */
        const r = await fetch(ENDPOINT, { headers: getAuthHeader() });
        if (!r.ok)
            throw new Error(String(r.status));
        const rows = (await r.json());
        /* 2) Render */
        renderRows(rows);
    }
    catch (err) {
        console.error("History fetch failed:", err);
        // leave table blank on error
    }
}
/* ------- helper ------- */
function renderRows(rows) {
    const tbody = document.getElementById("history-body");
    if (!tbody)
        return;
    tbody.innerHTML = ""; // clear existing rows
    rows.forEach((row, i) => {
        const tr = document.createElement("tr");
        if (i % 2)
            tr.className = "bg-white/5"; // zebra striping
        tr.innerHTML = `
      <td class="py-2">${row.id}</td>
      <td class="py-2">${row.date}</td>
      <td>${row.opponent}</td>
      <td>${row.score}</td>
      <td class="${row.result === "Win" ? "text-green-400" : "text-red-400"}">
        ${row.result}
      </td>
    `;
        tbody.appendChild(tr);
    });
}
