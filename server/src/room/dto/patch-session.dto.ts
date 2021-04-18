import { IsIn, IsOptional } from 'class-validator';
import { SessionType } from '../entity/session-type';
import { PatchSessionServiceDto } from './patch-session.service.dto';

export class PatchSessionDto {
  @IsOptional()
  @IsIn(SessionType.values)
  readonly type?: SessionType;

  toServiceDto(): PatchSessionServiceDto {
    return {
      type: this.type,
    };
  }
}
