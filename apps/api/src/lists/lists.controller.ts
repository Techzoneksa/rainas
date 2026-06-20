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
import { CreateListItemDto } from "./dto/create-list-item.dto";
import { CreateListDto } from "./dto/create-list.dto";
import { ListQueryDto } from "./dto/list-query.dto";
import { UpdateListDto } from "./dto/update-list.dto";
import { ListsService } from "./lists.service";

@ApiTags("lists")
@Controller()
export class ListsController {
  constructor(private readonly lists: ListsService) {}

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Get("me/lists")
  listMine(@CurrentDemoUser() userId: string, @Query() query: ListQueryDto) {
    return this.lists.listMine(userId, query);
  }

  @Get("users/:username/lists")
  listPublicByUsername(@Param("username") username: string, @Query() query: ListQueryDto) {
    return this.lists.listPublicByUsername(username, query);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Post("me/lists")
  create(@CurrentDemoUser() userId: string, @Body() dto: CreateListDto) {
    return this.lists.create(userId, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Get("me/lists/:id")
  getMine(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.lists.getMine(userId, id);
  }

  @Get("users/:username/lists/:id")
  getPublicByUsername(@Param("username") username: string, @Param("id") id: string) {
    return this.lists.getPublicByUsername(username, id);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Patch("me/lists/:id")
  update(@CurrentDemoUser() userId: string, @Param("id") id: string, @Body() dto: UpdateListDto) {
    return this.lists.update(userId, id, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Delete("me/lists/:id")
  remove(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.lists.remove(userId, id);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Post("me/lists/:id/items")
  addItem(
    @CurrentDemoUser() userId: string,
    @Param("id") id: string,
    @Body() dto: CreateListItemDto
  ) {
    return this.lists.addItem(userId, id, dto);
  }

  @ApiSecurity("demo-user")
  @UseGuards(DemoUserGuard)
  @Delete("me/lists/:id/items/:itemId")
  removeItem(
    @CurrentDemoUser() userId: string,
    @Param("id") id: string,
    @Param("itemId") itemId: string
  ) {
    return this.lists.removeItem(userId, id, itemId);
  }
}
