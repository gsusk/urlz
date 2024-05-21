import z from 'zod';

const UrlSchema = z.object({
  url: z.string().trim().min(5).url({ message: 'Invalid Url' }),
});

type UrlSchema = z.infer<typeof UrlSchema>;

export default UrlSchema;
