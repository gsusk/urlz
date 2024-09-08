import client from "./axios";

export type User = {
  username: string;
  isVerified: boolean;
  profilePic: string;
};

export type AuthRejectResponse = {
  message: string;
  errors?: Record<string, string>[];
};

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return await client.post<User>(
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
}: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}) {
  return await client.post<User>(
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
