import { prisma } from '../db';
import {
  verificationTokenValidation,
  type SignInSchemaType,
  type SignUpSchemaType,
} from '../validations/schemas';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/customErrors';
import { HttpStatus } from '../constants/httpStatus';
import { getAuthTokens, userDataPayload } from '../utils/token';
import { mailVerification } from '../utils/mail';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import {
  ACCESS_COOKIE,
  EMAIL_TOKEN_CONFIG,
  REFRESH_COOKIE,
} from '../constants/jwt';

export const signIn = async (
  request: Request<unknown, unknown, SignInSchemaType>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = request.body;
    const user = await prisma.user.findUnique({
      select: {
        password: true,
        username: true,
        email: true,
        isVerified: true,
        profilePic: true,
      },
      where: {
        username: username,
      },
    });
    if (!user) {
      return next(
        new AppError('Invalid Username or Password', HttpStatus.NOT_FOUND, [
          {
            username:
              'The username and password combination is wrong o doesnt exists.',
          },
        ]),
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(
        new AppError('Invalid Username or Password', HttpStatus.NOT_FOUND, [
          {
            username:
              'The username and password combination is wrong o doesnt exists.',
          },
        ]),
      );
    }
    const { password: p, ...rest } = user;

    const [access, refresh] = getAuthTokens(user);

    response
      .cookie(ACCESS_COOKIE.name, access, ACCESS_COOKIE.options)
      .cookie(REFRESH_COOKIE.name, refresh, REFRESH_COOKIE.options);

    return response.status(200).json({ ...rest });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      response.clearCookie('x-refresh-token');
      response.clearCookie('x-access-token');
    }
    next(err);
  }
};

export const signUp = async (
  request: Request<unknown, unknown, SignUpSchemaType>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = request.body;
    const exists = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: { username: true, email: true },
    });

    if (exists) {
      const errors = new AppError('Conflict', HttpStatus.CONFLICT);

      if (exists.username === username) {
        errors.addError(
          'username',
          'An account with that username already exists.',
        );
      }

      if (exists.email === email) {
        errors.addError('email', 'An account with that email already exists.');
      }
      return next(errors);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
      select: {
        username: true,
        email: true,
        isVerified: true,
        profilePic: true,
      },
    });

    const [access, refresh] = getAuthTokens(user);

    response
      .cookie(ACCESS_COOKIE.name, access, ACCESS_COOKIE.options)
      .cookie(REFRESH_COOKIE.name, refresh, REFRESH_COOKIE.options);

    response.status(201).json({ ...user });
    mailVerification(user);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      response.clearCookie(ACCESS_COOKIE.name);
      response.clearCookie(REFRESH_COOKIE.name);
    }
    return next(err);
  }
};

export const verifyAccount = async (
  request: Request<unknown, unknown, unknown, verificationTokenValidation>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { etoken } = request.query;

    const decodedToken = jwt.verify(etoken, EMAIL_TOKEN_CONFIG.secret, {
      algorithms: [EMAIL_TOKEN_CONFIG.algorithm],
    }) as userDataPayload;

    if (decodedToken.isVerified) {
      return response.json({ isVerified: true });
    }

    const user = await prisma.user.update({
      where: { username: decodedToken.sub },
      data: { isVerified: true },
      select: {
        isVerified: true,
        username: true,
        email: true,
      },
    });

    const isLogged = !!request.cookies[ACCESS_COOKIE.name];

    if (isLogged) {
      response.clearCookie(ACCESS_COOKIE.name, ACCESS_COOKIE.options);
      response.clearCookie(REFRESH_COOKIE.name, REFRESH_COOKIE.options);
      return response.status(HttpStatus.OK).json({ isVerified: true });
    }

    const [access, refresh] = getAuthTokens(user);

    response
      .cookie(ACCESS_COOKIE.name, access, ACCESS_COOKIE.options)
      .cookie(REFRESH_COOKIE.name, refresh, REFRESH_COOKIE.options);

    return response.status(HttpStatus.OK).json({ isVerified: true });
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return next(
        new AppError('Bad Request', HttpStatus.FORBIDDEN, [
          { etoken: 'Invalid Token' },
        ]),
      );
    }
    return next(err);
  }
};
