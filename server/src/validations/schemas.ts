import z from 'zod';

function notOwnDomain(arg: string, ctx: z.RefinementCtx) {
  console.log(URL.canParse(arg), 'URL PARSING', ctx.path);
  try {
    const parsedUrl = new URL(arg);
    const domain = parsedUrl.hostname;
    console.log(domain);
    if (domain.includes('localhost.com')) {
      ctx.addIssue({
        code: 'custom',
        message: 'Banned Domain',
      });
    }
  } catch (err) {
    return;
  }
}

const baseAuthSchema = z.object({
  username: z.string().trim().min(4).max(64),
  email: z.string().trim().email(),
  password: z.string().trim().min(7),
  confirmPassword: z.string().trim().min(7),
});

export const SignUpSchema = baseAuthSchema.refine(
  (data) => data.password === data.confirmPassword,
  { message: 'Password dont match', path: ['confirmPassword'] },
);

export const SignInSchema = baseAuthSchema.pick({
  username: true,
  password: true,
});

export const UrlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(5)
    .url({ message: 'Invalid Url' })
    .superRefine(notOwnDomain),
});

export const CustomUrlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(5)
    .url({ message: 'Invalid Url' })
    .superRefine(notOwnDomain),
  customUrl: z.string().trim().min(4),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type UrlSchemaType = z.infer<typeof UrlSchema>;
export type CustomUrlSchemaType = z.infer<typeof CustomUrlSchema>;
