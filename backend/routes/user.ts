// routes/stats.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import db from '../utils/db';
import { authMiddleware } from '../middleware/auth';
import { JWTPayload } from '../utils/jwt';

export default async function userRoutes(fastify: FastifyInstance) {

  fastify.get('/api/users/me/trophies',
    { preHandler: authMiddleware },
    async (req: FastifyRequest, reply: FastifyReply) => {
      // locally assert we ran authMiddleware and set `req.user`
      const { userId } = (req as FastifyRequest & { user: JWTPayload }).user;

    const user = db.prepare(`SELECT trophies FROM users WHERE id = ?`).get(userId);
    if (!user) {
      return reply.status(404).send({ error: 'User not found' });
    }

    return reply.send({ total: user.trophies });
  });
}