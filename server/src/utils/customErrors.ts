import { HttpStatus } from '../constants/httpStatus';

export class AppError extends Error {
  public statusCode: HttpStatus;
  public isOperational: boolean;
  public errors?: Record<string, string>[];
  public timestamp: string;

  constructor(message: string, statusCode: HttpStatus, errors?: []) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.isOperational = true; // Indicates that this is an operational error we can trust
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }

  addError(field: string, message: string) {
    if (!this.errors) {
      this.errors = [];
    }
    this.errors.push({ [field]: message });
  }

  serializeError() {
    return {
      message: this.message,
      ...(this.errors && { errors: this.errors }),
    };
  }
}
