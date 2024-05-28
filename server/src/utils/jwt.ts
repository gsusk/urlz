import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthenticationError } from './customErrors';
import { HttpStatus } from '../constants/httpStatus';

const SECRET = process.env.TOKEN_PRIVATE_SECRET as string;
const jwtAlgorithm = 'HS256';

interface IRequest extends Request {
  user: {
    username: string;
    email: string;
  };
}

export const addAccessToken = ({
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

export const addRefreshToken = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  return jwt.sign(
    { email: email },
    SECRET,
    { subject: username, algorithm: jwtAlgorithm, expiresIn: '2 days' },
    (err, payload) => {
      if (err) {
        console.error(err);
        return;
      }
    },
  );
};

export const verifyToken = (
  req: IRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies['access_token'] as string | undefined;

  if (!token) {
    return next(
      new AuthenticationError('TokenError', HttpStatus.UNAUTHORIZED, [
        'Missing Token',
      ]),
    );
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json(err.message);
    }
    req;
    req.user = decoded as IRequest['user'];
    return next();
  });
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
  const verifiedToken = verifyJwt(token);
  if (typeof verifiedToken !== 'string') {
    req.user = verifiedToken;
    return next();
  }
};
