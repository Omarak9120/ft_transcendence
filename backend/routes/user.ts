import { FastifyInstance } from 'fastify';
import db from '../utils/db';

export default async function userRoutes(fastify: FastifyInstance) {

  fastify.get('/api/users/me/trophies', async (req, reply) => {
    const userId = 2; // 🔒 replace with getUserId(req) later

    const user = db.prepare(`SELECT trophies FROM users WHERE id = ?`).get(userId);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return reply.send({ total: user.trophies });
  });
}