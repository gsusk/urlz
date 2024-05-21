import { HttpStatus } from '../constants/httpStatus';

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
