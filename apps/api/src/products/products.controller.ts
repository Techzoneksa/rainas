import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { SearchQueryDto } from "../common/dto/search-query.dto";
import { ProductsService } from "./products.service";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  list(@Query() query: SearchQueryDto) {
    return this.products.list(query);
  }

  @Get(":slug")
  getBySlug(@Param("slug") slug: string) {
    return this.products.getBySlug(slug);
  }

  @Get(":id/posts")
  listPosts(@Param("id") id: string, @Query() query: PaginationQueryDto) {
    return this.products.listPosts(id, query);
  }

  @Get(":id/comments")
  listComments(@Param("id") id: string, @Query() query: PaginationQueryDto) {
    return this.products.listComments(id, query);
  }
}
