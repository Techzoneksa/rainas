import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: PaginationQueryDto) {
    const where: Prisma.BrandWhereInput = { status: "ACTIVE" };
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.brand.findMany({ where, orderBy: { name: "asc" }, skip, take }),
      this.prisma.brand.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async getBySlug(slug: string) {
    const brand = await this.prisma.brand.findFirst({
      where: { slug, status: "ACTIVE" }
    });

    if (brand === null) {
      throw new NotFoundException({
        code: "BRAND_NOT_FOUND",
        message: "العلامة غير موجودة."
      });
    }

    return { data: brand };
  }
}
