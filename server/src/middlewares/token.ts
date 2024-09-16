import { HttpStatus } from '../constants/httpStatus';
import { AppError } from '../utils/customErrors';
import type { JwtPayload } from 'jsonwebtoken';
import {
  buildTokens,
  clearTokens,
  payloadData,
  setTokens,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/token.utils';
import { type Request, type Response, type NextFunction } from 'express';

export const refreshTokenHandler = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = verifyRefreshToken(req.cookies['x-refresh-token']);

    if (!payload) {
      throw new AppError('Invalid Token', HttpStatus.UNAUTHORIZED);
    }

    const { accessToken, refreshToken } = buildTokens(payload);

    setTokens(res, accessToken, refreshToken);
    res.status(HttpStatus.OK).end();
  } catch (err) {
    clearTokens(res);
    next(err);
  }
};

export const authMiddleware = (
  req: Request & payloadData,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const payload = verifyAccessToken(req.cookies['x-access-token']);

    if (!payload) {
      return next(new AppError('Token missing', HttpStatus.UNAUTHORIZED));
    }

    req.user = payload;
    next();
  } catch (err) {
    return next(err);
  }
};

export const guestOrUser = (
  req: Request & payloadData,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const payload = verifyAccessToken(req.cookies['x-access-token']);

    if (!payload) {
      req.user = undefined;
      return next();
    }

    req.user = payload;
    next();
  } catch (err) {
    next();
  }
};
