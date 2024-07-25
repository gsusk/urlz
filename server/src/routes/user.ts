import { UrlSchema } from '../validations/schemas';
import { getUserProfile } from '../controller/user.controller';
import { verifyAccessToken } from '../middlewares/token';
import { validation } from '../middlewares/validationMiddleware';
import { Router } from 'express';

const router = Router();

router.get('/profile', verifyAccessToken, getUserProfile);

export default router;
