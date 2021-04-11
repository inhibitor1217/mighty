import { IsEmail, IsString, IsUrl, Length, ValidateIf } from 'class-validator';
import _ from 'lodash';
import { Profile as GoogleProfile } from 'passport-google-oauth';

function getFirstValueOrNull<T extends { value: string }>(
  array: T[] | undefined
): string | null {
  if (_.isNil(array)) {
    return null;
  }

  const element = _.first(array);
  if (_.isNil(element)) {
    return null;
  }

  return element.value;
}

export class CreateUserProfileServiceDto {
  @IsString()
  @Length(1, 255)
  readonly displayName!: string;

  @IsString()
  @Length(1, 255)
  @ValidateIf((object, value) => _.isNil(value))
  readonly username!: string | null;

  @IsEmail()
  @ValidateIf((object, value) => _.isNil(value))
  readonly email!: string | null;

  @IsUrl()
  @ValidateIf((object, value) => _.isNil(value))
  readonly photo!: string | null;

  static fromGoogleProfile(
    profile: GoogleProfile
  ): CreateUserProfileServiceDto {
    return {
      displayName: profile.displayName,
      username: profile.username ?? null,
      email: getFirstValueOrNull(profile.emails),
      photo: getFirstValueOrNull(profile.photos),
    };
  }
}
