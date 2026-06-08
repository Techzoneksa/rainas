export type AppEnvironment = "development" | "staging" | "production" | "test";

export type AppHealthStatus = "ok" | "degraded";

export type UserRole = "owner" | "admin" | "moderator" | "support" | "user";

export interface ApiError {
  code: string;
  message: string;
  requestId?: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  limit: number;
  cursor?: string;
  nextCursor?: string;
  total?: number;
}

export interface HealthResponse {
  status: AppHealthStatus;
  service: string;
  version: string;
  environment: AppEnvironment;
}
