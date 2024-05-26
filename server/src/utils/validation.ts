import { NextFunction, Request, Response } from 'express';
import { ValidationError } from './customErrors';
import z from 'zod';
import { HttpStatus } from '../constants/httpStatus';

type optionType = 'params' | 'body';

export const validation = (validator: z.Schema, option: optionType) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, data, success } = validator.safeParse(req[option]);
    console.log(error, data, success);
    if (!success) {
      const errors = error.errors.map((i) => i.message);
      return next(
        new ValidationError('Bad Input', HttpStatus.BAD_REQUEST, errors),
      );
    }
    req.body = data;
    return next();
  };
};
