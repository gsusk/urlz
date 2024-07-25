import axios, { AxiosError } from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    __retry: boolean;
  }
}

const client = axios.create({
  baseURL: "http://localhost:8081/api",
  withCredentials: true,
  __retry: false,
});

const refreshToken = async (error: AxiosError) => {
  const originalRequest = error.config;
  if (
    error.response?.status === 401 &&
    originalRequest &&
    !originalRequest.__retry
  ) {
    originalRequest.__retry = true;
    console.log("first 401");
    try {
      await client.post("/auth/refresh", undefined, {
        __retry: true,
      });
      console.log("success on 401");
      return axios(originalRequest);
    } catch (e: unknown) {
      console.log("error on 401");
      if (e instanceof AxiosError) {
        console.log("yes");
      }
      console.error(e, (e as AxiosError).response);
      return Promise.reject(
        (e as AxiosError<{ message?: string }>).response?.data?.message ||
          e.message ||
          "Unexpected Error. sss"
      );
    }
  }
  console.log("here is a not retry", originalRequest);
  if (error.response?.status === 401 && originalRequest?.__retry) {
    console.log("not retry log out indeed");
    return Promise.reject(
      new Error(error.response.data.message ?? "Error auth")
    );
  }
  console.log("none before");
  return Promise.reject(error);
};

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log("start");
    if (!error.response) {
      return Promise.reject(new Error("Error connecting to server."));
    }
    return refreshToken(error);
  }
);

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export default client;
