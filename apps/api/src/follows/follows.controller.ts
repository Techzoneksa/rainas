import { Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { DemoUserGuard } from "../common/auth/demo-user.guard";
import { CurrentDemoUser } from "../common/decorators/current-demo-user.decorator";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { FollowsService } from "./follows.service";

@ApiTags("follows")
@ApiSecurity("demo-user")
@UseGuards(DemoUserGuard)
@Controller()
export class FollowsController {
  constructor(private readonly follows: FollowsService) {}

  @Get("me/following")
  listFollowing(@CurrentDemoUser() userId: string, @Query() query: PaginationQueryDto) {
    return this.follows.listFollowing(userId, query);
  }

  @Post("users/:id/follow")
  follow(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.follows.follow(userId, id);
  }

  @Delete("users/:id/follow")
  unfollow(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.follows.unfollow(userId, id);
  }
}
