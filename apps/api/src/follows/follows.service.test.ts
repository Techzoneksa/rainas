import { describe, expect, it, vi } from "vitest";

import type { PrismaService } from "../database/prisma.service";
import { FollowsService } from "./follows.service";

describe("FollowsService", () => {
  it("rejects self follow", async () => {
    const service = new FollowsService({} as PrismaService);

    await expect(service.follow("usr_01", "usr_01")).rejects.toMatchObject({
      response: {
        code: "SELF_FOLLOW_NOT_ALLOWED"
      }
    });
  });

  it("lists posts from followed users", async () => {
    const prisma = {
      follow: {
        findMany: vi.fn(async () => [{ followingId: "usr_02" }])
      },
      post: {
        findMany: vi.fn(async () => [{ id: "pst_01", authorId: "usr_02" }]),
        count: vi.fn(async () => 1)
      },
      $transaction: vi.fn(async (operations: Promise<unknown>[]) => Promise.all(operations))
    } as unknown as PrismaService;
    const service = new FollowsService(prisma);

    const result = await service.listFollowingPosts("usr_01", { page: 1, limit: 20 });

    expect(result).toMatchObject({
      data: [{ id: "pst_01", authorId: "usr_02" }],
      meta: { page: 1, limit: 20, total: 1 }
    });
  });
});
