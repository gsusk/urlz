import { AxiosError } from "axios";
import client, { isAxiosError } from "./axios";

export type AuthenticatedData = {
  email: string;
  username: string;
  isVerified: boolean;
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
  errors?: Record<string, string>[];
};

export async function login({ username, password }: LoginForm) {
  return await client.post<AuthenticatedData>(
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
}

export async function register({
  email,
  username,
  password,
  confirmPassword,
}: RegisterForm) {
  return await client.post<AuthenticatedData>(
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
}

export async function verifyAccount(token: string) {
  return await client.post<Pick<AuthenticatedData, "isVerified">>(
    `/auth/verify?etoken=${token}`
  );
}
