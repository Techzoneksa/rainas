import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getByUsername(username: string) {
    const profile = await this.prisma.profile.findFirst({
      where: {
        username,
        deletedAt: null,
        user: {
          deletedAt: null,
          status: "ACTIVE"
        }
      },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    if (profile === null) {
      throw new NotFoundException({
        code: "PROFILE_NOT_FOUND",
        message: "الملف الشخصي غير موجود."
      });
    }

    return { data: profile };
  }

  async getMine(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId }
    });

    if (profile === null) {
      throw new NotFoundException({
        code: "PROFILE_NOT_FOUND",
        message: "الملف الشخصي غير موجود."
      });
    }

    return { data: profile };
  }

  async updateMine(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.update({
      where: { userId },
      data: dto
    });

    return { data: profile };
  }
}
