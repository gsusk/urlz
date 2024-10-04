import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'minimal',
});

const redis = new Redis();

redis.on('connect', () => {
  console.log('Redis Client Connected');
});

redis.on('error', (err) => {
  console.log('Redis Client Error', err);
  process.exit(1);
});

export { redis };
