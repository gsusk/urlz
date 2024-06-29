export const ACCESS_TOKEN_SECRET = process.env.ACCESS_SECRET as string;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_SECRET as string;
export const JWT_ALGORITHM = 'HS256' as const;

export const ACCESS_TOKEN = {
  secret: process.env.ACCESS_SECRET as string,
};
