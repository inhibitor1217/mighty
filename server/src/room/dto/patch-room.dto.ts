import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { Session } from '../model/session.model';
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

  @IsOptional()
  @IsInt()
  readonly ownerUserId?: number;

  toServiceDto(session: Session): PatchRoomServiceDto {
    return {
      roomId: session.roomId,
      sessionId: session.id,
      name: this.name,
      maxPlayers: this.maxPlayers,
      maxObservers: this.maxObservers,
      ownerUserId: this.ownerUserId,
    };
  }
}
