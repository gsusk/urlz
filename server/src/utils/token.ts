/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';
import { CookieOptions } from 'express';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET as string;
const refresh_cookie = 'x-refresh-token' as const;
const access_cookie = 'x-access-token' as const;
const JWT_ALGORITHM = 'HS256' as const;

const ACCESS_COOKIE_CONFIG = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
} as CookieOptions;

const REFRESH_COOKIE_CONFIG = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/api/auth/refresh',
} as CookieOptions;

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
  return new Promise<void>((resolve, reject) => {
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
          return reject(err);
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
  return new Promise<void>((resolve, reject) => {
    jwt.sign(
      { email: email },
      REFRESH_TOKEN_SECRET,
      { subject: username, algorithm: JWT_ALGORITHM, expiresIn: '12 days' },
      (err, payload) => {
        if (err) {
          console.error(err);
          return reject(err);
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

export const refreshTokenHandler = async (
  req: Request & { user: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies[refresh_cookie] as string | undefined;
  if (!token) {
    res.clearCookie(access_cookie);
    return next(new AppError('Token Missing', HttpStatus.UNAUTHORIZED));
  }

  jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err);
      res.clearCookie(access_cookie);
      res.clearCookie(refresh_cookie);
      return next(new AppError('Invalid Token', HttpStatus.UNAUTHORIZED));
    }
    try {
      await generateAccessToken(decoded as IRequest['user'], res);
      res.status(200).end();
    } catch (err) {
      res.clearCookie(access_cookie);
      res.clearCookie(refresh_cookie);
      next(err);
    }
  });
};
