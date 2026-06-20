import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { DemoUserGuard } from "../common/auth/demo-user.guard";
import { CurrentDemoUser } from "../common/decorators/current-demo-user.decorator";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@ApiTags("comments")
@Controller()
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get("comments/:id")
  getById(@Param("id") id: string) {
    return this.comments.getById(id);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Post("posts/:postId/comments")
  createForPost(
    @CurrentDemoUser() userId: string,
    @Param("postId") postId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.comments.createForPost(userId, postId, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Post("products/:productId/comments")
  createForProduct(
    @CurrentDemoUser() userId: string,
    @Param("productId") productId: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.comments.createForProduct(userId, productId, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Post("comments/:id/replies")
  reply(@CurrentDemoUser() userId: string, @Param("id") id: string, @Body() dto: CreateCommentDto) {
    return this.comments.reply(userId, id, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Patch("comments/:id")
  update(
    @CurrentDemoUser() userId: string,
    @Param("id") id: string,
    @Body() dto: CreateCommentDto
  ) {
    return this.comments.update(userId, id, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Delete("comments/:id")
  remove(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.comments.remove(userId, id);
  }
}
