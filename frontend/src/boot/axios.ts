import axios from "axios";

const ErrorMessages = {
  NetworkError: "Erro de conexão, verifique sua rede.",
  TimeoutError: "Tempo de espera excedido, tente novamente.",
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
    let message = "Erro inesperado, tente novamente.";

    if (axios.isAxiosError<{ detail: string }>(error)) {
      if (error.response) {
        console.error(error.response?.data.detail);

        if (error.response.status === 401) {
          console.error("Unauthorized");
          // Optional: redirect to login
        }

        if (error.message.toLowerCase().includes("timeout")) {
          message = ErrorMessages.TimeoutError;
        }

        if (error.message.toLowerCase().includes("network")) {
          message = ErrorMessages.NetworkError;
        }
      }

      return Promise.reject(new Error(message));
    }
  }
);
