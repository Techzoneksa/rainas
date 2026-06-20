import { IsIn, IsOptional } from "class-validator";

import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

export class ListQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(["PERSONAL_SAVE", "PUBLISHER_PUBLIC"])
  purpose?: "PERSONAL_SAVE" | "PUBLISHER_PUBLIC";
}
