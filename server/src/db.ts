import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { Queue, Worker } from 'bullmq';

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

const popularCacheRefreshQueue = new Queue('popular-urls-cache-refresh');

new Worker(
  'popular-urls-cache-refresh',
  async (job) => {
    console.log('Refreshing popular urls cache', job.id);
    const data = await prisma.url.findMany({
      where: { original: { not: null } },
      take: 1000,
      select: {
        id: true,
        _count: { select: { analytics: true } },
        shortUrl: true,
        original: true,
        custom: true,
      },
      orderBy: [{ analytics: { _count: 'desc' } }, { id: 'desc' }],
    });
    const pipeline = redis.pipeline();
    data.forEach((url) => {
      pipeline
        .hmset(
          `${url.custom || url.shortUrl}`,
          'original',
          url.original!,
          'views',
          url._count.analytics,
        )
        .expire(`${url.custom || url.shortUrl}`, 3600);
    });

    await pipeline.exec();
  },
  { connection: { host: 'localhost', port: 6379 } },
);

popularCacheRefreshQueue.add(
  'get-popular-urls-cache',
  {},
  { jobId: 'initial-cache-refresh', priority: 1 },
);

popularCacheRefreshQueue.add(
  'get-popular-urls-cache',
  {},
  {
    jobId: 'url-cache-refresh',
    repeat: { every: 1000 * 60 * 55 },
    removeOnFail: { count: 5000 },
    removeOnComplete: { count: 1000 },
  },
);

export { redis };
