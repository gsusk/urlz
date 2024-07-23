import { Router } from 'express';
import urlRoute from './short';
import authRoute from './auth';
import userRoute from './user';

const router = Router();

router.use('/auth', authRoute);
router.use('/url', urlRoute);
router.use('/user', userRoute);

export default router;
