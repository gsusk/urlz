import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/customErrors';
import z from 'zod';
import { HttpStatus } from '../constants/httpStatus';

type optionType = 'params' | 'body' | 'query';

export const validation = (
  validator: z.Schema,
  option: optionType = 'body',
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const { error, data, success } = await validator.safeParseAsync(
      req[option],
    );
    console.log(error, data, success);
    if (!success) {
      const errors = new AppError('Bad Request', HttpStatus.BAD_REQUEST);
      error.issues.forEach((issue) => {
        errors.addError(issue.path[0] as string, issue.message);
      });
      return next(errors);
    }
    req.body = data;
    return next();
  };
};
