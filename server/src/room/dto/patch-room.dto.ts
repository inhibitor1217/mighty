import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { PatchRoomServiceDto } from './patch-room.service.dto';

export class PatchRoomDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  readonly name?: string;

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

  toServiceDto(): PatchRoomServiceDto {
    return {
      name: this.name,
      maxPlayers: this.maxPlayers,
      maxObservers: this.maxObservers,
    };
  }
}
