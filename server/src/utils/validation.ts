import { NextFunction, Request, Response } from 'express';
import { ValidationError } from './customErrors';
import z from 'zod';

type optionType = 'params' | 'body';

export const validation = (validator: z.Schema, option: optionType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = validator.safeParse(req[option]);
    if (error) {
      const errors = error.errors.map((i) => i.message);
      return next(new ValidationError('Wrong Input', 400, errors));
    }
    return next();
  };
};
