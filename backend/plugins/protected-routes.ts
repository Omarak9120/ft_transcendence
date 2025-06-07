import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middleware/auth';
import matchRoutes from '../routes/match';
import statsRoutes from '../routes/stats';
import userRoutes from '../routes/user';
import userFriends from '../routes/friends';

export default async function protectedRoutes(fastify: FastifyInstance) {
  // Add auth middleware to all routes in this plugin
  fastify.addHook('preHandler', authMiddleware);

  // Register protected routes
  await fastify.register(matchRoutes);
  await fastify.register(statsRoutes);
  await fastify.register(userRoutes);
  await fastify.register(userFriends);
} 