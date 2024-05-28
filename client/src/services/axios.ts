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
          return Promise.reject({ ...e, details: "Lol erroror" });
        });
    }
    return Promise.reject(error);
  }
);

export default client;
