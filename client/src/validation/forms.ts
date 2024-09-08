import { z } from "zod";

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

export const registerFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(4, { message: "Must be at least 4 characters long" })
      .max(64, { message: "Too many characters" }),
    email: z
      .string()
      .trim()
      .email({ message: "Not valid email" })
      .min(5, { message: "Must be at least 5 characters long" })
      .max(64, { message: "Too many characters" }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Must be at least 8 characters long" }),
    confirmPassword: z.string().trim(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords doesnt match",
        path: ["confirmPassword"],
      });
    }
  });

export type LoginType = z.infer<typeof loginFormSchema>;
export type RegisterType = z.infer<typeof registerFormSchema>;
