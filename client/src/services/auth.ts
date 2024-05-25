import client from "./axios";

type AuthenticatedUserData = {
  email: string;
  username: string;
  token: string;
};

type LoginForm = {
  username: string;
  password: string;
};

type RegisterForm = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export async function login({ username, password }: LoginForm) {
  const response = await client.post<AuthenticatedUserData>(
    "/auth/signin",
    {
      username,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
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
  const response = await client.post<AuthenticatedUserData>(
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
    }
  );
  return response.data;
}
