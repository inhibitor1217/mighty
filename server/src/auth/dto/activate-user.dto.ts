import { IsOptional, IsString, Length } from 'class-validator';
import { PatchUserServiceDto } from '../../user/dto/patch-user.service.dto';
import { UserState } from '../../user/entity/user-state';

export class ActivateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 255)
  readonly displayName?: string;

  toServiceDto(): PatchUserServiceDto {
    return {
      state: UserState.Active,
      profile: {
        displayName: this.displayName,
      },
    };
  }
}
