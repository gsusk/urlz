import { AppError } from '../utils/customErrors';
import { prisma } from '../db';
import {
  buildTokens,
  clearTokens,
  setTokens,
  type payloadData,
} from '../utils/token.utils';
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
    console.error(request.user);
    const user = await prisma.user.findUnique({
      where: { username },
      select: { username: true, email: true, profilePic: true },
    });
    if (!user)
      return next(new AppError('User not found', HttpStatus.NOT_FOUND));
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
    console.log(request.file, 'adsdsasda');
    const { username: data } = request.user!;
    const { username, email } = request.body;
    const profilePic = request.file?.path;
    const updateData: typeof request.body = {};
    console.log(request.body, request.body.username, 'b', data);

    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profilePic) {
      updateData.profilePic = new URL(profilePic, 'http://localhost:8081').href;
      console.log(updateData.profilePic, '<++++++++++++++++++++++++++++');
    }
    console.log(data, updateData);
    const user = await prisma.user.update({
      where: { username: data },
      data: updateData,
      select: {
        username: true,
        email: true,
        profilePic: true,
        isVerified: true,
      },
    });

    const { accessToken, refreshToken } = buildTokens(user);
    setTokens(response, accessToken, refreshToken);

    const { isVerified: _, ...rest } = user;
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
