import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

client.interceptors.request.use(
  (config) => {
    const token = localStorage.token("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//client.interceptors.response.use((response) => {});

export default client;
