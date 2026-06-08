import { parseAppEnvironment, parsePort } from "@raina/validation";

export interface ApiRuntimeConfig {
  environment: ReturnType<typeof parseAppEnvironment>;
  port: number;
  apiPrefix: string;
  webOrigin: string;
  adminOrigin: string;
}

export function getApiRuntimeConfig(): ApiRuntimeConfig {
  return {
    environment: parseAppEnvironment(process.env.NODE_ENV),
    port: parsePort(process.env.PORT, 4000),
    apiPrefix: process.env.API_PREFIX ?? "api/v1",
    webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    adminOrigin: process.env.ADMIN_ORIGIN ?? "http://localhost:3001"
  };
}
