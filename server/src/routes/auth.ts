import { signIn, signUp } from '../controller/auth.controller';
import { Router } from 'express';
const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);

export default router;
