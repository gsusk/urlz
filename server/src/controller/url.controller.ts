import { Request, Response, NextFunction } from 'express';
import { prisma } from '../db';

export const shortenUrl = async (
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const { url } = request.body as { url: string };
  const data = await prisma.url.create({
    data: {
      original: url,
    },
  });
  response.status(200).json({
    url: `${request.protocol}://${request.get('host')}/${data.id}`,
  });
};
