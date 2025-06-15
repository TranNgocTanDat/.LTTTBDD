import store from "@/redux/store";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";


const DOMAIN = "http://192.168.1.218:8080/api";


const api = axios.create({
  baseURL: DOMAIN,
});

api.interceptors.response.use(
  function <T>(response: AxiosResponse<T>): T {
    return response.data;
  },
  function (error) {
    console.log("API Error:", error);

    if (axios.isAxiosError(error)) {
      const response = error?.response;
      const request = error?.request;

      if (error.code === "ERR_NETWORK") {
        console.log("Network error.");
      } else if (error.code === "ERR_CANCELED") {
        console.log("Request canceled.");
      }

      if (response) {
        return Promise.reject(response.data); // return the response error data
      } else if (request) {
        return Promise.reject({ message: "No response from server", request });
      }
    }

    return Promise.reject(error); // default fallback
  }
);

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (!config.headers) {
      config.headers;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  async get<T>(endpoint: string, option?: AxiosRequestConfig): Promise<T> {
    return await api.get(endpoint, option);
  },
  async post<T>(endpoint: string, data?: any, option?: AxiosRequestConfig): Promise<T> {
    return await api.post(endpoint, data, option);
  },
  async put<T>(endpoint: string, data?: any, option?: AxiosRequestConfig): Promise<T> {
    return await api.put(endpoint, data, option);
  },
  async delete<T>(endpoint: string, option?: AxiosRequestConfig): Promise<T> {
    return await api.delete(endpoint, option);
  },
  setDefaultHeader(key: string, data?: string) {
    api.defaults.headers.common[key] = data;
    console.log(`Set header: ${key} = ${data}`);
  },
};
