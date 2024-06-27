import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { AppError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // default HTTP status code and error message
  let error;

  // if the error is a custom defined error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError'
  ) {
    error = new AppError('Invalid Token', HttpStatus.BAD_REQUEST);
  } else {
    error = {};
  }

  console.error(err, 'on error handler...');

  // return the standard error response
  return sendError(err, req, res);
}

function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError,
): AppError {
  console.error(err);
  switch (err.code) {
    case 'P2002':
      return new AppError('Duplicate field value', HttpStatus.BAD_REQUEST);
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
  console.log('NOT OPERATIONAL, OR NOT AN APPERROR');

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Something went wrong',
    errors: [
      {
        server: 'Unexpected Errpr',
      },
    ],
  });
}
