import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { DemoUserGuard } from "../common/auth/demo-user.guard";
import { CurrentDemoUser } from "../common/decorators/current-demo-user.decorator";
import { SearchQueryDto } from "../common/dto/search-query.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { PostsService } from "./posts.service";

@ApiTags("posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  list(@Query() query: SearchQueryDto) {
    return this.posts.list(query);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.posts.getById(id);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Post()
  create(@CurrentDemoUser() userId: string, @Body() dto: CreatePostDto) {
    return this.posts.create(userId, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Patch(":id")
  update(@CurrentDemoUser() userId: string, @Param("id") id: string, @Body() dto: UpdatePostDto) {
    return this.posts.update(userId, id, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Patch(":id/publish")
  publish(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.posts.publish(userId, id);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Delete(":id")
  remove(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.posts.remove(userId, id);
  }
}
