import { Request, Response, NextFunction } from 'express';

import { prisma, redis } from '../db';
import { HttpStatus } from '../constants/httpStatus';
import { AppError } from '../utils/customErrors';
import {
  type CustomUrlSchemaType,
  type UrlSchemaType,
} from '@/validations/schemas';
import { payloadData } from '@/utils/token.utils';
import { FilteredGeoData } from '@/utils/ip';
import { createHash } from 'crypto';

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
  request: Request<object, unknown, UrlSchemaType> & payloadData,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { url } = request.body;
    const userId = request.user?.id || null; // Either user ID or null for anonymous

    const shortUrl = await prisma.$transaction(async (tx) => {
      const savedUrl = await tx.url.create({
        data: {
          original: url,
          ...(userId && { userId }), // Conditionally include userId if available
        },
        select: { id: true },
      });

      const shortenedUrl = encodeBase62(savedUrl.id);

      return await tx.url.update({
        where: { id: savedUrl.id },
        data: { shortUrl: shortenedUrl },
        select: { shortUrl: true },
      });
    });

    return response.status(201).json({
      shortenedUrl: `${request.protocol}://${request.get('host')}/${shortUrl.shortUrl}`,
    });
  } catch (err) {
    return next(err);
  }
};

export const createCustomUrl = async (
  request: Request<object, unknown, CustomUrlSchemaType> & payloadData,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { url, customUrl } = request.body;
    const userId = request.user?.id || null;

    const newUrl = await prisma.url.create({
      data: {
        custom: customUrl,
        original: url,
        ...(userId && { userId }),
      },
      select: {
        custom: true,
        original: true,
      },
    });

    return response.status(201).json({
      shortenedUrl: `${request.protocol}://${request.get('host')}/${newUrl.custom}`,
    });
  } catch (err) {
    return next(err);
  }
};

export const redirectUrl = async (
  request: Request<UrlSchemaType>,
  response: Response<unknown, FilteredGeoData>,
  next: NextFunction,
) => {
  try {
    //to finish
    const { url } = request.params!;
    const ipdata = response.locals;
    const referrer = request.get('Referer');
    const user_agent = request.get('user-agent');

    const shortUrl = await prisma.url.findFirst({
      where: { OR: [{ custom: url }, { shortUrl: url }] },
      select: { original: true, id: true },
    });

    if (!shortUrl || !shortUrl.original) {
      return next(new AppError('URL Not Found', HttpStatus.NOT_FOUND));
    }

    await prisma.urlAnalytics.create({
      data: {
        ...ipdata,
        urlId: shortUrl.id,
        referrer: referrer || null,
        user_agent: user_agent || null,
      },
    });

    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Pragma', 'no-cache');
    return response.redirect(301, shortUrl.original);
  } catch (err) {
    next(err);
  }
};

