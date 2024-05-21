import { prisma } from '../db';
import { SignInSchema, SignUpSchema } from '../validations/schemas';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

export const signIn = (
  request: Request<unknown, unknown, SignInSchema>,
  response: Response,
  next: NextFunction,
) => {
  request;
  response;
  next;
};

export const signUp = async (
  request: Request<unknown, unknown, SignUpSchema>,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = request.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
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
