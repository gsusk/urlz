/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';
import type { User } from '@prisma/client';
import { ACCESS_TOKEN_CONFIG } from '../constants/jwt';

export interface UserPayload extends Request {
  user: Pick<User, 'username' | 'email' | 'isVerified'> & JwtPayload;
}

export const generateToken = (
  { username, email, isVerified }: UserPayload['user'],
  secret: string,
  config: jwt.SignOptions,
) => {
  return jwt.sign({ email, isVerified, username }, secret, config);
};

export const verifyAccessToken = (
  req: UserPayload,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[ACCESS_TOKEN_CONFIG.cookie.name] as
      | string
      | undefined;

    if (!token) {
      return next(new AppError('Token missing', HttpStatus.UNAUTHORIZED));
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_CONFIG.secret, {
      algorithms: [ACCESS_TOKEN_CONFIG.algorithm],
    }) as UserPayload['user'];
    req.user = decoded;
    next();
  } catch (err) {
    return next(err);
  }
};
