import { validation } from '../middlewares/validationMiddleware';
import { createCustomUrl, shortenUrl } from '../controller/url.controller';
import { Router } from 'express';
import { CustomUrlSchema, UrlSchema } from '../validations/schemas';

const router = Router();

router.post('/create', validation(UrlSchema), shortenUrl);
router.post('/custom', validation(CustomUrlSchema), createCustomUrl);

export default router;
