import client, { isAxiosError } from "./axios";

export type AuthenticatedData = {
  email: string;
  username: string;
};

export type LoginForm = {
  username: string;
  password: string;
};

export type RegisterForm = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type AuthRejectResponse = {
  message: string;
  errors: Record<string, string>;
};

const defaultError: AuthRejectResponse = {
  message: "Unexpected Error",
  errors: {
    username: "Unexpected Error, try again.",
  },
};

export async function login({ username, password }: LoginForm) {
  try {
    const response = await client.post<AuthenticatedData>(
      "/auth/signin",
      {
        username,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        __retry: false,
      }
    );
    return response.data;
  } catch (err) {
    if (isAxiosError<AuthRejectResponse>(err) && err.response) {
      return err.response.data;
    } else {
      return defaultError;
    }
  }
}

export async function register({
  email,
  username,
  password,
  confirmPassword,
}: RegisterForm) {
  try {
    const response = await client.post<AuthenticatedData>(
      "/auth/signup",
      {
        email,
        password,
        confirmPassword,
        username,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        __retry: false,
      }
    );
    return response.data;
  } catch (err) {
    if (isAxiosError<AuthRejectResponse>(err) && err.response) {
      return err.response.data;
    } else {
      return defaultError;
    }
  }
}
