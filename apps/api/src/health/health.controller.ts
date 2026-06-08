import { Controller, Get } from "@nestjs/common";

import type { HealthResponse } from "@raina/shared-types";

import { getApiRuntimeConfig } from "../config/app.config";

@Controller("health")
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    const config = getApiRuntimeConfig();

    return {
      status: "ok",
      service: "raina-api",
      version: "1.0.0",
      environment: config.environment
    };
  }
}
