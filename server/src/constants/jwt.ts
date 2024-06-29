import { CookieOptions } from 'express';
type cookie_type = { name: string; options: CookieOptions };

export const ACCESS_TOKEN_CONFIG = {
  secret: process.env.ACCESS_SECRET as string,
  algorithm: 'HS256' as const,
  cookie: {
    name: 'x-access-token' as const,
    options: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    },
  } as cookie_type,
};

export const REFRESH_TOKEN_CONFIG = {
  secret: process.env.REFRESH_SECRET as string,
  algorithm: 'HS256' as const,
  cookie: {
    name: 'x-refresh-token',
    options: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth/refresh',
    },
  } as cookie_type,
};
