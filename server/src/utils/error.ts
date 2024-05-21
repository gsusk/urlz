import {
  AuthorizationError,
  CustomError,
  ValidationError,
} from './customErrors';
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  //if (process.env.NODE_ENV === 'development') {
  //  return sendErrorDev(err, request, response);
  //}
  let error = err;
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.log('handlePrismaError');
    error = handlePrismaError(err);
  } else if (error.name === 'JsonWebTokenError') {
    error = new CustomError('JWTError', 400);
  } else if (error.name === 'TokenExpiredError') {
    error = new CustomError('JWTError', 400);
  }
  return sendErrorProd(error, request, response);
}

/*function sendErrorDev(err: Error, _req: Request, res: Response) {
  let status;
  if (
    err instanceof CustomError ||
    err instanceof AuthorizationError ||
    err instanceof ValidationError
  ) {
    status = err.statusCode;
    console.log(err.serializeError());
    return res.status(status).json(err);
  }
  console.log(err);
  return res.status(400).json(err);
}*/

function sendErrorProd(err: Error, _req: Request, res: Response) {
  if (
    err instanceof CustomError ||
    err instanceof AuthorizationError ||
    err instanceof ValidationError
  ) {
    const status = err.statusCode;
    console.log(err.serializeError());
    return res.status(status).json(err.serializeError());
  }
  console.log(err);
  return res
    .status(500)
    .json({ name: 'Unexpected Error', message: 'Something went wrong' });
}

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError) {
  switch (err.code) {
    case 'P2002':
      return new CustomError('Duplicate field value', 400);
    case 'P2003':
      return new CustomError('Invalid input data', 400);
    case 'P2006':
      return new CustomError('Invalid input type', 400);
    case 'P2014':
      return new CustomError(`Invalid Change`, 400);
    default:
      return new CustomError(`Something went wrong`, 500);
  }
}
