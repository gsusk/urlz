import { validation } from '../middlewares/validationMiddleware';
import {
  sendNewVerificationEmail,
  signIn,
  signUp,
  verifyAccount,
} from '../controller/auth.controller';
import { refreshTokenHandler, authMiddleware } from '../middlewares/token';
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
router.post('/refresh', refreshTokenHandler);
router.post('/refresh-verify', authMiddleware, sendNewVerificationEmail);

export default router;
