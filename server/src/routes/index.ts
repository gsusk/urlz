import { redirectUrl } from '@/controller/url.controller';
import { Router } from 'express';

const router = Router();

router.get('/', redirectUrl);

export default router;
