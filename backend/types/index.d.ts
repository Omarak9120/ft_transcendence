import { FastifyRequest as BaseFastifyRequest } from 'fastify';
import { JWTPayload } from '../utils/jwt';

declare module 'fastify' {
  interface FastifyRequest extends BaseFastifyRequest {
    user: JWTPayload;
  }
} 