import { CookieOptions } from 'express';

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN as string;
export const refresh_cookie = 'x-refresh-token' as const;
export const access_cookie = 'x-access-token' as const;
export const JWT_ALGORITHM = 'HS256' as const;

export const ACCESS_COOKIE_CONFIG = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
} as CookieOptions;

export const REFRESH_COOKIE_CONFIG = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/api/auth/refresh',
} as CookieOptions;
