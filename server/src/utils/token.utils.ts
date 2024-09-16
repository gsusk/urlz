import jwt, { JwtPayload } from 'jsonwebtoken';
import type { Response } from 'express';
import type { User } from '@prisma/client';
import { config } from '../config/config';
import { CookieOptions } from 'express';

export type UserDataPayload = Pick<User, 'username' | 'isVerified' | 'id'> &
  JwtPayload;

export type payloadData = { user?: UserDataPayload };

enum TokenExpiration {
  Access = 60 * 5,
  Refresh = 60 * 60 * 24 * 7,
}

type AccessToken = {
  username: string;
  isVerified: boolean;
  id: string;
};

type RefreshToken = {
  username: string;
  isVerified: boolean;
  id: string;
};

export function signAccessToken(payload: UserDataPayload) {
  return jwt.sign(payload, config.accessTokenSecret, {
    algorithm: 'HS256',
    expiresIn: TokenExpiration.Access,
  });
}

export function signRefreshToken(payload: UserDataPayload) {
  return jwt.sign(payload, config.refreshTokenSecret, {
    algorithm: 'HS256',
    expiresIn: TokenExpiration.Refresh,
  });
}

const defaultCookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'strict' : 'lax',
  //domain: 'localhost:8081', //INVESTIGATE <========================================
  path: '/',
} as const;

const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Access * 1000,
} as const;

const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieOptions,
  maxAge: TokenExpiration.Refresh * 1000,
  path: '/api/auth/refresh',
} as const;

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.refreshTokenSecret) as RefreshToken;
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.accessTokenSecret) as AccessToken;
}

export function buildTokens(user: UserDataPayload) {
  const accessToken = signAccessToken({
    username: user.username,
    isVerified: user.isVerified,
    id: user.id,
  });
  const refreshToken = signRefreshToken({
    username: user.username,
    isVerified: user.isVerified,
    id: user.id,
  });

  return { accessToken, refreshToken };
}

export function setTokens(res: Response, access: string, refresh?: string) {
  res.cookie('x-access-token', access, accessTokenCookieOptions);
  if (refresh)
    res.cookie('x-refresh-token', refresh, refreshTokenCookieOptions);
}

/**
 *
 * TOKEN REVOKER: PENDING
 */

export function clearTokens(res: Response) {
  res.cookie('x-access-token', '', { ...accessTokenCookieOptions, maxAge: 0 });
  res.cookie('x-refresh-token', '', {
    ...refreshTokenCookieOptions,
    maxAge: 0,
  });
}
