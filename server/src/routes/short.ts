import { validation } from '../middlewares/validationMiddleware';
import { createCustomUrl, shortenUrl } from '../controller/url.controller';
import { Router } from 'express';
import { CustomUrlSchema, UrlSchema } from '../validations/schemas';
import { guestOrUser } from '../middlewares/token';

const router = Router();

router.post('/create', validation(UrlSchema), guestOrUser, shortenUrl);

router.post(
  '/custom',
  validation(CustomUrlSchema),
  guestOrUser,
  createCustomUrl,
);

export default router;
