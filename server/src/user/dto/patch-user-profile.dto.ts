import { PatchUserProfileServiceDto } from './patch-user-profile.service.dto';

export class PatchUserProfileDto extends PatchUserProfileServiceDto {
  toServiceDto(): PatchUserProfileServiceDto {
    return this;
  }
}
