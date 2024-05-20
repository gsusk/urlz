import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

const BASE62C =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BLENGTH = BigInt(BASE62C.length);

const encode = (id: bigint) => {
  if (id === BigInt(0)) return '0';
  let shortUrl = '';
  let n = id;
  do {
    const remainder = Number(n % BLENGTH);
    shortUrl = BASE62C[remainder] + shortUrl;
    n /= BLENGTH;
  } while (n > BigInt(0));

  return shortUrl;
};

export const shortenUrl = async (
  request: Request<object, unknown, { url: string }>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { url } = request.body;
    if (!url) {
      return response.json({
        error: 'No url provided',
        status: 400,
      });
    }
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
      select: {
        shortUrl: true,
      },
    });
    console.log(url);
    console.log(shortUrl);
    return response.status(200).json({
      shortUrl: `${request.protocol}://${request.get('host')}/${shortUrl.shortUrl}`,
    });
  } catch (err) {
    return next(err);
  }
};

export const redirectUrl = async (
  request: Request<{ url: string }>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { url } = request.params;
    const shortUrl = await prisma.url.findUnique({
      select: {
        original: true,
      },
      where: {
        shortUrl: url,
      },
    });
    if (!shortUrl?.original) {
      return response.status(404).json({
        message: 'URL not found',
        status: 404,
      });
    }
    return response.redirect(301, shortUrl?.original);
  } catch (err) {
    next(err);
  }
};
