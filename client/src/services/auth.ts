import client from "./axios";

type Credentials = {
  email: string;
  username: string;
  id: string;
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
  password,
  first_name,
  last_name,
}: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  const response = await client.post<Credentials>(
    "/auth/signup",
    {
      email,
      password,
      first_name,
      last_name,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
