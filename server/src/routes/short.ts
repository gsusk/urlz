import { validation } from '../middlewares/validationMiddleware';
import { createCustomUrl, shortenUrl } from '../controller/url.controller';
import { Router } from 'express';
import { CustomUrlSchema, UrlSchema } from '../validations/schemas';
import { geolocation } from '../utils/ip';
import { guestOrUser } from '../middlewares/token';

const router = Router();

router.post(
  '/create',
  validation(UrlSchema),
  geolocation,
  guestOrUser,
  shortenUrl,
);
router.post(
  '/custom',
  validation(CustomUrlSchema),
  geolocation,
  guestOrUser,
  createCustomUrl,
);

export default router;
