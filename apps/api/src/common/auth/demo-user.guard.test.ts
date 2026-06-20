import type { ExecutionContext } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";

import type { PrismaService } from "../../database/prisma.service";
import { DemoUserGuard } from "./demo-user.guard";

function createContext(): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          "x-demo-user-id": "usr_01"
        }
      })
    })
  } as unknown as ExecutionContext;
}

describe("DemoUserGuard", () => {
  it("is disabled in production", async () => {
    const originalEnvironment = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const prisma = {
      user: {
        findFirst: vi.fn()
      }
    } as unknown as PrismaService;
    const guard = new DemoUserGuard(prisma);

    await expect(guard.canActivate(createContext())).rejects.toMatchObject({
      response: {
        code: "DEMO_IDENTITY_DISABLED"
      }
    });

    process.env.NODE_ENV = originalEnvironment;
  });
});
