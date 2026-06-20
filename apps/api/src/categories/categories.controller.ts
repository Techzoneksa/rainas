import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { CategoriesService } from "./categories.service";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  list(@Query() query: PaginationQueryDto) {
    return this.categories.list(query);
  }

  @Get(":slug")
  getBySlug(@Param("slug") slug: string) {
    return this.categories.getBySlug(slug);
  }
}
