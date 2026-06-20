import { IsIn, IsOptional } from "class-validator";

import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

export class SavedItemsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(["POST", "PRODUCT"])
  targetType?: "POST" | "PRODUCT";
}
