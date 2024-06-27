import { prisma } from '../db';
import {
  type SignInSchemaType,
  type SignUpSchemaType,
} from '../validations/schemas';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { AppError } from '../utils/customErrors';
import { HttpStatus } from '../constants/httpStatus';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { mailVerification } from '../utils/mail';

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

    await Promise.all([
      generateAccessToken(rest, response),
      generateRefreshToken(rest, response),
    ]);

    return response
      .status(200)
      .json({ username: user.username, email: user.email });
  } catch (err) {
    response.clearCookie('x-refresh-token');
    response.clearCookie('x-access-token');
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

    await Promise.all([
      generateAccessToken(user, response),
      generateRefreshToken(user, response),
    ]);

    mailVerification(user);
    response.status(201).json({ ...user });
  } catch (err) {
    response.clearCookie('x-refresh-token');
    response.clearCookie('x-access-token');
    return next(err);
  }
};
