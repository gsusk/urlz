import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { ValidationError } from './errorHandler';

export const validation = (validator: z.Schema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = validator.safeParse(req.body);
    if (error) {
      const errors = error.errors.map((i) => i.message);
      return next(new ValidationError('Wrong Input', 400, errors));
    }
    return next();
  };
};
