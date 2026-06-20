import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: PaginationQueryDto) {
    const where: Prisma.CategoryWhereInput = { status: "ACTIVE" };
    const orderBy: Prisma.CategoryOrderByWithRelationInput[] = [
      { sortOrder: "asc" },
      { nameAr: "asc" }
    ];
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({ where, orderBy, skip, take }),
      this.prisma.category.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async getBySlug(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, status: "ACTIVE" }
    });

    if (category === null) {
      throw new NotFoundException({
        code: "CATEGORY_NOT_FOUND",
        message: "التصنيف غير موجود."
      });
    }

    return { data: category };
  }
}
