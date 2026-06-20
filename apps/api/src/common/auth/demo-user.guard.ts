import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";

import { getApiRuntimeConfig } from "../../config/app.config";
import { PrismaService } from "../../database/prisma.service";
import type { RequestWithId } from "../middleware/request-id.middleware";

export const DEMO_USER_HEADER = "x-demo-user-id";

export type DemoUserRequest = RequestWithId & {
  demoUserId?: string;
};

@Injectable()
export class DemoUserGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = getApiRuntimeConfig();
    if (config.environment === "production") {
      throw new ForbiddenException({
        code: "DEMO_IDENTITY_DISABLED",
        message: "هوية التطوير غير مفعلة في الإنتاج."
      });
    }

    const request = context.switchToHttp().getRequest<DemoUserRequest>();
    const headerValue = request.headers[DEMO_USER_HEADER];
    const demoUserId = Array.isArray(headerValue) ? headerValue[0] : headerValue;

    if (demoUserId === undefined || demoUserId.trim().length === 0) {
      throw new UnauthorizedException({
        code: "DEMO_USER_REQUIRED",
        message: "أرسل X-Demo-User-Id لاستخدام هذا المسار في بيئة التطوير."
      });
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: demoUserId,
        deletedAt: null,
        status: "ACTIVE"
      },
      select: { id: true }
    });

    if (user === null) {
      throw new UnauthorizedException({
        code: "DEMO_USER_NOT_FOUND",
        message: "مستخدم التطوير غير موجود أو غير نشط."
      });
    }

    request.demoUserId = user.id;
    return true;
  }
}