export const getUrlsByUserId = async (
  request: Request & payloadData,
  response: Response,
  next: NextFunction,
) => {
  try {
    const limit = 10;
    const id = request.user?.id;
    const page = request.query.page
      ? parseInt(request.query.page as string)
      : undefined;
    const offset = page && page > 1 ? limit * (page - 1) : undefined;
    const hash = createHash('sha256')
      .update(id + request.originalUrl)
      .digest('hex');

    const data = await redis.get(hash);

    if (data) {
      return response.status(200).json(JSON.parse(data || '{}'));
    }

    const count = await prisma.url.count({ where: { userId: id } });
    const urls = await prisma.url.findMany({
      where: { userId: id },
      select: {
        original: true,
        custom: true,
        shortUrl: true,
        _count: { select: { analytics: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { analytics: { _count: 'desc' } },
    });

    await redis.setex(
      hash,
      20,
      JSON.stringify({ urls, pages: { total: count } }),
    );

    return response.json({
      urls,
      pages: {
        total: count,
      },
    });
  } catch (err) {
    return next(err);
  }
};

export const getUrlStatsById = async (
  request: Request<{ url: string }, unknown, unknown> & payloadData,
  response: Response,
  next: NextFunction,
) => {
  try {
    const urlId = request.params.url;
    const hash = createHash('sha256')
      .update(urlId + request.originalUrl)
      .digest('hex');

    const cache = await redis.get(hash);

    if (cache) {
      return response.json(JSON.parse(cache || '{}'));
    }

    const dailyClicks = await prisma.$queryRaw`
      SELECT DATE("visitedAt") as date, COUNT(*)::int as views FROM "UrlAnalytics" JOIN "Url" ON "UrlAnalytics"."urlId" = "Url"."id"
      WHERE "Url"."shortUrl" = ${urlId} OR "Url"."custom" = ${urlId} AND "UrlAnalytics"."visitedAt" >= NOW() - interval '30 days'
      GROUP BY date ORDER BY date;
    `;

    const analytics = await prisma.urlAnalytics.groupBy({
      by: ['country', 'country_code'],
      where: {
        url: {
          OR: [{ shortUrl: urlId }, { custom: urlId }],
          userId: request.user?.id,
        },
      },
      _count: true,
    });

    let totalClicks = 0;

    const formatedUrlData = analytics.map((stats) => {
      totalClicks += stats._count;
      return {
        country: stats.country,
        country_code: stats.country_code,
        views: stats._count,
      };
    });

    response.setHeader('Cache-Control', 'no-cache');

    await redis.setex(
      hash,
      20,
      JSON.stringify({
        monthStats: dailyClicks,
        totalClicks,
        stats: formatedUrlData,
      }),
    );

    return response.json({
      monthStats: dailyClicks,
      totalClicks,
      stats: formatedUrlData,
    });
  } catch (err) {
    return next(err);
  }
};

export const getUrlDetails = async (
  request: Request<{ url: string }, unknown, unknown> & payloadData,
  response: Response,
  next: NextFunction,
) => {
  try {
    const urlId = request.params.url;

    const hash = createHash('sha256')
      .update(urlId + request.originalUrl)
      .digest('hex');

    const cache = await redis.get(hash);

    if (cache) {
      return response.json(JSON.parse(cache || '{}'));
    }

    const urlDetails = await prisma.url.findFirst({
      select: {
        shortUrl: true,
        custom: true,
        original: true,
        analytics: {
          select: {
            visitedAt: true,
            referrer: true,
            user_agent: true,
            continent: true,
          },
          orderBy: { visitedAt: 'desc' },
          take: 10,
        },
      },
      where: {
        OR: [
          { custom: urlId },
          { shortUrl: urlId }, // Second condition (alternative)
        ],
      },
    });

    await redis.setex(hash, 20, JSON.stringify({ details: urlDetails }));

    response.setHeader('Cache-Control', 'no-cache');
    return response.json({ details: urlDetails });
  } catch (err) {
    return next(err);
  }
};

export const generateCSVFromURLDetails = async (
  request: Request<{ url: string }, unknown, unknown> & payloadData,
  response: Response,
  next: NextFunction,
) => {
  try {
    const urlId = request.params.url;
    let cursor: { visitedAt: Date; id: string } | undefined = undefined;
    const run = true;
    response.setHeader('Content-Type', 'text/csv');
    response.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    response.write('id,country,local_time,referrer,visitedAt,user_agent\n');

    while (run) {
      const urlData = await prisma.urlAnalytics.findMany({
        where: {
          url: {
            OR: [{ shortUrl: urlId }, { custom: urlId }],
            userId: request.user?.id,
          },
        },
        select: {
          country: true,
          id: true,
          local_time: true,
          referrer: true,
          visitedAt: true,
          user_agent: true,
        },
        ...(cursor && {
          cursor: cursor
            ? {
                visitedAt: cursor.visitedAt,
                id: cursor.id,
              }
            : undefined,
        }),
        take: 100,
        orderBy: {
          id: 'desc',
        },
      });

      if (urlData.length === 0) {
        break;
      }

      const csvRow = urlData.map(
        (row: {
          country: unknown;
          local_time: unknown;
          referrer: unknown;
          visitedAt: unknown;
          user_agent: unknown;
        }) => {
          return `${row.country},${row.local_time},${row.referrer},${row.visitedAt},${row.user_agent}\n`;
        },
      );

      const isWriteable = response.write(csvRow.join(''));
      if (!isWriteable) {
        await new Promise((resolve) => {
          response.once('drain', resolve); // Resolve when the response is drained
        });
      }

      cursor = {
        visitedAt: urlData[100 - 1]?.visitedAt,
        id: urlData[100 - 1]?.id,
      };

      // If cursor is not defined (i.e., no more data to paginate), exit the loop
      if (!cursor.id) {
        break;
      }
    }

    response.end();
  } catch (err) {
    return next(err);
  }
};
