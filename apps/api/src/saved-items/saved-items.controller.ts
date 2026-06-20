import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiSecurity, ApiTags } from "@nestjs/swagger";

import { DemoUserGuard } from "../common/auth/demo-user.guard";
import { CurrentDemoUser } from "../common/decorators/current-demo-user.decorator";
import { CreateSavedItemDto } from "./dto/create-saved-item.dto";
import { SavedItemsQueryDto } from "./dto/saved-items-query.dto";
import { SavedItemsService } from "./saved-items.service";

@ApiTags("saved")
@ApiSecurity("demo-user")
@UseGuards(DemoUserGuard)
@Controller("me/saved")
export class SavedItemsController {
  constructor(private readonly savedItems: SavedItemsService) {}

  @Get()
  listMine(@CurrentDemoUser() userId: string, @Query() query: SavedItemsQueryDto) {
    return this.savedItems.listMine(userId, query);
  }

  @Post()
  save(@CurrentDemoUser() userId: string, @Body() dto: CreateSavedItemDto) {
    return this.savedItems.save(userId, dto);
  }

  @Delete(":id")
  remove(@CurrentDemoUser() userId: string, @Param("id") id: string) {
    return this.savedItems.remove(userId, id);
  }
}
