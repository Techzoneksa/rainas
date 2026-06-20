import { describe, expect, it, vi } from "vitest";

import type { PrismaService } from "../database/prisma.service";
import { CommentsService } from "./comments.service";

describe("CommentsService", () => {
  it("rejects replies to replies", async () => {
    const prisma = {
      comment: {
        findFirst: vi.fn(async () => ({
          id: "cmt_reply",
          parentId: "cmt_root",
          targetType: "POST",
          postId: "pst_01",
          productId: null
        }))
      }
    } as unknown as PrismaService;
    const service = new CommentsService(prisma);

    await expect(service.reply("usr_01", "cmt_reply", { body: "رد" })).rejects.toMatchObject({
      response: {
        code: "COMMENT_REPLY_DEPTH"
      }
    });
  });
});
