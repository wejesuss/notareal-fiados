export class APIError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    if (status) this.status = status;
  }
}

export const ErrorMessages = {
  UnexpectedError: "Erro inesperado, tente novamente.",
  NetworkError: "Erro de conexão, verifique sua rede.",
  TimeoutError: "Tempo de espera excedido, tente novamente.",
  UnauthorizedError: "Não Autorizado.",
  ValidationError: "Error de validação.",
} as const;
