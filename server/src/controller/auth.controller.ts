import { prisma } from '../db';
import {
  type SignInSchemaType,
  type SignUpSchemaType,
} from '../validations/schemas';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { ValidationError } from '../utils/customErrors';
import { HttpStatus } from '../constants/httpStatus';
import { generateAccessToken, generateRefreshToken } from '../utils/token';

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
      },
      where: {
        username: username,
      },
    });
    if (!user) {
      return next(
        new ValidationError(
          'Invalid Username or Password',
          HttpStatus.NOT_FOUND,
          {
            username:
              'The username and password combination is wrong o doesnt exists.',
          },
        ),
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(
        new ValidationError(
          'Invalid Username or Password',
          HttpStatus.NOT_FOUND,
          {
            username:
              'The username and password combination is wrong o doesnt exists.',
          },
        ),
      );
    }

    const aToken = generateAccessToken(user, response);
    const rToken = generateRefreshToken(user, response);
    await Promise.all([rToken, aToken]);
    return response
      .status(200)
      .json({ username: user.username, email: user.email });
  } catch (err) {
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
      const errors = {} as Record<string, unknown>;

      if (exists.username === username) {
        errors['username'] = 'An account with that username already exists.';
      }

      if (exists.email === email) {
        errors['email'] = 'An account with that email already exists.';
      }
      return next(new ValidationError('Conflict', HttpStatus.CONFLICT, errors));
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
      },
    });
    const aToken = generateAccessToken(user, response);
    const rToken = generateRefreshToken(user, response);
    await Promise.all([rToken, aToken]);
    response.status(201).json({ ...user });
  } catch (err) {
    return next(err);
  }
};
