import { IsIn, IsString } from "class-validator";

export class CreateSavedItemDto {
  @IsIn(["POST", "PRODUCT"])
  targetType!: "POST" | "PRODUCT";

  @IsString()
  targetId!: string;
}
