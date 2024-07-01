/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { NextFunction, Response, Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';
import { ACCESS_TOKEN_CONFIG, REFRESH_TOKEN_CONFIG } from '../constants/jwt';
import type { User } from '@prisma/client';

export type userDataPayload = Pick<User, 'username' | 'email' | 'isVerified'> &
  JwtPayload;

export type payloadData = { user?: userDataPayload };

export const generateToken = (
  { username, email, isVerified }: userDataPayload,
  secret: string,
  config: jwt.SignOptions,
) => {
  return jwt.sign({ email, isVerified, username }, secret, config);
};

export const verifyAccessToken = (
  req: Request & payloadData,
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
    }) as userDataPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return next(err);
  }
};

export const getAuthTokens = ({
  username,
  email,
  isVerified,
}: userDataPayload) => {
  const payload = { username, email, isVerified };
  const access = generateToken(payload, ACCESS_TOKEN_CONFIG.secret, {
    algorithm: ACCESS_TOKEN_CONFIG.algorithm,
    subject: username,
    expiresIn: '30s',
  });

  const refresh = generateToken(payload, REFRESH_TOKEN_CONFIG.secret, {
    algorithm: REFRESH_TOKEN_CONFIG.algorithm,
    subject: username,
    expiresIn: '1min',
  });

  return [refresh, access];
};
