import { validation } from '../middlewares/validationMiddleware';
import { createCustomUrl, shortenUrl } from '../controller/url.controller';
import { Router } from 'express';
import { CustomUrlSchema, UrlSchema } from '../validations/schemas';
import { geolocation } from '../utils/ip';

const router = Router();

router.post('/create', validation(UrlSchema), geolocation, shortenUrl);
router.post(
  '/custom',
  validation(CustomUrlSchema),
  geolocation,
  createCustomUrl,
);

export default router;
