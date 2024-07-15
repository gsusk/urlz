/* eslint-disable @typescript-eslint/consistent-type-definitions */

import jwt, { JwtPayload } from 'jsonwebtoken';

import { ACCESS_TOKEN_CONFIG, REFRESH_TOKEN_CONFIG } from '../constants/jwt';
import type { User } from '@prisma/client';

export type userDataPayload = Pick<User, 'username' | 'email' | 'isVerified'> &
  JwtPayload;

export type payloadData = { user?: userDataPayload };

export const getAuthTokens = ({ username, isVerified }: userDataPayload) => {
  const payload = { username, isVerified };
  const access = jwt.sign(payload, ACCESS_TOKEN_CONFIG.secret, {
    algorithm: ACCESS_TOKEN_CONFIG.algorithm,
    subject: username,
    expiresIn: '30s',
  });

  const refresh = jwt.sign(payload, REFRESH_TOKEN_CONFIG.secret, {
    algorithm: REFRESH_TOKEN_CONFIG.algorithm,
    subject: username,
    expiresIn: '1min',
  });

  return [refresh, access];
};
