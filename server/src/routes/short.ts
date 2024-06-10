import { validation } from '../utils/validationMiddleware';
import { createCustomUrl, shortenUrl } from '../controller/url.controller';
import { Router } from 'express';
import { CustomUrlSchema, UrlSchema } from '../validations/schemas';

const router = Router();

router.post('/create', validation(UrlSchema, 'body'), shortenUrl);
router.post('/custom', validation(CustomUrlSchema, 'body'), createCustomUrl);

export default router;
