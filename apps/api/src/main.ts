import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/errors/http-exception.filter";
import { requestIdMiddleware } from "./common/middleware/request-id.middleware";
import { getApiRuntimeConfig } from "./config/app.config";
import { PrismaService } from "./database/prisma.service";

interface JsonResponder {
  json(body: {
    status: "ok" | "degraded";
    service: string;
    version: string;
    environment: string;
  }): void;
}

interface ExpressLike {
  get(
    path: string,
    handler: (_request: unknown, response: JsonResponder) => void | Promise<void>
  ): void;
}

async function bootstrap(): Promise<void> {
  const config = getApiRuntimeConfig();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  });

  app.setGlobalPrefix(config.apiPrefix);
  app.use(helmet());
  app.useBodyParser("json", { limit: config.requestBodyLimit });
  app.useBodyParser("urlencoded", { extended: true, limit: config.requestBodyLimit });
  app.use(requestIdMiddleware);
  app.enableCors({
    origin: config.corsOrigins,
    credentials: false
  });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true
    })
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const openApiConfig = new DocumentBuilder()
    .setTitle("Raina API")
    .setDescription("Backend Core REST API for Raina development.")
    .setVersion("1.0.0")
    .addApiKey(
      {
        type: "apiKey",
        name: "X-Demo-User-Id",
        in: "header",
        description: "Development/test identity only. Disabled in production."
      },
      "demo-user"
    )
    .build();
  const openApiDocument = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup("api/docs", app, openApiDocument);
  registerRootHealthRoutes(app, config.environment);

  await app.listen(config.port);
  console.log(`Raina API listening on port ${config.port}`);
}

function registerRootHealthRoutes(
  app: NestExpressApplication,
  environment: ReturnType<typeof getApiRuntimeConfig>["environment"]
): void {
  const express = app.getHttpAdapter().getInstance() as ExpressLike;
  const prisma = app.get(PrismaService);
  const base = {
    service: "raina-api",
    version: "1.0.0",
    environment
  };

  express.get("/health/live", (_request, response) => {
    response.json({
      ...base,
      status: "ok"
    });
  });

  express.get("/health/ready", async (_request, response) => {
    response.json({
      ...base,
      status: (await prisma.isReady()) ? "ok" : "degraded"
    });
  });
}

void bootstrap();
