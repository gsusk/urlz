import { getUserProfile } from '@/controller/user.controller';
import { verifyAccessToken } from '@/middlewares/token';
import { Router } from 'express';

const router = Router();

router.get('profile', verifyAccessToken, getUserProfile);

export default router;
