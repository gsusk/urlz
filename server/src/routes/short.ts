import { validation } from '../middleware/validation';
import { shortenUrl } from '../controller/url.controller';
import { Router } from 'express';
import UrlSchema from '../validations/validator';

const router = Router();

router.post('/create', validation(UrlSchema), shortenUrl);

export default router;
