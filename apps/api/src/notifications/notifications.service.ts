import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(userId: string, query: PaginationQueryDto) {
    const where: Prisma.NotificationWhereInput = { userId };
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      this.prisma.notification.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async markRead(userId: string, id: string) {
    const notification = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() }
    });

    return { data: { id, updated: notification.count } };
  }

  async markAllRead(userId: string) {
    const notification = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() }
    });

    return { data: { updated: notification.count } };
  }
}
