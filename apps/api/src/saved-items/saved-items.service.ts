import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";
import { CreateSavedItemDto } from "./dto/create-saved-item.dto";
import { SavedItemsQueryDto } from "./dto/saved-items-query.dto";

@Injectable()
export class SavedItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(userId: string, query: SavedItemsQueryDto) {
    const where: Prisma.SavedItemWhereInput = { userId };
    if (query.targetType !== undefined) {
      where.targetType = query.targetType;
    }
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.savedItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      this.prisma.savedItem.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async save(userId: string, dto: CreateSavedItemDto) {
    await this.assertTarget(dto);
    const saved = await this.prisma.savedItem.upsert({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: dto.targetType,
          targetId: dto.targetId
        }
      },
      update: {},
      create: {
        userId,
        targetType: dto.targetType,
        targetId: dto.targetId
      }
    });

    return { data: saved };
  }

  async remove(userId: string, id: string) {
    await this.prisma.savedItem.deleteMany({
      where: { id, userId }
    });

    return { data: { id, deleted: true } };
  }

  private async assertTarget(dto: CreateSavedItemDto): Promise<void> {
    if (dto.targetType === "POST") {
      const post = await this.prisma.post.findFirst({
        where: { id: dto.targetId, status: "PUBLISHED", deletedAt: null },
        select: { id: true }
      });
      if (post !== null) return;
    } else {
      const product = await this.prisma.product.findFirst({
        where: { id: dto.targetId, status: "ACTIVE", deletedAt: null },
        select: { id: true }
      });
      if (product !== null) return;
    }

    throw new NotFoundException({
      code: "SAVED_TARGET_NOT_FOUND",
      message: "العنصر غير موجود أو غير متاح للحفظ."
    });
  }
}
