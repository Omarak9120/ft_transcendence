import Fastify from 'fastify';
import cors from '@fastify/cors';

import db from './utils/db';
import signupRoutes from './routes/signup';
import loginRoutes from './routes/login';
import matchRoutes from './routes/match';
import statsRoutes from './routes/stats';
import userRoutes from './routes/user';
import userFriends from './routes/friends';

const fastify = Fastify({ logger: true });

fastify.get('/', async (req, reply) => {
  return { message: 'Backend is running' };
});

const start = async () => {
  try {
    // Register CORS inside start()
    await fastify.register(cors, {
      origin: 'http://localhost:5500',
      credentials: true,
    });

    // Register routes
    await fastify.register(signupRoutes);
    await fastify.register(loginRoutes);
    await fastify.register(matchRoutes);
    await fastify.register(statsRoutes);
    await fastify.register(userRoutes);
    await fastify.register(userFriends);

    // Start the server
    await fastify.listen({ port: 3000 });
    console.log('Server started on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

//npx ts-node server.ts
