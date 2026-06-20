import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: PaginationQueryDto) {
    const where: Prisma.UserWhereInput = {
      status: "ACTIVE",
      deletedAt: null
    };
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const include = {
      profile: true
    } satisfies Prisma.UserInclude;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include,
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      this.prisma.user.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async getById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        status: "ACTIVE",
        deletedAt: null
      },
      include: {
        profile: true
      }
    });

    if (user === null) {
      throw new NotFoundException({
        code: "USER_NOT_FOUND",
        message: "المستخدم غير موجود."
      });
    }

    return { data: user };
  }
}
