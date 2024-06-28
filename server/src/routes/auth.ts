import { validation } from '../utils/validationMiddleware';
import { signIn, signUp, verifyAccount } from '../controller/auth.controller';
import { Router } from 'express';
import {
  SignInSchema,
  SignUpSchema,
  verificationTokenValidation,
} from '../validations/schemas';
const router = Router();

router.post('/signin', validation(SignInSchema), signIn);
router.post('/signup', validation(SignUpSchema), signUp);
router.post(
  '/verify',
  validation(verificationTokenValidation, 'query'),
  verifyAccount,
);

export default router;
