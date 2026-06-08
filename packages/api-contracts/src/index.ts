import type { ApiError, PaginationMeta } from "@raina/shared-types";

export interface ApiSuccessResponse<TData> {
  data: TData;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;
