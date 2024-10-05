import { AppError } from '../utils/customErrors';
import { prisma, redis } from '../db';
import { buildTokens, setTokens, type payloadData } from '../utils/token.utils';
import type { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createHash } from 'crypto';

export async function getUserProfile(
  request: Request & payloadData,
  response: Response,
  next: NextFunction,
) {
  try {
    const { username } = request.user!;

    const cachedProfile = await redis.get('profile:' + username);
    if (cachedProfile) {
      return response.json(JSON.parse(cachedProfile));
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: { username: true, email: true, profilePic: true },
    });

    if (!user)
      return next(new AppError('User not found', HttpStatus.NOT_FOUND));

    await redis.setex(
      'profile:' + username,
      60 * 60,
      JSON.stringify({
        ...user,
        profilePic:
          user.profilePic ||
          'http://localhost:8081/public/default-profile-photo.jpg',
      }),
    );

    return response.json({
      ...user,
      profilePic:
        user.profilePic ||
        'http://localhost:8081/public/default-profile-photo.jpg',
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateUserProfile(
  request: Request<
    unknown,
    unknown,
    Partial<Pick<User, 'username' | 'email' | 'profilePic'>>
  > &
    payloadData,
  response: Response,
  next: NextFunction,
) {
  try {
    const { username: data } = request.user!;
    const { username, email } = request.body;
    const profilePic = request.file?.path;
    const updateData: typeof request.body = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profilePic) {
      updateData.profilePic = new URL(profilePic, 'http://localhost:8081').href;
    }

    const user = await prisma.user.update({
      where: { username: data },
      data: updateData,
      select: {
        username: true,
        email: true,
        profilePic: true,
        isVerified: true,
        id: true,
      },
    });

    const { accessToken, refreshToken } = buildTokens(user);
    setTokens(response, accessToken, refreshToken);

    const { isVerified: _, id: __, ...rest } = user;
    return response.json({
      ...rest,
      profilePic:
        rest.profilePic ||
        'http://localhost:8081/public/default-profile-photo.jpg',
    });
  } catch (err) {
    return next(err);
  }
}

export async function updateUserPassword(
  request: Request & payloadData,
  response: Response,
  next: NextFunction,
) {
  const { password, currentPassword } = request.body;
  const { username } = request.user!;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user)
      return next(new AppError('User not found', HttpStatus.NOT_FOUND));
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return next(new AppError('Incorrect password', HttpStatus.BAD_REQUEST));
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await prisma.user.update({
      where: { username },
      data: { password: hashedPassword },
    });

    return response
      .status(HttpStatus.OK)
      .json({ message: 'Password updated successfully' });
  } catch (err) {
    return next(err);
  }
}
