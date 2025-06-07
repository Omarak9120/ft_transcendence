import { FastifyRequest } from 'fastify';
import { JWTPayload } from '../utils/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTPayload;
  }
} 