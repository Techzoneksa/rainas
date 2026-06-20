import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateListDto {
  @IsString()
  @MaxLength(80)
  slug!: string;

  @IsString()
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsIn(["PERSONAL_SAVE", "PUBLISHER_PUBLIC"])
  purpose!: "PERSONAL_SAVE" | "PUBLISHER_PUBLIC";
}
