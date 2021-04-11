import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { Profile as GoogleProfile } from 'passport-google-oauth';
import { AuthProvider } from '../../auth/entity/auth-provider';
import { CreateUserProfileServiceDto } from './create-user-profile.service.dto';

export class CreateUserServiceDto {
  @IsEnum(AuthProvider)
  readonly provider!: AuthProvider;

  @IsString()
  readonly providerId!: string;

  @ValidateNested()
  readonly profile!: CreateUserProfileServiceDto;

  static fromGoogleProfile(profile: GoogleProfile): CreateUserServiceDto {
    return {
      provider: AuthProvider.parse(profile.provider),
      providerId: profile.id,
      profile: CreateUserProfileServiceDto.fromGoogleProfile(profile),
    };
  }
}
