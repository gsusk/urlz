import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';
import { HttpStatus } from '../constants/httpStatus';
import { CustomError, ValidationError } from '../utils/customErrors';
import {
  type CustomUrlSchemaType,
  type UrlSchemaType,
} from '@/validations/schemas';

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

export const shortenUrl = async (
  request: Request<object, unknown, UrlSchemaType>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { url } = request.body;
    const savedUrl = await prisma.url.create({
      data: {
        original: url,
      },
      select: {
        id: true,
      },
    });
    const shortenedUrl = encodeBase62(savedUrl.id);
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
    return response.status(201).json({
      shortenedUrl: `${request.protocol}://${request.get('host')}/${shortUrl.shortUrl}`,
    });
  } catch (err) {
    return next(err);
  }
};

export const createCustomUrl = async (
  request: Request<object, unknown, CustomUrlSchemaType>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { url, customUrl } = request.body;
    const exists = await prisma.url.findUnique({
      where: { custom: customUrl },
    });
    if (exists) {
      return next(
        new ValidationError('Url not available.', HttpStatus.CONFLICT, {
          customUrl: 'Url not available',
        }),
      );
    }
    const newUrl = await prisma.url.create({
      data: {
        custom: customUrl,
        original: url,
      },
      select: {
        custom: true,
      },
    });
    return response.status(201).json({
      shortenedUrl: `${request.protocol}://${request.get('host')}/${newUrl.custom}`,
    });
  } catch (err) {
    next(err);
  }
};

export const redirectUrl = async (
  request: Request<UrlSchemaType>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { url } = request.params;

    const shortUrl = await prisma.url.findFirst({
      select: {
        original: true,
      },
      where: {
        OR: [
          {
            shortUrl: url,
          },
          {
            custom: url,
          },
        ],
      },
    });

    if (!shortUrl?.original) {
      return next(new CustomError('Not Found', HttpStatus.NOT_FOUND));
    }
    return response.redirect(301, shortUrl.original);
  } catch (err) {
    next(err);
  }
};
