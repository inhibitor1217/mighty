import { EnvironmentString } from '../util/environment-string';
import { BaseEnvironment } from './base-environment';

export type JwtEnvironmentObject = {
  issuer: string;
  secret: string;
};

export class JwtEnvironment implements BaseEnvironment {
  issuer: string;
  secret: string;

  private environmentString: EnvironmentString;

  private static readonly domain = 'jwt';

  constructor(
    object: JwtEnvironmentObject,
    getDomain: (field: string) => string
  ) {
    this.issuer = object.issuer;
    this.secret = object.secret;

    this.environmentString = new EnvironmentString(
      getDomain(JwtEnvironment.domain)
    );
  }

  toString(options: { useColor: boolean }): string {
    this.environmentString.defaultOptions = { useColor: options.useColor };

    return [
      this.environmentString.field('issuer', this.issuer),
      this.environmentString.field('secret', this.secret, { obfuscate: true }),
    ].join('\n');
  }
}
