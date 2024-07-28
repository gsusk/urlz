import { UrlSchema } from '../validations/schemas';
import {
  getUserProfile,
  updateUserProfile,
} from '../controller/user.controller';
import { authMiddleware } from '../middlewares/token';
import { validation } from '../middlewares/validationMiddleware';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const file = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, next) => {
      next(null, path.resolve('.', 'src', 'uploads'));
    },
    filename: (_req, _file, next) => {
      const extension = path.extname(_file.originalname);
      const upload =
        Date.now() + '-' + (Math.round(Math.random() * 1e9) + extension);
      next(null, upload);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/jpeg',
    ];
    cb(null, allowedMimeTypes.includes(file.mimetype));
  },
});

const router = Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, file.single('file'), updateUserProfile);

export default router;
