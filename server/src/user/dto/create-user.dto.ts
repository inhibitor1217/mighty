import { IsEnum, IsString, ValidateNested } from 'class-validator';
import { Profile as GoogleProfile } from 'passport-google-oauth';
import { AuthProvider } from '../../auth/entity/auth-provider';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class CreateUserDto {
  @IsEnum(AuthProvider)
  provider!: AuthProvider;

  @IsString()
  providerId!: string;

  @ValidateNested()
  profile!: CreateUserProfileDto;

  static fromGoogleProfile(profile: GoogleProfile): CreateUserDto {
    return {
      provider: AuthProvider.parse(profile.provider),
      providerId: profile.id,
      profile: CreateUserProfileDto.fromGoogleProfile(profile),
    };
  }
}
