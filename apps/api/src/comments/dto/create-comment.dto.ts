import { IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @MaxLength(1200)
  body!: string;
}
