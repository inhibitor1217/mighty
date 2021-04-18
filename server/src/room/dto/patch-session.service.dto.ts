import { IsIn, IsOptional } from 'class-validator';
import { SessionType } from '../entity/session-type';

export class PatchSessionServiceDto {
  @IsOptional()
  @IsIn(SessionType.values)
  type?: SessionType;
}
