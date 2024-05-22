import client from "./axios";

type Credentials = {
  email: string;
  username: string;
  token: string;
};

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await client.post<Credentials>(
    "/auth/signin",
    {
      email,
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
}: {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}) {
  const response = await client.post<Credentials>(
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
