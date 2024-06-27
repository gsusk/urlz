import { validation } from '../utils/validationMiddleware';
import { signIn, signUp } from '../controller/auth.controller';
import { Router } from 'express';
import { SignInSchema, SignUpSchema } from '../validations/schemas';
const router = Router();

router.post('/signin', validation(SignInSchema), signIn);
router.post('/signup', validation(SignUpSchema), signUp);

export default router;
