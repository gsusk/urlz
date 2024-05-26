import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticationError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';

const SECRET = process.env.TOKEN_PRIVATE_SECRET as string;
const jwtAlgorithm = 'HS256';

export const addToken = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  return jwt.sign({ email: email }, SECRET, {
    expiresIn: '2 days',
    algorithm: jwtAlgorithm,
    subject: username,
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, SECRET, { algorithms: [jwtAlgorithm] });
};

export const tokenHandler = async (
  req: Request & { user: JwtPayload },
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(
      new AuthenticationError('JWTError', HttpStatus.UNAUTHORIZED, [
        'Token Missing',
      ]),
    );
  }
  try {
    const verifiedToken = verifyJwt(token);
    if (typeof verifiedToken !== 'string') {
      req.user = verifiedToken;
      return next();
    }
  } catch (err) {
    return next(err);
  }
};
