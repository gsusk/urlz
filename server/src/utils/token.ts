/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants/jwt';
import type { User } from '@prisma/client';

interface IRequest extends Request {
  user: Pick<User, 'username' | 'email' | 'isVerified'>;
}

export const generateToken = (
  { username, email, isVerified }: IRequest['user'],
  secret: string,
  config: jwt.SignOptions,
) => {
  return jwt.sign({ email, isVerified, username }, secret, config);
};

export const verifyAccessToken = (
  req: IRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[access_cookie] as string | undefined;

  if (!token) {
    return next(new AppError('Token missing', HttpStatus.UNAUTHORIZED));
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return next(new AppError('Invalid Token', HttpStatus.UNAUTHORIZED));
    }
    req.user = decoded as IRequest['user'];
    return next();
  });
};
