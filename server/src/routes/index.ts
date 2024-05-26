import { redirectUrl } from '../controller/url.controller';
import { validation } from '../utils/validation';
import { UrlSchema } from '../validations/schemas';
import { Router } from 'express';

const router = Router();

router.get('/', validation(UrlSchema, 'params'), redirectUrl);

export default router;
