import { IsOptional, IsString, Length } from 'class-validator';

export class PatchUserProfileServiceDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  readonly displayName?: string;
}
