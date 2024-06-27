import { CookieOptions } from 'express';

export const ACCESS_COOKIE_CONFIG = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
} as CookieOptions;

export const REFRESH_COOKIE_CONFIG = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/api/auth/refresh',
} as CookieOptions;
