import { z } from "zod";

const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, { message: "Must be at least 4 characters long" })
    .max(64, { message: "Too many characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Not valid email" })
    .min(5, { message: "Must be at least 5 characters long" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Must be at least 8 characters long" }),
  confirmPassword: z.string().trim(),
});

export const loginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, { message: "Must be at least 4 characters long" })
    .max(64, { message: "Too many characters" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Must be at least 8 characters long" }),
});

export const registerFormSchema = userSchema.superRefine(
  ({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords doesnt match",
        path: ["confirmPassword"],
      });
    }
  }
);

export const profileSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().optional(),
    oldUsername: z.string().trim(),
    oldEmail: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (
      !Object.values({ username: data.username, email: data.email }).some(
        (val) => val !== undefined
      )
    ) {
      return ctx.addIssue({
        path: ["email", "username"],
        code: "custom",
        message: "At least one field is required.",
      });
    }
    if (data.oldUsername === data.username && data.email === data.oldEmail) {
      return ctx.addIssue({ path: [], code: "custom" });
    }
  })
  .transform((data) => {
    const { username, email } = data;
    return { username, email };
  });

export type LoginType = z.infer<typeof loginFormSchema>;
export type RegisterType = z.infer<typeof registerFormSchema>;
export type ProfileType = z.infer<typeof profileSchema>;
