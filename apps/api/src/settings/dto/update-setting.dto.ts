import { IsDefined, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateSettingDto {
  @IsDefined()
  value!: unknown;

  @IsOptional()
  @IsIn(["STRING", "BOOLEAN", "NUMBER", "JSON"])
  valueType?: "STRING" | "BOOLEAN" | "NUMBER" | "JSON";

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
