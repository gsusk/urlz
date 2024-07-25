export const config = {
  isProduction: process.env.NODE_ENV === 'production',

  accessTokenSecret: process.env.ACCESS_SECRET as string,
  refreshTokenSecret: process.env.REFRESH_SECRET as string,
};
