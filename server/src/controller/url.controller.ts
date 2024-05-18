import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

const BASE62C =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BLENGTH = BigInt(BASE62C.length);

const encode = (id: bigint) => {
  if (id === BigInt(0)) return '0';
  let shortUrl = '';
  let n = id;
  while (n > BigInt(0)) {
    const remainder = Number(n % BLENGTH);
    shortUrl = BASE62C[remainder] + shortUrl;
    n /= BLENGTH;
  }
  return shortUrl;
};

export const shortenUrl = async (
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const { url } = request.body as { url: string };
  const savedUrl = await prisma.url.create({
    data: {
      original: url,
    },
  });

  const shortenedUrl = encode(savedUrl.id);
  const shortUrl = await prisma.url.update({
    where: {
      id: savedUrl.id,
    },
    data: {
      shortUrl: shortenedUrl,
    },
  });

  console.log(shortUrl);

  response.status(200).json({
    url: `${request.protocol}://${request.get('host')}/${shortUrl.shortUrl}`,
  });
};
