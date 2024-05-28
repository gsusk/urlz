/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticationError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';

const SECRET = process.env.TOKEN_PRIVATE_SECRET as string;
const jwtAlgorithm = 'HS256';

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
      SECRET,
      {
        expiresIn: '1h',
        algorithm: jwtAlgorithm,
        subject: username,
      },
      (err, payload) => {
        if (err) {
          console.error(err);
          return rej(err);
        }
        res.cookie('access_token', payload, {
          httpOnly: false,
          secure: false,
          sameSite: 'lax',
        });
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
      SECRET,
      { subject: username, algorithm: jwtAlgorithm, expiresIn: '12 days' },
      (err, payload) => {
        if (err) {
          console.error(err);
          return rej(err);
        }
        res.cookie('refresh-token', payload, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
        });
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
  const token = req.cookies['access-token'] as string | undefined;

  if (!token) {
    return next(
      new AuthenticationError('TokenError', HttpStatus.UNAUTHORIZED, [
        'Missing Token',
      ]),
    );
  }

  jwt.verify(token, SECRET, (err, decoded) => {
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
  const token = req.cookies['refresh-token'] as string | undefined;
  if (!token) {
    return next(
      new AuthenticationError('JWTokenError', HttpStatus.UNAUTHORIZED, [
        'Token Missing',
      ]),
    );
  }
};
