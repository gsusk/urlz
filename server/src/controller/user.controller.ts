import { AppError } from '../utils/customErrors';
import { prisma } from '../db';
import type { payloadData } from '../utils/token.utils';
import type { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/httpStatus';
import type { User } from '@prisma/client';

export async function getUserProfile(
  request: Request & payloadData,
  response: Response,
  next: NextFunction,
) {
  try {
    const { username } = request.user!;
    const user = await prisma.user.findUnique({
      where: { username },
      select: { username: true, email: true, profilePic: true },
    });
    if (!user)
      return next(new AppError('User not found', HttpStatus.NOT_FOUND));
    return response.json({ ...user });
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
    const { username, email, profilePic } = request.body;
    const updateData: typeof request.body = {};

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profilePic) updateData.profilePic = profilePic;

    const user = await prisma.user.update({
      where: { username: data },
      data: updateData,
      select: {
        username: !!username,
        email: !!email,
        profilePic: !!profilePic,
      },
    });

    return response.json({ ...user });
  } catch (err) {
    return next(err);
  }
}
