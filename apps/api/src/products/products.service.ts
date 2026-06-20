import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { SearchQueryDto } from "../common/dto/search-query.dto";
import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";

const productInclude = {
  brand: true,
  category: true,
  media: {
    where: { deletedAt: null },
    orderBy: { sortOrder: "asc" }
  },
  specifications: {
    orderBy: { sortOrder: "asc" }
  }
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: SearchQueryDto) {
    const where: Prisma.ProductWhereInput = {
      status: "ACTIVE",
      deletedAt: null
    };

    if (query.q !== undefined) {
      where.OR = [
        { nameAr: { contains: query.q, mode: "insensitive" } },
        { summaryAr: { contains: query.q, mode: "insensitive" } }
      ];
    }
    if (query.categoryId !== undefined) {
      where.categoryId = query.categoryId;
    }
    if (query.brandId !== undefined) {
      where.brandId = query.brandId;
    }

    const orderBy = this.getOrderBy(query.sort);
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({ where, include: productInclude, orderBy, skip, take }),
      this.prisma.product.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async getBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, status: "ACTIVE", deletedAt: null },
      include: productInclude
    });

    if (product === null) {
      throw new NotFoundException({
        code: "PRODUCT_NOT_FOUND",
        message: "المنتج غير موجود."
      });
    }

    return { data: product };
  }

  async listPosts(productId: string, query: PaginationQueryDto) {
    await this.assertProduct(productId);
    const where: Prisma.PostWhereInput = {
      productId,
      status: "PUBLISHED",
      deletedAt: null
    };
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        include: {
          author: { include: { profile: true } },
          product: { include: { brand: true, category: true } },
          pros: { orderBy: { sortOrder: "asc" } },
          cons: { orderBy: { sortOrder: "asc" } }
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take
      }),
      this.prisma.post.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async listComments(productId: string, query: PaginationQueryDto) {
    await this.assertProduct(productId);
    const where: Prisma.CommentWhereInput = {
      productId,
      parentId: null,
      status: "PUBLISHED",
      deletedAt: null
    };
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.comment.findMany({
        where,
        include: {
          author: { include: { profile: true } },
          replies: {
            where: { deletedAt: null, status: "PUBLISHED" },
            include: { author: { include: { profile: true } } },
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      this.prisma.comment.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  private async assertProduct(productId: string): Promise<void> {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, status: "ACTIVE", deletedAt: null },
      select: { id: true }
    });

    if (product === null) {
      throw new NotFoundException({
        code: "PRODUCT_NOT_FOUND",
        message: "المنتج غير موجود."
      });
    }
  }

  private getOrderBy(sort: SearchQueryDto["sort"]): Prisma.ProductOrderByWithRelationInput {
    if (sort === "created_asc") return { createdAt: "asc" };
    if (sort === "rating_asc") return { ratingAverage: "asc" };
    if (sort === "rating_desc") return { ratingAverage: "desc" };
    return { createdAt: "desc" };
  }
}
