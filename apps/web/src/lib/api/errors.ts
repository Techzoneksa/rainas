import type { ApiError } from "@raina/shared-types";

export class RainaApiError extends Error {
  readonly status: number;
  readonly apiError: ApiError;

  constructor(status: number, apiError: ApiError) {
    super(apiError.message);
    this.name = "RainaApiError";
    this.status = status;
    this.apiError = apiError;
  }
}

export function isRainaApiError(error: unknown): error is RainaApiError {
  return error instanceof RainaApiError;
}

export function getApiErrorMessage(error: unknown): string {
  if (isRainaApiError(error)) return error.apiError.message;
  if (error instanceof Error) return error.message;
  return "تعذر تحميل البيانات";
}
