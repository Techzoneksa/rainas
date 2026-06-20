import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateListItemDto {
  @IsIn(["POST", "PRODUCT"])
  targetType!: "POST" | "PRODUCT";

  @IsString()
  targetId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
