import client from "./axios";

export type AuthenticatedData = {
  username: string;
  isVerified: boolean;
  profilePic: string;
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

export type AuthRejectResponse = {
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
  return await client.post(`/auth/verify?etoken=${token}`);
}

export async function getNewVerificationEmail() {
  return await client.post("/auth/refresh-verify");
}
