import { CookieOptions } from 'express';
type cookie_type = { name: string; options: CookieOptions };

const jwtAlgo = 'HS256' as const;

export const EMAIL_TOKEN_CONFIG = {
  secret: process.env.EMAIL_TOKEN_SECRET as string,
  algorithm: jwtAlgo,
};

export const ACCESS_TOKEN_CONFIG = {
  secret: process.env.ACCESS_SECRET as string,
  algorithm: jwtAlgo,
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
  algorithm: jwtAlgo,
  cookie: {
    name: 'x-refresh-token' as const,
    options: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth/refresh',
    },
  } as cookie_type,
};
