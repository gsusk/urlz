import { ZodError } from "zod";

export function serializeZodError<T>(err: ZodError<T>) {
  const errors = err.errors.reduce((p, i) => {
    p[i.path[0] as keyof T] = i.message;
    return p;
  }, {} as Record<keyof T, string>);
  return errors;
}
