import axios, { AxiosError, AxiosRequestConfig } from "axios";
import store from "../redux/store";
import { logout } from "../redux/user/user";

declare module "axios" {
  export interface AxiosRequestConfig {
    __retry: boolean;
  }
}

type PromiseQueue<T> = {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: unknown) => void;
};

const client = axios.create({
  baseURL: "http://localhost:8081/api",
  withCredentials: true,
  __retry: false,
});

let isRefreshing = false;

const failedQueue: PromiseQueue<AxiosRequestConfig>[] = [];

const requestQueue = (error: AxiosError, config: AxiosRequestConfig) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(config);
    }
  });
};

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
      console.log("first 401");

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {});
      }

      originalRequest.__retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        client
          .post("/auth/refresh", undefined, {
            __retry: true,
          })
          .then(() => {
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            store.dispatch(logout());
            reject(err);
          });
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
