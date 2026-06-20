import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../database/prisma.service";
import { UpdateSettingDto } from "./dto/update-setting.dto";

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const settings = await this.prisma.appSetting.findMany({
      orderBy: { key: "asc" }
    });

    return { data: settings };
  }

  async update(actorId: string, key: string, dto: UpdateSettingDto) {
    await this.assertAdmin(actorId);
    const updateData: Prisma.AppSettingUncheckedUpdateInput = {
      value: this.toJson(dto.value),
      valueType: dto.valueType ?? "JSON",
      updatedById: actorId
    };
    const createData: Prisma.AppSettingUncheckedCreateInput = {
      key,
      value: this.toJson(dto.value),
      valueType: dto.valueType ?? "JSON",
      updatedById: actorId
    };
    if (dto.description !== undefined) {
      updateData.description = dto.description;
      createData.description = dto.description;
    }

    const setting = await this.prisma.appSetting.upsert({
      where: { key },
      update: updateData,
      create: createData
    });

    await this.prisma.adminAuditLog.create({
      data: {
        actorId,
        action: "setting.updated",
        targetType: "setting",
        targetId: key,
        metadata: { key }
      }
    });

    return { data: setting };
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    if (value === undefined) {
      throw new BadRequestException({
        code: "SETTING_VALUE_REQUIRED",
        message: "قيمة الإعداد مطلوبة."
      });
    }

    return value as Prisma.InputJsonValue;
  }

  private async assertAdmin(actorId: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: actorId,
        role: { in: ["OWNER", "ADMIN"] },
        status: "ACTIVE",
        deletedAt: null
      },
      select: { id: true }
    });

    if (user === null) {
      throw new ForbiddenException({
        code: "ADMIN_FORBIDDEN",
        message: "هذا المسار مخصص للإدارة."
      });
    }
  }
}
