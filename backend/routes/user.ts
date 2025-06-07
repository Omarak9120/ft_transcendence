// routes/stats.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import db from '../utils/db';
import { authMiddleware } from '../middleware/auth';
import { JWTPayload } from '../utils/jwt';

export default async function userRoutes(fastify: FastifyInstance) {

  // 1) Get full “me” object
  fastify.get(
    '/api/users/me',
    { preHandler: authMiddleware },
    async (req: FastifyRequest, reply: FastifyReply) => {
      // authMiddleware has put the payload on req.user
      const { userId } = (req as FastifyRequest & { user: JWTPayload }).user;

      // Fetch all the fields you want to expose
      const user = db.prepare(`
        SELECT id, username, email, xp_level, trophies, avatar_url
        FROM users
        WHERE id = ?
      `).get(userId);

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send(user);
    }
  );
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