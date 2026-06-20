import { Controller, Get, Param, Patch, Query, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { DemoUserGuard } from "../common/auth/demo-user.guard";
import { CurrentDemoUser } from "../common/decorators/current-demo-user.decorator";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@ApiSecurity("demo-user")
@UseGuards(DemoUserGuard)
@Controller("me/notifications")
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  listMine(@CurrentDemoUser() userId: string, @Query() query: PaginationQueryDto) {
    return this.notifications.listMine(userId, query);
  }

  @Patch(":id/read")
  markRead(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.notifications.markRead(userId, id);
  }

  @Patch("read-all")
  markAllRead(@CurrentDemoUser() userId: string) {
    return this.notifications.markAllRead(userId);
  }
}
