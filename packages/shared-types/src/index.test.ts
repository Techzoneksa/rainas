import { describe, expect, it } from "vitest";

import type { AppEnvironment, HealthResponse } from "./index";

describe("shared types", () => {
  it("supports foundation health responses", () => {
    const environment: AppEnvironment = "development";
    const response: HealthResponse = {
      status: "ok",
      service: "raina-api",
      version: "1.0.0",
      environment
    };

    expect(response.status).toBe("ok");
  });
});
