import axios from "axios";
import { APIError, ErrorMessages } from "./errors";

type ResponseErrorType =
  | {
      detail: string;
    }
  | {
      detail: {
        type: string;
        loc: Array<string | number>;
        msg: string;
        input: unknown;
      }[];
    };

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError<ResponseErrorType>(error)) {
      return Promise.reject(new APIError(ErrorMessages.UnexpectedError));
    }

    console.log(error.code);
    // Timeout
    if (error.code === "ECONNABORTED") {
      return Promise.reject(new APIError(ErrorMessages.TimeoutError));
    }

    // Network
    if (!error.response || error.code === "ERR_NETWORK") {
      return Promise.reject(new APIError(ErrorMessages.NetworkError));
    }

    const { data, status } = error.response;

    // Authorization Error
    if (error.response.status === 401) {
      return Promise.reject(new APIError(ErrorMessages.UnauthorizedError));
    }

    // Pydantic validation
    if (Array.isArray(data?.detail)) {
      const message = data.detail[0]?.msg ?? ErrorMessages.ValidationError;
      return Promise.reject(new APIError(message, status));
    }

    // console.error(error.response?.data.detail);
    // Backend Error
    if (typeof data?.detail === "string") {
      return Promise.reject(new APIError(data.detail, status));
    }

    return Promise.reject(new APIError(ErrorMessages.UnexpectedError));
  }
);
