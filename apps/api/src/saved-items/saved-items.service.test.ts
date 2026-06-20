import { describe, expect, it, vi } from "vitest";

import type { PrismaService } from "../database/prisma.service";
import { SavedItemsService } from "./saved-items.service";

describe("SavedItemsService", () => {
  it("rejects missing targets", async () => {
    const prisma = {
      post: {
        findFirst: vi.fn(async () => null)
      },
      product: {
        findFirst: vi.fn(async () => null)
      }
    } as unknown as PrismaService;
    const service = new SavedItemsService(prisma);

    await expect(
      service.save("usr_01", {
        targetType: "POST",
        targetId: "missing"
      })
    ).rejects.toMatchObject({
      response: {
        code: "SAVED_TARGET_NOT_FOUND"
      }
    });
  });
});
