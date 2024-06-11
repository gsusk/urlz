import { NextFunction, Request, Response } from 'express';
import { ValidationError } from './customErrors';
import z from 'zod';
import { HttpStatus } from '../constants/httpStatus';

type optionType = 'params' | 'body';

export const validation = (validator: z.Schema, option: optionType) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { error, data, success } = await validator.safeParseAsync(
      req[option],
    );
    console.log(error, data, success);
    if (!success) {
      const errors = error.errors.reduce(
        (p, c) => {
          p[c.path.toString()] = c.message;
          return p;
        },
        {} as Record<string, unknown>,
      );
      return next(
        new ValidationError(
          error.errors[0].message || 'Bad Input',
          HttpStatus.BAD_REQUEST,
          errors,
        ),
      );
    }
    req.body = data;
    return next();
  };
};
