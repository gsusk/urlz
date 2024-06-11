import { HttpStatus } from '../constants/httpStatus';

export class ValidationError extends Error {
  constructor(
    public message: string,
    public statusCode: HttpStatus,
    public errors?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
    this.errors = errors;
  }

  serializeError() {
    return {
      errors: this.errors,
      message: this.message,
    };
  }
}
export class AuthenticationError extends Error {
  constructor(
    public message: string,
    public statusCode: HttpStatus,
    public errors: string[] | string,
  ) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;
  }

  serializeError() {
    return {
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
      message: this.message,
    };
  }
}
