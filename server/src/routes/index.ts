import { Router } from 'express';
import shortenRoute from './short';
import authRoute from './auth';

const router = Router();

router.use('/auth', authRoute);
router.use('/shorten', shortenRoute);

export default router;
