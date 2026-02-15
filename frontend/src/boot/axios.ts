import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<{ detail: string }>(error)) {
      if (error.response?.status === 401) {
        console.error("Unauthorized");
        // Optional: redirect to login
      }

      console.error(error.response?.data.detail);

      return Promise.reject(error);
    }
  }
);
