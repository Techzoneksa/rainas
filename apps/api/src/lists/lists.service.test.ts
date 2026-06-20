import { describe, expect, it, vi } from "vitest";

import type { PrismaService } from "../database/prisma.service";
import { ListsService } from "./lists.service";

describe("ListsService", () => {
  it("creates personal lists as private", async () => {
    const created: unknown[] = [];
    const prisma = {
      userList: {
        create: vi.fn(async (args: { data: unknown }) => {
          created.push(args.data);
          return args.data;
        })
      }
    } as unknown as PrismaService;
    const service = new ListsService(prisma);

    await service.create("usr_01", {
      slug: "saved",
      title: "محفوظاتي",
      purpose: "PERSONAL_SAVE"
    });

    expect(created[0]).toMatchObject({
      ownerId: "usr_01",
      purpose: "PERSONAL_SAVE",
      visibility: "PRIVATE"
    });
  });

  it("creates publisher lists as public", async () => {
    const created: unknown[] = [];
    const prisma = {
      userList: {
        create: vi.fn(async (args: { data: unknown }) => {
          created.push(args.data);
          return args.data;
        })
      }
    } as unknown as PrismaService;
    const service = new ListsService(prisma);

    await service.create("usr_01", {
      slug: "posts",
      title: "قائمة منشورات",
      purpose: "PUBLISHER_PUBLIC"
    });

    expect(created[0]).toMatchObject({
      ownerId: "usr_01",
      purpose: "PUBLISHER_PUBLIC",
      visibility: "PUBLIC"
    });
  });
});
