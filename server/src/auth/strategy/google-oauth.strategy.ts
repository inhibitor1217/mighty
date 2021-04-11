import _ from 'lodash';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Strategy, Profile, VerifyFunction } from 'passport-google-oauth';
import { GoogleOauthEnvironment } from '../../env-config/entity/google-oauth-environment';
import { EnvConfigService } from '../../env-config/env-config.service';
import { UserService } from '../../user/user.service';
import { CreateUserServiceDto } from '../../user/dto/create-user.service.dto';
import { ConsoleColor } from '../../utils/console-color';
import { GOOGLE_OAUTH_STRATEGY_NAME } from '../const';
import { AuthProvider } from '../entity/auth-provider';
@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(
  OAuth2Strategy,
  GOOGLE_OAUTH_STRATEGY_NAME
) {
  private readonly logger: Logger = new Logger('GoogleOauthStrategy');

  private static readonly scope = ['email', 'profile'];

  constructor(
    private envConfig: EnvConfigService,
    private userService: UserService
  ) {
    super({
      clientID: envConfig.get<GoogleOauthEnvironment>('googleOauth')?.clientId,
      clientSecret: envConfig.get<GoogleOauthEnvironment>('googleOauth')
        ?.clientSecret,
      callbackURL: envConfig.get<GoogleOauthEnvironment>('googleOauth')
        ?.redirectUri,
      scope: GoogleOauthStrategy.scope,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyFunction
  ): Promise<void> {
    this.logProfile(profile);

    const authProvider = AuthProvider.parse(profile.provider);
    const authProviderId = profile.id;

    const user =
      (await this.userService.findOneWithProvider(
        authProvider,
        authProviderId
      )) ??
      (await this.userService.createOne(
        CreateUserServiceDto.fromGoogleProfile(profile)
      ));

    done(null, user);
  }

  private logProfile(profile: Profile): void {
    const { provider, id, displayName, username, emails, photos } = profile;
    const profileString = _.compact([
      `${ConsoleColor.apply(
        '[Google Oauth Validation Profile]',
        ConsoleColor.Cyan
      )}`,
      this.profileFieldString('provider', provider),
      this.profileFieldString('id', id),
      this.profileFieldString('displayName', displayName),
      username && this.profileFieldString('username', username),
      emails &&
        this.profileFieldString('email', this.formatProfileEmails(emails)),
      photos &&
        this.profileFieldString('photo', this.formatProfilePhotos(photos)),
    ]).join('\n');
    this.logger.verbose(`\n${profileString}`);
  }

  private profileFieldString(name: string, value: string): string {
    return `${ConsoleColor.apply(
      name,
      ConsoleColor.Magenta
    )} = ${ConsoleColor.apply(value, ConsoleColor.White)}`;
  }

  private formatProfileEmails(emails: { value: string; type?: string }[]) {
    const email = _.first(emails);

    if (_.isNil(email)) {
      return '(empty)';
    }

    return email.value;
  }

  private formatProfilePhotos(photos: { value: string }[]) {
    const photo = _.first(photos);

    if (_.isNil(photo)) {
      return '(empty)';
    }

    return photo.value;
  }
}
