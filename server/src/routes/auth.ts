import { validation } from '@/utils/validation';
import { signIn, signUp } from '../controller/auth.controller';
import { Router } from 'express';
import { SignInSchema, SignUpSchema } from '@/validations/validator';
const router = Router();

router.post('/signin', validation(SignInSchema, 'body'), signIn);
router.post('/signup', validation(SignUpSchema, 'body'), signUp);

export default router;
