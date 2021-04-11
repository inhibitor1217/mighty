import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class PatchRoomDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  maxPlayers?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(8)
  maxObservers?: number;
}
