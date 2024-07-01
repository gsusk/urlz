import { prisma } from '../db';
import {
  type SignInSchemaType,
  type SignUpSchemaType,
} from '../validations/schemas';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/customErrors';
import { HttpStatus } from '../constants/httpStatus';
import { UserPayload, generateToken, getAuthTokens } from '../utils/token';
import { mailVerification } from '../utils/mail';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
  ACCESS_TOKEN_CONFIG,
  EMAIL_TOKEN_CONFIG,
  REFRESH_TOKEN_CONFIG,
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
      .cookie(
        ACCESS_TOKEN_CONFIG.cookie.name,
        access,
        ACCESS_TOKEN_CONFIG.cookie.options,
      )
      .cookie(
        REFRESH_TOKEN_CONFIG.cookie.name,
        refresh,
        REFRESH_TOKEN_CONFIG.cookie.options,
      );

    return response.status(200).json({ user: rest });
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
      .cookie(
        ACCESS_TOKEN_CONFIG.cookie.name,
        access,
        ACCESS_TOKEN_CONFIG.cookie.options,
      )
      .cookie(
        REFRESH_TOKEN_CONFIG.cookie.name,
        refresh,
        REFRESH_TOKEN_CONFIG.cookie.options,
      );
    mailVerification(user);
    response.status(201).json({ user });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      response.clearCookie(ACCESS_TOKEN_CONFIG.cookie.name);
      response.clearCookie(REFRESH_TOKEN_CONFIG.cookie.name);
    }
    return next(err);
  }
};

export const verifyAccount = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { token } = request.body as { token: string };

    const decodedToken = jwt.verify(token, EMAIL_TOKEN_CONFIG.secret, {
      algorithms: [EMAIL_TOKEN_CONFIG.algorithm],
    }) as UserPayload['user'];

    const user = await prisma.user.update({
      where: { username: decodedToken.sub },
      data: { isVerified: true },
      select: {
        isVerified: true,
        username: true,
        email: true,
      },
    });

    response.json({ user: { isVerified: user.isVerified } });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const refreshTokenHandler = async (
  req: Request & { user: JwtPayload },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies[REFRESH_TOKEN_CONFIG.cookie.name] as
      | string
      | undefined;

    if (!token) {
      res.clearCookie(REFRESH_TOKEN_CONFIG.cookie.name);
      return next(new AppError('Token Missing', HttpStatus.UNAUTHORIZED));
    }

    const decodedData = jwt.verify(token, REFRESH_TOKEN_CONFIG.secret, {
      algorithms: [REFRESH_TOKEN_CONFIG.algorithm],
    }) as UserPayload['user'];

    const access = generateToken(decodedData, ACCESS_TOKEN_CONFIG.secret, {
      algorithm: ACCESS_TOKEN_CONFIG.algorithm,
      subject: decodedData.username,
      expiresIn: '30s',
    });

    res.cookie(ACCESS_TOKEN_CONFIG.cookie.name, access);
    res.status(HttpStatus.OK).end();
  } catch (err) {
    res.clearCookie(REFRESH_TOKEN_CONFIG.cookie.name);
    next(err);
  }
};
