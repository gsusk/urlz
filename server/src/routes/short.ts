import {
  generateCSVFromURLDetails,
  getUrlDetails,
  getUrlStatsById,
} from '../controller/url.controller';
import { validation } from '../middlewares/validationMiddleware';
import {
  createCustomUrl,
  getUrlsByUserId,
  shortenUrl,
} from '../controller/url.controller';
import { Router } from 'express';
import { CustomUrlSchema, UrlSchema } from '../validations/schemas';
import { authMiddleware, guestOrUser } from '../middlewares/token';

const router = Router();

router.post('/create', validation(UrlSchema), guestOrUser, shortenUrl);
router.get('/', authMiddleware, getUrlsByUserId);
router.get('/:url/stats', authMiddleware, getUrlStatsById);
router.get('/:url/details', authMiddleware, getUrlDetails);
router.post(
  '/custom',
  validation(CustomUrlSchema),
  guestOrUser,
  createCustomUrl,
);
router.get('/:url/download', generateCSVFromURLDetails);

export default router;
