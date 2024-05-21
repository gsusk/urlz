import { validation } from '../utils/validation';
import { shortenUrl } from '../controller/url.controller';
import { Router } from 'express';
import { UrlSchema } from '../validations/schemas';

const router = Router();

router.post('/create', validation(UrlSchema, 'body'), shortenUrl);

export default router;
