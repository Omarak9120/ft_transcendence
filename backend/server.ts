import Fastify from 'fastify';
import db from './utils/db';
import signupRoutes from './routes/signup';
import loginRoutes from './routes/login';
import matchRoutes from './routes/match';

const fastify = Fastify({ logger: true });

fastify.get('/', async (req, reply) => {
  return { message: 'Backend is running' };
});

const start = async () => {
  try {
    // 👇 Register the signup route before listening
    await fastify.register(signupRoutes);
    await fastify.register(loginRoutes);
    await fastify.register(matchRoutes);

    await fastify.listen({ port: 3000 });
    console.log('Server started on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
