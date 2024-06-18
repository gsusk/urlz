import z from 'zod';
import isURL from 'validator/es/lib/isURL';

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
  url: z.string().trim().min(5).max(2083).transform(validURL),
});

export const CustomUrlSchema = UrlSchema.pick({ url: true }).and(
  z.object({
    customUrl: z
      .string()
      .trim()
      .min(4)
      .max(18, { message: 'Too many characters (18 max)' }),
  }),
);

function validURL(url: string, ctx: z.RefinementCtx) {
  if (!isURL(url)) {
    console.log('not url');
    if (new URL(url).host.includes('localhost')) {
      console.log('localhost included');
      ctx.addIssue({
        code: 'custom',
        message: 'Banned Domain',
      });
    } else {
      ctx.addIssue({
        code: 'custom',
        message: 'Invalid URL.',
      });
    }
    return z.NEVER;
  }
  console.log('url, parsing...');
  let parsed: string | undefined;
  if (!url.startsWith('http:') && !url.startsWith('https:')) {
    console.log('missing potocol...');
    parsed = 'http://' + url;
  }

  return parsed ?? url;
}

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type UrlSchemaType = z.infer<typeof UrlSchema>;
export type CustomUrlSchemaType = z.infer<typeof CustomUrlSchema>;
