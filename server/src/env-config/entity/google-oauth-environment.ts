import { EnvironmentString } from '../util/environment-string';
import { BaseEnvironment } from './base-environment';

type GoogleOauthEnvironmentObject = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export class GoogleOauthEnvironment implements BaseEnvironment {
  clientId: string;
  clientSecret: string;
  redirectUri: string;

  private environmentString: EnvironmentString;

  private static readonly domain = 'googleOauth';

  constructor(object: GoogleOauthEnvironmentObject) {
    this.clientId = object.clientId;
    this.clientSecret = object.clientSecret;
    this.redirectUri = object.redirectUri;

    this.environmentString = new EnvironmentString(
      GoogleOauthEnvironment.domain
    );
  }

  toString(options: { useColor: boolean }): string {
    this.environmentString.defaultOptions = { useColor: options.useColor };

    return [
      this.environmentString.field('clientId', this.clientId),
      this.environmentString.field('clientString', this.clientSecret, {
        obfuscate: true,
      }),
      this.environmentString.field('redirectUri', this.redirectUri),
    ].join('\n');
  }
}
