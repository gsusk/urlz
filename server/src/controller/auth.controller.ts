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
import transporter from '../utils/tokenSender';

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

    const [access, refresh] = await Promise.all([
      generateAccessToken(user, response),
      generateRefreshToken(user, response),
    ]);
    console.log('checking tokens', access, refresh);
    if (!access || !refresh) {
      response.clearCookie('x-refresh-token');
      response.clearCookie('x-access-token');
      return next(
        new ValidationError('Token Error', HttpStatus.INTERNAL_SERVER_ERROR, {
          username: 'Unexpected Error, please try again.',
        }),
      );
    }

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

    const [access, refresh] = await Promise.all([
      generateAccessToken(user, response),
      generateRefreshToken(user, response),
    ]);

    if (!access || !refresh) {
      response.clearCookie('x-refresh-token');
      response.clearCookie('x-access-token');
      return next(
        new ValidationError('Token Error', HttpStatus.INTERNAL_SERVER_ERROR, {
          username: 'Unexpected Error, please try again.',
        }),
      );
    }

    const info = await transporter.sendMail({
      from: `"URLzy" <santiagoxgames@gmail.com>`, // sender address
      to: 'santiagoxgames@gmail.com', // list of receivers
      subject: 'Your verification is almost complete!', // Subject line
      text: 'Click here to verify your account!: ', // plain text body
      html: `
      <h1>Verify your account</h1>
      <div>
        <p>Click here to verify your account!: </p>
        <a>'s'</a>
      </div>
      `, // html body
    });

    console.log('Message sent: %s', info);
    response.status(201).json({ ...user });
  } catch (err) {
    return next(err);
  }
};
