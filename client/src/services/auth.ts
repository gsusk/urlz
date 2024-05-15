import { AxiosDefaults, AxiosResponse } from "axios";
import client from "./axios";

export type Auth = {
  user: {
    token: string;
    email: string;
    id: string;
  } | null;
  loading: boolean;
  error: string | null;
};

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await client.post<Auth>(
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
