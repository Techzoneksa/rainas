import { type INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "../app.module";

describe("health endpoint", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns API foundation health", async () => {
    const response = await request(app.getHttpServer()).get("/api/v1/health").expect(200);

    expect(response.body).toMatchObject({
      status: "ok",
      service: "raina-api",
      version: "1.0.0",
      environment: "test"
    });
  });
});
