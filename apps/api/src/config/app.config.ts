import { parseAppEnvironment, parsePort } from "@raina/validation";

export interface ApiRuntimeConfig {
  environment: ReturnType<typeof parseAppEnvironment>;
  port: number;
  apiPrefix: string;
  webOrigin: string;
  adminOrigin: string;
  corsOrigins: string[];
  requestBodyLimit: string;
  rateLimitTtlSeconds: number;
  rateLimitRequests: number;
}

export function getApiRuntimeConfig(): ApiRuntimeConfig {
  const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";
  const adminOrigin = process.env.ADMIN_ORIGIN ?? "http://localhost:3001";
  const corsOrigins = (process.env.CORS_ORIGINS ?? `${webOrigin},${adminOrigin}`)
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return {
    environment: parseAppEnvironment(process.env.NODE_ENV),
    port: parsePort(process.env.PORT, 4000),
    apiPrefix: process.env.API_PREFIX ?? "api/v1",
    webOrigin,
    adminOrigin,
    corsOrigins,
    requestBodyLimit: process.env.REQUEST_BODY_LIMIT ?? "1mb",
    rateLimitTtlSeconds: parsePort(process.env.RATE_LIMIT_TTL_SECONDS, 60),
    rateLimitRequests: parsePort(process.env.RATE_LIMIT_REQUESTS, 120)
  };
}
