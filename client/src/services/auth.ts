import client from "./axios";

type Credentials = {
  email: string;
  first_name: string;
  last_name: string;
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
