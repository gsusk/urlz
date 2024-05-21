import { prisma } from '../db';
import { SignInSchema, SignUpSchema } from '../validations/schemas';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { CustomError } from '../utils/customErrors';
import { HttpStatus } from '../constants/httpStatus';

export const signIn = async (
  request: Request<unknown, unknown, SignInSchema>,
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
        new CustomError('Invalid User or Password', HttpStatus.NOT_FOUND),
      );
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(
        new CustomError('Invalid User or Password', HttpStatus.NOT_FOUND),
      );
    }
    response.status(200).json({ username: user.username, email: user.email });
  } catch (err) {
    next(err);
  }
};

export const signUp = async (
  request: Request<unknown, unknown, SignUpSchema>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = request.body;
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
    response.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
