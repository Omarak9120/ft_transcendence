import { FastifyInstance } from 'fastify';
import db from '../utils/db';
import { verifyPassword } from '../utils/hash';

export default async function loginRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (req, reply) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return reply.status(400).send({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return reply.status(400).send({ error: 'Invalid email or password' });
    }

    const isValid = verifyPassword(password, user.password_hash);

    if (!isValid) {
      return reply.status(400).send({ error: 'Invalid email or password' });
    }

    return reply.send({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        xp_level: user.xp_level,
        trophies: user.trophies
      }
    });
  });
}
