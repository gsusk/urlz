import { Router } from 'express';
import urlRoute from './short';
import authRoute from './auth';

const router = Router();

router.use('/auth', authRoute);
router.use('/url', urlRoute);

export default router;
