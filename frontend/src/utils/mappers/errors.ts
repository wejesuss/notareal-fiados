import { APIError } from "src/api/errors";
import { UIError } from "src/types/errors";

export function mapAPIError(error: unknown): UIError {
  if (error instanceof APIError) {
    if (error.status === 404) {
      return new UIError(error.message, "not_found", error);
    }

    if (error.status === 422 || error.status === 400) {
      return new UIError(error.message, "validation", error);
    }

    return new UIError(error.message, "unknown", error);
  }

  if (error instanceof Error) {
    return new UIError(error.message, "unknown", error);
  }

  return new UIError("Erro inesperado", "unknown", error);
}
