import z from 'zod';

const SignUpSchema = z
  .object({
    username: z.string().trim().min(4),
    email: z.string().trim().email(),
    password: z.string().trim().min(7),
    confirmPassword: z.string().trim().min(7),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords doesnt match',
  });

const UrlSchema = z.object({
  url: z.string().trim().min(5).url({ message: 'Invalid Url' }),
});

export type SignUpSchema = z.infer<typeof SignUpSchema>;
type UrlSchema = z.infer<typeof UrlSchema>;

export default UrlSchema;
