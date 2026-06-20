import { Controller, Get } from "@nestjs/common";

import type { HealthResponse } from "@raina/shared-types";

import { getApiRuntimeConfig } from "../config/app.config";
import { PrismaService } from "../database/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

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

  @Get("live")
  getLive(): HealthResponse {
    return this.getHealth();
  }

  @Get("ready")
  async getReady(): Promise<HealthResponse> {
    const ready = await this.prisma.isReady();
    const health = this.getHealth();

    return {
      ...health,
      status: ready ? "ok" : "degraded"
    };
  }
}
