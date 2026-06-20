import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { DemoUserGuard } from "../common/auth/demo-user.guard";
import { CurrentDemoUser } from "../common/decorators/current-demo-user.decorator";
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("users")
  list(@Query() query: PaginationQueryDto) {
    return this.users.list(query);
  }

  @Get("users/:id")
  getById(@Param("id") id: string) {
    return this.users.getById(id);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Get("me")
  getMe(@CurrentDemoUser() userId: string) {
    return this.users.getById(userId);
  }
}
