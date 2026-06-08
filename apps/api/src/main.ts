import "reflect-metadata";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/errors/http-exception.filter";
import { requestIdMiddleware } from "./common/middleware/request-id.middleware";
import { getApiRuntimeConfig } from "./config/app.config";

async function bootstrap(): Promise<void> {
  const config = getApiRuntimeConfig();
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.setGlobalPrefix(config.apiPrefix);
  app.use(helmet());
  app.use(requestIdMiddleware);
  app.enableCors({
    origin: [config.webOrigin, config.adminOrigin],
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

  await app.listen(config.port);
  console.log(`Raina API foundation listening on port ${config.port}`);
}

void bootstrap();
