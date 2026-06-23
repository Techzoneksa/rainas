import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { createPageResult, getPagination } from "../common/pagination/pagination";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async listFollowing(userId: string, query: PaginationQueryDto) {
    const where: Prisma.FollowWhereInput = { followerId: userId };
    const page = query.page;
    const limit = query.limit;
    const { skip, take } = getPagination(page, limit);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.follow.findMany({
        where,
        include: {
          following: { include: { profile: true } }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take
      }),
      this.prisma.follow.count({ where })
    ]);

    return createPageResult(data, total, page, limit);
  }

  async listFollowingPosts(userId: string, query: PaginationQueryDto) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    const followingIds = following.map((follow) => follow.followingId);
    const where: Prisma.PostWhereInput = {
      authorId: { in: followingIds },
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
          publicList: true,
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

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException({
        code: "SELF_FOLLOW_NOT_ALLOWED",
        message: "لا يمكن متابعة حسابك نفسه."
      });
    }

    const target = await this.prisma.user.findFirst({
      where: { id: followingId, deletedAt: null, status: "ACTIVE" },
      select: { id: true }
    });
    if (target === null) {
      throw new NotFoundException({
        code: "USER_NOT_FOUND",
        message: "المستخدم غير موجود."
      });
    }

    const follow = await this.prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId,
          followingId
        }
      },
      update: {},
      create: {
        followerId,
        followingId
      }
    });

    return { data: follow };
  }

  async unfollow(followerId: string, followingId: string) {
    await this.prisma.follow.deleteMany({
      where: {
        followerId,
        followingId
      }
    });

    return { data: { followingId, deleted: true } };
  }
}
