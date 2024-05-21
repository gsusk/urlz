import { redirectUrl } from '@/controller/url.controller';
import { validation } from '@/middleware/validation';
import UrlSchema from '@/validations/validator';
import { Router } from 'express';

const router = Router();

router.get('/', validation(UrlSchema, 'params'), redirectUrl);

export default router;
