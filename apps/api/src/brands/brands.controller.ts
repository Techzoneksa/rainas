import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { BrandsService } from "./brands.service";

@ApiTags("brands")
@Controller("brands")
export class BrandsController {
  constructor(private readonly brands: BrandsService) {}

  @Get()
  list(@Query() query: PaginationQueryDto) {
    return this.brands.list(query);
  }

  @Get(":slug")
  getBySlug(@Param("slug") slug: string) {
    return this.brands.getBySlug(slug);
  }
}
