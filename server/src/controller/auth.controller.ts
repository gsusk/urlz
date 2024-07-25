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
import {
  buildTokens,
  clearTokens,
  payloadData,
  setTokens,
  UserDataPayload,
} from '../utils/token.utils';
import { mailVerification } from '../utils/mail';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import {
  ACCESS_COOKIE,
  EMAIL_TOKEN_CONFIG,
  REFRESH_COOKIE,
} from '../constants/jwt';

const imageLocation = 'http://localhost:8081/public/default-profile-photo.jpg';

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

    const { password: p, email, ...rest } = user;
    const { accessToken, refreshToken } = buildTokens(user);
    rest.profilePic = rest.profilePic || imageLocation;

    setTokens(response, accessToken, refreshToken);

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
      },
    });

    const { accessToken, refreshToken } = buildTokens(user);
    const { email: e, ...rest } = user;

    setTokens(response, accessToken, refreshToken);

    response.status(201).json({ ...rest, profilePic: imageLocation });
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
    }) as UserDataPayload;

    if (decodedToken.isVerified) {
      return response.status(HttpStatus.OK).end();
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
      clearTokens(response);
      return response.status(HttpStatus.OK).end();
    }

    const { accessToken, refreshToken } = buildTokens(user);
    setTokens(response, accessToken, refreshToken);

    return response.status(HttpStatus.OK).end();
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

export const sendNewVerificationEmail = async (
  request: Request & payloadData,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { username } = request.user!;

    const user = await prisma.user.findUniqueOrThrow({
      where: { username: username },
      select: { email: true },
    });

    mailVerification({ username, email: user.email, isVerified: false });

    return response.status(200).end();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return next(
        new AppError('Bad Request', HttpStatus.FORBIDDEN, [
          { etoken: 'TokenError' },
        ]),
      );
    }
    return next(err);
  }
};
