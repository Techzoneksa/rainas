import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { SearchQueryDto } from "../common/dto/search-query.dto";
import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

const postInclude = {
  author: { include: { profile: true } },
  product: { include: { brand: true, category: true } },
  publicList: true,
  media: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
  pros: { orderBy: { sortOrder: "asc" } },
  cons: { orderBy: { sortOrder: "asc" } },
  _count: { select: { comments: true } }
} satisfies Prisma.PostInclude;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: SearchQueryDto) {
    const where: Prisma.PostWhereInput = {
      status: "PUBLISHED",
      deletedAt: null
    };

    if (query.q !== undefined) {
      where.OR = [
        { title: { contains: query.q, mode: "insensitive" } },
        { body: { contains: query.q, mode: "insensitive" } }
      ];
    }
    if (query.categoryId !== undefined) {
      where.product = { categoryId: query.categoryId };
    }
    if (query.brandId !== undefined) {
      where.product = { brandId: query.brandId };
    }

    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: this.getOrderBy(query.sort),
        skip,
        take
      }),
      this.prisma.post.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async getById(id: string, requesterId?: string) {
    const post = await this.prisma.post.findFirst({
      where: { id, deletedAt: null },
      include: postInclude
    });

    if (post === null || (post.status !== "PUBLISHED" && post.authorId !== requesterId)) {
      throw new NotFoundException({
        code: "POST_NOT_FOUND",
        message: "المنشور غير موجود."
      });
    }

    return { data: post };
  }

  async create(authorId: string, dto: CreatePostDto) {
    await this.assertProduct(dto.productId);
    if (dto.publicListId !== undefined) {
      await this.assertPublicListOwnership(authorId, dto.publicListId);
    }

    const status = dto.status ?? "DRAFT";
    const data: Prisma.PostCreateInput = {
      author: { connect: { id: authorId } },
      product: { connect: { id: dto.productId } },
      rating: dto.rating,
      title: dto.title,
      body: dto.body,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null
    };

    if (dto.publicListId !== undefined) {
      data.publicList = { connect: { id: dto.publicListId } };
    }
    if (dto.pros !== undefined) {
      data.pros = {
        create: dto.pros.map((body, index) => ({ body, sortOrder: index + 1 }))
      };
    }
    if (dto.cons !== undefined) {
      data.cons = {
        create: dto.cons.map((body, index) => ({ body, sortOrder: index + 1 }))
      };
    }

    const post = await this.prisma.post.create({
      data,
      include: postInclude
    });

    if (post.status === "PUBLISHED") {
      await this.updateProductRating(post.productId);
    }

    return { data: post };
  }

  async update(authorId: string, id: string, dto: UpdatePostDto) {
    const current = await this.getOwnedPost(authorId, id);
    if (dto.publicListId !== undefined && dto.publicListId !== null) {
      await this.assertPublicListOwnership(authorId, dto.publicListId);
    }

    const data: Prisma.PostUpdateInput = {};
    if (dto.rating !== undefined) data.rating = dto.rating;
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.body !== undefined) data.body = dto.body;
    if (dto.status !== undefined) {
      data.status = dto.status;
      data.publishedAt =
        dto.status === "PUBLISHED" && current.publishedAt === null
          ? new Date()
          : current.publishedAt;
    }
    if (dto.publicListId !== undefined) {
      data.publicList =
        dto.publicListId === null ? { disconnect: true } : { connect: { id: dto.publicListId } };
    }

    const post = await this.prisma.$transaction(async (client) => {
      if (dto.pros !== undefined) {
        await client.postPro.deleteMany({ where: { postId: id } });
        data.pros = {
          create: dto.pros.map((body, index) => ({ body, sortOrder: index + 1 }))
        };
      }
      if (dto.cons !== undefined) {
        await client.postCon.deleteMany({ where: { postId: id } });
        data.cons = {
          create: dto.cons.map((body, index) => ({ body, sortOrder: index + 1 }))
        };
      }
      return client.post.update({
        where: { id },
        data,
        include: postInclude
      });
    });

    await this.updateProductRating(post.productId);
    return { data: post };
  }

  async publish(authorId: string, id: string) {
    await this.getOwnedPost(authorId, id);
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date()
      },
      include: postInclude
    });

    await this.updateProductRating(post.productId);
    return { data: post };
  }

  async remove(authorId: string, id: string) {
    const post = await this.getOwnedPost(authorId, id);
    await this.prisma.post.update({
      where: { id },
      data: { deletedAt: new Date(), status: "REMOVED" }
    });
    await this.updateProductRating(post.productId);
    return { data: { id, deleted: true } };
  }

  private async getOwnedPost(authorId: string, id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id, authorId, deletedAt: null }
    });

    if (post === null) {
      throw new ForbiddenException({
        code: "POST_FORBIDDEN",
        message: "لا تملك صلاحية تعديل هذا المنشور."
      });
    }

    return post;
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

  private async assertPublicListOwnership(ownerId: string, listId: string): Promise<void> {
    const list = await this.prisma.userList.findFirst({
      where: {
        id: listId,
        ownerId,
        purpose: "PUBLISHER_PUBLIC",
        visibility: "PUBLIC",
        deletedAt: null
      },
      select: { id: true }
    });

    if (list === null) {
      throw new ForbiddenException({
        code: "PUBLIC_LIST_FORBIDDEN",
        message: "القائمة العامة غير متاحة لهذا المستخدم."
      });
    }
  }

  private async updateProductRating(productId: string): Promise<void> {
    const aggregate = await this.prisma.post.aggregate({
      where: { productId, status: "PUBLISHED", deletedAt: null },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        ratingAverage: Number((aggregate._avg.rating ?? 0).toFixed(2)),
        ratingCount: aggregate._count.rating
      }
    });
  }

  private getOrderBy(sort: SearchQueryDto["sort"]): Prisma.PostOrderByWithRelationInput {
    if (sort === "created_asc") return { createdAt: "asc" };
    if (sort === "rating_asc") return { rating: "asc" };
    if (sort === "rating_desc") return { rating: "desc" };
    return { publishedAt: "desc" };
  }
}
