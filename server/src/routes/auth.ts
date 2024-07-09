import { validation } from '../middlewares/validationMiddleware';
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

router.post('/refresh-verify', (req, res, next) => {
  return res.status(201).end();
});

export default router;
