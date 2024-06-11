import z from 'zod';

function notOwnDomain(url: string): boolean {
  const parsedUrl = new URL(url);
  const domain = parsedUrl.hostname;
  return !domain.includes('localhost');
}

const sSchema = z.object({
  username: z.string().trim().min(4).max(64),
  email: z.string().trim().email(),
  password: z.string().trim().min(7),
  confirmPassword: z.string().trim().min(7),
});

export const SignUpSchema = sSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: 'Password dont match', path: ['confirmPassword'] },
);

export const SignInSchema = sSchema.pick({
  username: true,
  password: true,
});

export const UrlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(5)
    .url({ message: 'Invalid Url' })
    .refine(notOwnDomain, { message: 'Banned domain' }),
});

export const CustomUrlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(5)
    .url({ message: 'Invalid Url' })
    .refine(notOwnDomain, { message: 'Banned domain' }),
  customUrl: z.string().trim().min(4),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type UrlSchemaType = z.infer<typeof UrlSchema>;
export type CustomUrlSchemaType = z.infer<typeof CustomUrlSchema>;
