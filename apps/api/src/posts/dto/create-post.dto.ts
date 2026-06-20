import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min
} from "class-validator";

export class CreatePostDto {
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  publicListId?: string;

  @IsInt()
  @Min(1)
  @Max(10)
  rating!: number;

  @IsString()
  @MaxLength(140)
  title!: string;

  @IsString()
  @MaxLength(5000)
  body!: string;

  @IsOptional()
  @IsIn(["DRAFT", "PUBLISHED"])
  status?: "DRAFT" | "PUBLISHED";

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  pros?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  cons?: string[];
}
