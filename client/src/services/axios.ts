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

const refreshToken = async (error: AxiosError) => {};

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log("start");
    if (!error.response) {
      return Promise.reject(new Error("Error connecting to server."));
    }

    if (error.config?.__retry) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest.__retry
    ) {
      originalRequest.__retry = true;
      console.log("first 401");

      return client
        .post("/auth/refresh", undefined, {
          __retry: true,
        })
        .then(() => {
          return axios(originalRequest);
        })
        .catch((err) => {
          console.error(
            err,
            (err as AxiosError).response,
            err instanceof AxiosError
          );
          return Promise.reject(
            err.response?.data || {
              message: err.message || "Unexpected Error.",
            }
          );
        });
    }

    console.log("none before");
    return Promise.reject(error);
  }
);

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export default client;
