let loaded = false;
export function initHistoryTab() {
    if (loaded)
        return; // run once
    loaded = true;
    const tbody = document.getElementById("history-body");
    const demoData = [
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "001", date: "2025-06-01", opponent: "Aya", score: "11 – 8", result: "Win" },
        { id: "002", date: "2025-05-30", opponent: "Karim", score: "9 – 11", result: "Loss" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" },
        { id: "003", date: "2024-06-12", opponent: "jnde", score: "7 – 0", result: "Win" }
        // add as many objects as you like here …
    ];
    demoData.forEach((row, i) => {
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
