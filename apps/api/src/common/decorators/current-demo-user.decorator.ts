import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import type { DemoUserRequest } from "../auth/demo-user.guard";

export const CurrentDemoUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<DemoUserRequest>();
    return request.demoUserId ?? "";
  }
);
