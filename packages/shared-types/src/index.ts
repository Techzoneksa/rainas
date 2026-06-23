export type AppEnvironment = "development" | "staging" | "production" | "test";

export type AppHealthStatus = "ok" | "degraded";

export type UserRole = "owner" | "admin" | "moderator" | "support" | "user";

export interface ApiError {
  code: string;
  message: string;
  requestId?: string | undefined;
  details?: unknown;
}

export interface PaginationMeta {
  page?: number;
  limit: number;
  cursor?: string;
  nextCursor?: string;
  total?: number;
  totalPages?: number;
}

export interface HealthResponse {
  status: AppHealthStatus;
  service: string;
  version: string;
  environment: AppEnvironment;
}
