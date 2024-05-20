import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';

export enum HttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

export class ValidationError extends Error {
  constructor(
    public message: string,
    public statusCode: HttpStatus,
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
    public statusCode: HttpStatus,
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
    public statusCode: HttpStatus,
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
