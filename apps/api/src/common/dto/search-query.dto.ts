import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

import { PaginationQueryDto } from "./pagination-query.dto";

export class SearchQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  brandId?: string;

  @IsOptional()
  @IsIn(["created_desc", "created_asc", "rating_desc", "rating_asc"])
  sort?: "created_desc" | "created_asc" | "rating_desc" | "rating_asc";
}
