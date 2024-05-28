/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { AuthenticationError, CustomError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';

const SECRET = process.env.TOKEN_PRIVATE_SECRET as string;
const jwtAlgorithm = 'HS256';

interface IRequest extends Request {
  user: {
    username: string;
    email: string;
  };
}

export const addAccessToken = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  return new Promise((res, rej) => {
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
        res(payload!);
      },
    );
  });
};

export const addRefreshToken = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  return new Promise<string>((res, rej) => {
    jwt.sign(
      { email: email },
      SECRET,
      { subject: username, algorithm: jwtAlgorithm, expiresIn: '12 days' },
      (err, payload) => {
        if (err) {
          console.error(err);
          return rej(err);
        }
        res(payload!);
      },
    );
  });
};

export const verifyToken = (
  req: IRequest,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies['access_token'] as string | undefined;

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
