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

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config.__retry
    ) {
      error.config.__retry = true;
      return client
        .post("/api/auth/refresh")
        .then((r) => {
          console.log(r);
          console.log("refresh from auth first nested");
          console.log(error.config);
          return axios(error.config!);
        })
        .catch((e) => {
          console.log("erroror from refreshAuthToken 2nd nested catch");
          console.log("md");
          return Promise.reject(new Error("e.message"));
        });
    }
    if (!error.response) {
      return Promise.reject(new Error("Error connecting to server."));
    }
    return Promise.reject(error);
  }
);

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError(error);
}

export default client;
