import { NextFunction, Request, Response } from 'express';
import { ValidationError } from './errorHandler';
import z from 'zod';

type modeType = 'params' | 'body';

export const validation = (validator: z.Schema, mode: modeType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = validator.safeParse(req[mode]);
    if (error) {
      const errors = error.errors.map((i) => i.message);
      return next(new ValidationError('Wrong Input', 400, errors));
    }
    return next();
  };
};
