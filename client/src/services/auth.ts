import client from "./axios";

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

export async function login({ username, password }: LoginForm) {
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
}

export async function register({
  email,
  username,
  password,
  confirmPassword,
}: RegisterForm) {
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
}
