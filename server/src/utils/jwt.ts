/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticationError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';
import {
  ACCESS_COOKIE_CONFIG,
  ACCESS_TOKEN_SECRET,
  JWT_ALGORITHM,
  REFRESH_COOKIE_CONFIG,
  REFRESH_TOKEN_SECRET,
  access_cookie,
  refresh_cookie,
} from '@/constants/jwt';

interface IRequest extends Request {
  user: {
    username: string;
    email: string;
  };
}

export const generateAccessToken = (
  { username, email }: { username: string; email: string },
  res: Response,
) => {
  return new Promise<void>((resolve, rej) => {
    jwt.sign(
      { email: email },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: '1h',
        algorithm: JWT_ALGORITHM,
        subject: username,
      },
      (err, payload) => {
        if (err) {
          console.error(err);
          return rej(err);
        }
        res.cookie(access_cookie, payload, ACCESS_COOKIE_CONFIG);
        resolve();
      },
    );
  });
};

export const generateRefreshToken = (
  {
    username,
    email,
  }: {
    username: string;
    email: string;
  },
  res: Response,
) => {
  return new Promise<void>((resolve, rej) => {
    jwt.sign(
      { email: email },
      REFRESH_TOKEN_SECRET,
      { subject: username, algorithm: JWT_ALGORITHM, expiresIn: '12 days' },
      (err, payload) => {
        if (err) {
          console.error(err);
          return rej(err);
        }
        res.cookie(refresh_cookie, payload, REFRESH_COOKIE_CONFIG);
        resolve();
      },
    );
  });
};

export const verifyToken = (
  req: IRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[access_cookie] as string | undefined;

  if (!token) {
    return next(
      new AuthenticationError('TokenError', HttpStatus.UNAUTHORIZED, [
        'Missing Token',
      ]),
    );
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return next(
        new AuthenticationError('JWTokenError', HttpStatus.UNAUTHORIZED, [
          err.message,
        ]),
      );
    }
    req.user = decoded as IRequest['user'];
    return next();
  });
};

export const refreshToken = async (
  req: Request & { user: JwtPayload },
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[refresh_cookie] as string | undefined;
  if (!token) {
    return next(
      new AuthenticationError('JWTokenError', HttpStatus.UNAUTHORIZED, [
        'Token Missing',
      ]),
    );
  }
};
