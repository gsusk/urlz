import { shortenUrl } from '../controller/url.controller';
import { Router } from 'express';

const router = Router();

router.post('/create', shortenUrl);

export default router;
