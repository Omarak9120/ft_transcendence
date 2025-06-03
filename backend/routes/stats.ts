// routes/stats.ts
import { FastifyInstance } from 'fastify';
import db from '../utils/db';

export default async function statsRoutes(fastify: FastifyInstance) {
  // 1. /api/stats/wins — lifetime wins and losses
  fastify.get('/api/stats/wins', async (req, reply) => {
    const userId = 2; // replace with real session later

    const totalGamesStmt = db.prepare(`
      SELECT COUNT(*) AS total FROM matches
      WHERE player1_id = ? OR player2_id = ?
    `);
    const totalWinsStmt = db.prepare(`
      SELECT COUNT(*) AS wins FROM matches
      WHERE winner_id = ?
    `);

    const totalGames = totalGamesStmt.get(userId, userId).total;
    const totalWins = totalWinsStmt.get(userId).wins;
    const losses = totalGames - totalWins;

    return reply.send({ wins: totalWins, losses });
  });

  // 2. /api/stats/monthly-wins — wins per month for the past year
  fastify.get('/api/stats/monthly-wins', async (req, reply) => {
  const userId = 1; // static for now
  const result: { month: string; wins: number }[] = [];

  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    const wins = db.prepare(`
      SELECT COUNT(*) as count FROM matches
      WHERE winner_id = ?
      AND played_at >= ? AND played_at < ?
    `).get(userId, start.toISOString(), end.toISOString()).count;

    const shortMonth = start.toLocaleString("en-US", { month: "short" });

    result.push({ month: shortMonth, wins });
  }

  return reply.send(result);
});

}
