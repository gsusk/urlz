import { HttpStatus } from '@/constants/httpStatus';
import { REFRESH_TOKEN_CONFIG, ACCESS_TOKEN_CONFIG } from '@/constants/jwt';
import { AppError } from '@/utils/customErrors';
import type { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { generateToken, payloadData, userDataPayload } from '../utils/token';
import type { Request, Response, NextFunction } from 'express';

export const refreshTokenHandler = async (
  req: Request & { user: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[REFRESH_TOKEN_CONFIG.cookie.name] as
      | string
      | undefined;

    if (!token) {
      res.clearCookie(REFRESH_TOKEN_CONFIG.cookie.name);
      return next(new AppError('Token Missing', HttpStatus.UNAUTHORIZED));
    }

    const decodedData = jwt.verify(token, REFRESH_TOKEN_CONFIG.secret, {
      algorithms: [REFRESH_TOKEN_CONFIG.algorithm],
    }) as userDataPayload;

    const access = generateToken(decodedData, ACCESS_TOKEN_CONFIG.secret, {
      algorithm: ACCESS_TOKEN_CONFIG.algorithm,
      subject: decodedData.username,
      expiresIn: '30s',
    });

    res.cookie(
      ACCESS_TOKEN_CONFIG.cookie.name,
      access,
      ACCESS_TOKEN_CONFIG.cookie.options,
    );
    res.status(HttpStatus.OK).end();
  } catch (err) {
    res.clearCookie(REFRESH_TOKEN_CONFIG.cookie.name);
    next(err);
  }
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
