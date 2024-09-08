import z from "zod"

export const urlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(5, { message: "Url must be at least 5 letters long" }),
  customUrl: z
    .string()
    .trim()
    .min(4, { message: "Alias must be at least 4 letters long" })
    .max(18, { message: "Too many characters (18 max)" })
    .optional(),
});

export type UrlType = z.infer<typeof urlSchema>
