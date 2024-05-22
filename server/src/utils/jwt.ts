import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthorizationError, CustomError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';

export const addToken = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  return jwt.sign({ email: email }, 'k', {
    expiresIn: '2 days',
    algorithm: 'HS256',
    subject: username,
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, 'k', { algorithms: ['HS256'] });
};

export const tokenHandler = async (
  req: Request & { user: JwtPayload },
  _res: Response,
  next: NextFunction,
) => {
  const token = String(req.headers.authorization ?? '');
  if (!token) {
    return next(
      new AuthorizationError('Invalid Token', HttpStatus.UNAUTHORIZED, [
        'Invalid Token',
      ]),
    );
  }
  try {
    const verifiedToken = verifyJwt(token);
    if (!verifiedToken) return next(new CustomError('unoath', 401));
    if (typeof verifiedToken !== 'string') {
      req.user = verifiedToken;
    }
    return next();
  } catch (err) {
    return next(err);
  }
};
