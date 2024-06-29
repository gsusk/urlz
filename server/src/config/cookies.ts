import { CookieOptions } from 'express';
type cookie_type = { name: string; options: CookieOptions };

export const ACCESS_COOKIE_CONFIG = {
  name: 'x-access-token' as const,
  options: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
  },
} as cookie_type;

export const REFRESH_COOKIE_CONFIG = {
  name: 'x-refresh-config',
  options: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/api/auth/refresh',
  },
} as cookie_type;
