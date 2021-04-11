import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateRoomServiceDto {
  @IsInt()
  readonly userId!: number;

  @IsString()
  @Length(1, 255)
  readonly name!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8)
  readonly maxPlayers?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(8)
  readonly maxObservers?: number;
}
