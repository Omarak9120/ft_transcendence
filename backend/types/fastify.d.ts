// backend/types/fastify.d.ts
import 'fastify';
import { JWTPayload } from '../utils/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTPayload;
  }
}