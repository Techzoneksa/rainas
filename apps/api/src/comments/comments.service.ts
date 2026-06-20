import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

const commentInclude = {
  author: { include: { profile: true } },
  replies: {
    where: { deletedAt: null, status: "PUBLISHED" },
    include: { author: { include: { profile: true } } },
    orderBy: { createdAt: "asc" }
  }
} as const;

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    const comment = await this.prisma.comment.findFirst({
      where: { id, deletedAt: null, status: "PUBLISHED" },
      include: commentInclude
    });

    if (comment === null) {
      throw new NotFoundException({
        code: "COMMENT_NOT_FOUND",
        message: "التعليق غير موجود."
      });
    }

    return { data: comment };
  }

  async createForPost(authorId: string, postId: string, dto: CreateCommentDto) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, status: "PUBLISHED", deletedAt: null },
      select: { id: true }
    });

    if (post === null) {
      throw new NotFoundException({
        code: "POST_NOT_FOUND",
        message: "المنشور غير موجود."
      });
    }

    const comment = await this.prisma.comment.create({
      data: {
        authorId,
        targetType: "POST",
        postId,
        body: dto.body
      },
      include: commentInclude
    });

    return { data: comment };
  }

  async createForProduct(authorId: string, productId: string, dto: CreateCommentDto) {
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

    const comment = await this.prisma.comment.create({
      data: {
        authorId,
        targetType: "PRODUCT",
        productId,
        body: dto.body
      },
      include: commentInclude
    });

    return { data: comment };
  }

  async reply(authorId: string, parentId: string, dto: CreateCommentDto) {
    const parent = await this.prisma.comment.findFirst({
      where: { id: parentId, deletedAt: null, status: "PUBLISHED" }
    });

    if (parent === null) {
      throw new NotFoundException({
        code: "COMMENT_NOT_FOUND",
        message: "التعليق غير موجود."
      });
    }
    if (parent.parentId !== null) {
      throw new BadRequestException({
        code: "COMMENT_REPLY_DEPTH",
        message: "الردود مسموحة على التعليق الرئيسي فقط."
      });
    }

    const comment = await this.prisma.comment.create({
      data: {
        authorId,
        targetType: parent.targetType,
        postId: parent.postId,
        productId: parent.productId,
        parentId: parent.id,
        body: dto.body
      },
      include: commentInclude
    });

    return { data: comment };
  }

  async update(authorId: string, id: string, dto: CreateCommentDto) {
    await this.assertOwner(authorId, id);
    const comment = await this.prisma.comment.update({
      where: { id },
      data: { body: dto.body },
      include: commentInclude
    });

    return { data: comment };
  }

  async remove(authorId: string, id: string) {
    await this.assertOwner(authorId, id);
    await this.prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date(), status: "REMOVED" }
    });

    return { data: { id, deleted: true } };
  }

  private async assertOwner(authorId: string, id: string): Promise<void> {
    const comment = await this.prisma.comment.findFirst({
      where: { id, authorId, deletedAt: null },
      select: { id: true }
    });

    if (comment === null) {
      throw new ForbiddenException({
        code: "COMMENT_FORBIDDEN",
        message: "لا تملك صلاحية تعديل هذا التعليق."
      });
    }
  }
}
