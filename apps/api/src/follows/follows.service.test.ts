import { describe, expect, it } from "vitest";

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
});
