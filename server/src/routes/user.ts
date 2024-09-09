import { PasswordSchema, ProfileSchema } from '../validations/schemas';
import {
  getUserProfile,
  updateUserPassword,
  updateUserProfile,
} from '../controller/user.controller';
import { authMiddleware } from '../middlewares/token';
import { validation } from '../middlewares/validationMiddleware';
import { Router } from 'express';
import { file } from '../utils/multer';

const router = Router();

router.get('/profile', authMiddleware, getUserProfile);

router.put(
  '/profile',
  authMiddleware,
  file.single('profilePic'),
  validation(ProfileSchema),
  updateUserProfile,
);

router.put(
  '/password',
  authMiddleware,
  validation(PasswordSchema),
  updateUserPassword,
);

export default router;
