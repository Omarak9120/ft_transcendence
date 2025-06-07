/// <reference path="../types/fastify.d.ts" />
import { FastifyInstance } from 'fastify';
import db from '../utils/db';
import { generateToken } from '../utils/jwt';
import '@fastify/oauth2';

type GoogleProfile = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

export default async function googleAuthRoutes(fastify: FastifyInstance) {
  fastify.get('/auth/google/callback', async function (request, reply) {
    const token = await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
    
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${token.token.access_token}`,
      },
    });


	const rawProfile = await userInfoRes.json();
	if (typeof rawProfile !== 'object' || !rawProfile) {
	return reply.status(400).send({ error: 'Invalid profile data' });
	}
    const profile = rawProfile as GoogleProfile;

    if (!profile.email || !profile.id) {
      return reply.status(400).send({ error: 'Invalid Google profile data' });
    }

    // Check if user exists
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(profile.email);

    // If user doesn't exist, create one
    if (!user) {
      const stmt = db.prepare(`
        INSERT INTO users (username, email, google_id, avatar_url)
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(profile.name, profile.email, profile.id, profile.picture);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    }

    const jwtToken = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    // Redirect back with token (or use cookie/session)
    return reply.redirect(`http://localhost:5500?token=${jwtToken}`);
  });
}