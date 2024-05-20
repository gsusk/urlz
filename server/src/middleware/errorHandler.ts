import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

export class ValidationError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors: string[] | string,
  ) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
    this.errors = Array.isArray(errors) ? errors : [errors];
  }

  serializeError() {
    return {
      name: this.name,
      errors: this.errors as string[],
      message: this.message,
    };
  }
}

export class AuthorizationError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public errors: string[] | string,
  ) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;
    this.errors = Array.isArray(errors) ? errors : [errors];
  }

  serializeError() {
    return {
      name: this.name,
      errors: this.errors as string[],
      message: this.message,
    };
  }
}

export class CustomError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = 'CustomError';
    this.statusCode = statusCode;
  }

  serializeError() {
    return {
      name: this.name,
      message: this.message,
    };
  }
}

export function errorHandler(
  err: Error,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, request, response);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = err;

    error.message = err.message;
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('handlePrismaError');
      error = handlePrismaError(err);
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
      error = handleJWTError();
    }
    return sendErrorProd(error, request, response);
  }
}

function sendErrorDev(err: Error, req: any, res: any) {
  throw new Error('Function not implemented.');
}

function sendErrorProd(err: Error, req: any, res: any) {
  throw new Error('Function not implemented.');
}

function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): {
  name: string;
  message: string;
  stack?: string | undefined;
} {
  switch (err.code) {
    case 'P2002':
      console.log(err.meta.target);
      return {
        name: 'P2002',
        message: 'Invalid input syntax for integer: "1"',
      };
    case 'P2004':
      return {
        name: 'P2004',
        message: 'Invalid input syntax for integer: "1"',
      };
    case 'P2002':
      // handling duplicate key errors
      return new CustomError(`Duplicate field value: ${err.meta.target}`, 400);
    case 'P2014':
      // handling invalid id errors
      return new CustomError(`Invalid ID: ${err.meta.target}`, 400);
    case 'P2003':
      // handling invalid data errors
      return new CustomError(`Invalid input data: ${err.meta.target}`, 400);
    default:
      // handling all other errors
      return new CustomError(`Something went wrong: ${err.message}`, 500);
  }
}

function handleJWTError(): {
  name: string;
  message: string;
  stack?: string | undefined;
} {
  throw new Error('Function not implemented.');
}
