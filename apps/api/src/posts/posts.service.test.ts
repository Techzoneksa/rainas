import { describe, expect, it, vi } from "vitest";

import type { PrismaService } from "../database/prisma.service";
import { PostsService } from "./posts.service";

describe("PostsService", () => {
  it("lists published post comments", async () => {
    const prisma = {
      post: {
        findFirst: vi.fn(async () => ({ id: "pst_01" }))
      },
      comment: {
        findMany: vi.fn(async () => [{ id: "cmt_01", postId: "pst_01" }]),
        count: vi.fn(async () => 1)
      },
      $transaction: vi.fn(async (operations: Promise<unknown>[]) => Promise.all(operations))
    } as unknown as PrismaService;
    const service = new PostsService(prisma);

    const result = await service.listComments("pst_01", { page: 1, limit: 20 });

    expect(result).toMatchObject({
      data: [{ id: "cmt_01", postId: "pst_01" }],
      meta: { page: 1, limit: 20, total: 1 }
    });
  });
});
