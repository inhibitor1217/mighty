import { IsIn, IsOptional, ValidateNested } from 'class-validator';
import { UserState } from '../entity/user-state';
import { PatchUserProfileServiceDto } from './patch-user-profile.service.dto';

export class PatchUserServiceDto {
  @IsOptional()
  @IsIn(UserState.values)
  readonly state?: UserState;

  @IsOptional()
  @ValidateNested()
  readonly profile?: PatchUserProfileServiceDto;
}
