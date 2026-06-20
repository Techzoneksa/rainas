import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { CreateListDto } from "./dto/create-list.dto";
import { ListQueryDto } from "./dto/list-query.dto";
import { UpdateListDto } from "./dto/update-list.dto";

const listInclude = {
  owner: { include: { profile: true } },
  items: { orderBy: { sortOrder: "asc" } }
} satisfies Prisma.UserListInclude;

@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(ownerId: string, query: ListQueryDto) {
    const where: Prisma.UserListWhereInput = {
      ownerId,
      deletedAt: null
    };
    if (query.purpose !== undefined) {
      where.purpose = query.purpose;
    }

    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.userList.findMany({
        where,
        include: listInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      this.prisma.userList.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async listPublicByUsername(username: string, query: ListQueryDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
      select: { userId: true }
    });

    if (profile === null) {
      throw new NotFoundException({
        code: "PROFILE_NOT_FOUND",
        message: "الملف الشخصي غير موجود."
      });
    }

    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const where: Prisma.UserListWhereInput = {
      ownerId: profile.userId,
      purpose: "PUBLISHER_PUBLIC",
      visibility: "PUBLIC",
      deletedAt: null
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.userList.findMany({
        where,
        include: listInclude,
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      this.prisma.userList.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async getMine(ownerId: string, id: string) {
    const list = await this.prisma.userList.findFirst({
      where: { id, ownerId, deletedAt: null },
      include: listInclude
    });

    if (list === null) {
      throw new NotFoundException({
        code: "LIST_NOT_FOUND",
        message: "القائمة غير موجودة."
      });
    }

    return { data: list };
  }

  async getPublicByUsername(username: string, id: string) {
    const list = await this.prisma.userList.findFirst({
      where: {
        id,
        owner: { profile: { username } },
        purpose: "PUBLISHER_PUBLIC",
        visibility: "PUBLIC",
        deletedAt: null
      },
      include: listInclude
    });

    if (list === null) {
      throw new NotFoundException({
        code: "LIST_NOT_FOUND",
        message: "القائمة غير موجودة."
      });
    }

    return { data: list };
  }

  async create(ownerId: string, dto: CreateListDto) {
    const visibility = dto.purpose === "PUBLISHER_PUBLIC" ? "PUBLIC" : "PRIVATE";
    const data: Prisma.UserListUncheckedCreateInput = {
      ownerId,
      slug: dto.slug,
      title: dto.title,
      purpose: dto.purpose,
      visibility
    };
    if (dto.description !== undefined) {
      data.description = dto.description;
    }

    const list = await this.prisma.userList.create({
      data,
      include: listInclude
    });

    return { data: list };
  }

  async update(ownerId: string, id: string, dto: UpdateListDto) {
    await this.assertOwner(ownerId, id);
    const list = await this.prisma.userList.update({
      where: { id },
      data: dto,
      include: listInclude
    });

    return { data: list };
  }

  async remove(ownerId: string, id: string) {
    await this.assertOwner(ownerId, id);
    await this.prisma.userList.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return { data: { id, deleted: true } };
  }

  async addItem(ownerId: string, listId: string, dto: CreateListItemDto) {
    const list = await this.getOwnedList(ownerId, listId);
    await this.assertTargetAllowed(list.ownerId, list.purpose, dto);
    const item = await this.prisma.userListItem.upsert({
      where: {
        listId_targetType_targetId: {
          listId,
          targetType: dto.targetType,
          targetId: dto.targetId
        }
      },
      update: {
        sortOrder: dto.sortOrder ?? 0
      },
      create: {
        listId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        sortOrder: dto.sortOrder ?? 0
      }
    });

    return { data: item };
  }

  async removeItem(ownerId: string, listId: string, itemId: string) {
    await this.assertOwner(ownerId, listId);
    await this.prisma.userListItem.deleteMany({
      where: { id: itemId, listId }
    });

    return { data: { itemId, deleted: true } };
  }

  private async getOwnedList(ownerId: string, id: string) {
    const list = await this.prisma.userList.findFirst({
      where: { id, ownerId, deletedAt: null }
    });

    if (list === null) {
      throw new ForbiddenException({
        code: "LIST_FORBIDDEN",
        message: "لا تملك صلاحية تعديل هذه القائمة."
      });
    }

    return list;
  }

  private async assertOwner(ownerId: string, id: string): Promise<void> {
    await this.getOwnedList(ownerId, id);
  }

  private async assertTargetAllowed(
    ownerId: string,
    purpose: "PERSONAL_SAVE" | "PUBLISHER_PUBLIC",
    dto: CreateListItemDto
  ): Promise<void> {
    if (dto.targetType === "POST") {
      const post = await this.prisma.post.findFirst({
        where: {
          id: dto.targetId,
          deletedAt: null,
          status: "PUBLISHED",
          ...(purpose === "PUBLISHER_PUBLIC" ? { authorId: ownerId } : {})
        },
        select: { id: true }
      });
      if (post === null) {
        throw new NotFoundException({
          code: "LIST_TARGET_NOT_FOUND",
          message: "عنصر القائمة غير موجود أو غير متاح."
        });
      }
      return;
    }

    const productWhere: Prisma.ProductWhereInput = {
      id: dto.targetId,
      status: "ACTIVE",
      deletedAt: null
    };
    if (purpose === "PUBLISHER_PUBLIC") {
      productWhere.posts = {
        some: {
          authorId: ownerId,
          status: "PUBLISHED",
          deletedAt: null
        }
      };
    }
    const product = await this.prisma.product.findFirst({
      where: productWhere,
      select: { id: true }
    });
    if (product === null) {
      throw new NotFoundException({
        code: "LIST_TARGET_NOT_FOUND",
        message: "عنصر القائمة غير موجود أو غير متاح."
      });
    }
  }
}
