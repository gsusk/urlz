import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AppError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    err = handlePrismaError(err);
  } else if (err instanceof JsonWebTokenError) {
    if (err instanceof TokenExpiredError) {
      err = new AppError('Expired Token', HttpStatus.UNAUTHORIZED);
    } else {
      err = new AppError('Invalid Token', HttpStatus.UNAUTHORIZED);
    }
  }

  sendError(err, req, res);
}

function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError,
): AppError {
  switch (err.code) {
    case 'P2002':
      return new AppError(
        'The current value already exists.',
        HttpStatus.BAD_REQUEST,
      );
    case 'P2003':
      return new AppError('Invalid input data', HttpStatus.BAD_REQUEST);
    case 'P2006':
      return new AppError('Invalid input type', HttpStatus.BAD_REQUEST);
    case 'P2014':
      return new AppError('Invalid Change', HttpStatus.BAD_REQUEST);
    default:
      return new AppError(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
  }
}

function sendError(err: AppError | Error, _req: Request, res: Response) {
  if ('isOperational' in err && err.isOperational) {
    console.log(err.serializeError());
    return res.status(err.statusCode).json(err.serializeError());
  }

  console.error('ERROR 💥', err);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Something went wrong',
    errors: [
      {
        server: 'Unexpected Errpr',
      },
    ],
  });
}
