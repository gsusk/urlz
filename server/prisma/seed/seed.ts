/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { PrismaClient } from '@prisma/client';
import randomstring from 'randomstring';

const BASE62C =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BLENGTH = BigInt(BASE62C.length);

const encodeBase62 = (id: bigint): string => {
  let shortUrl = '';
  let n = id;
  do {
    const remainder = Number(n % BLENGTH);
    shortUrl = BASE62C[remainder] + shortUrl;
    n /= BLENGTH;
  } while (n > BigInt(0));

  return shortUrl;
};

async function main() {
  const prisma = new PrismaClient();
  const range = 100000;

  await prisma.url.deleteMany({
    where: {
      id: {
        not: undefined,
      },
    },
  });

  for (let i = 0; i < range; i++) {
    const url = `http://${randomstring.generate(10)}.com`;
    await prisma.$transaction(async (tx) => {
      const savedUrl = await tx.url.create({
        data: {
          original: url,
        },
        select: {
          id: true,
        },
      });
      const shortenedUrl = encodeBase62(savedUrl.id);
      await tx.url.update({
        where: {
          id: savedUrl.id,
        },
        data: {
          shortUrl: shortenedUrl,
        },
      });
    });
  }

  const rangetwo = 5000;

  for (let i = 0; i < rangetwo; i++) {
    const original = `http://${randomstring.generate(5)}`;
    const customUrl = randomstring.generate(8);
    await prisma.url.create({
      data: {
        custom: customUrl,
        original: original,
      },
    });
  }
}

main();
