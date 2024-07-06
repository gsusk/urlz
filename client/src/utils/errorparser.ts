import { ZodError } from "zod";
import { isAxiosError } from "../services/axios";

export function serializeZodError<T>(err: ZodError<T>) {
  const flattenFieldErrors = err.flatten().fieldErrors;
  const errorObject = Object.entries(flattenFieldErrors).reduce(
    (prev, curr) => {
      [prev[curr[0] as keyof T]] = (curr[1] as string[])[0];
      return prev;
    },
    {} as Record<keyof T, string>
  );
  return errorObject;
}

function normalizeError<T>(err: T[]): T {
  return err.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {} as T);
}

export function errorHandler<T>(err: Error) {
  console.error(err, "from err handler!!!!!!!!++___+++__+++__+++__+++");
  if (isAxiosError<{ message: string; errors?: T[] }>(err) && err.response) {
    return {
      message: err.response.data.message,
      errors: normalizeError<T>(err.response.data.errors! || {}),
    };
  }
  return {
    message: err.message || "Something went wrong",
    errors: {} as T,
  };
}
