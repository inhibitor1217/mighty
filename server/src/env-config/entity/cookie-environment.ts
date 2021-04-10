import { EnvironmentString } from '../util/environment-string';
import { BaseEnvironment } from './base-environment';

export type CookieEnvironmentObject = {
  domain: string;
};

export class CookieEnvironment implements BaseEnvironment {
  domain: string;

  private environmentString: EnvironmentString;

  private static readonly domain = 'cookie';

  constructor(
    object: CookieEnvironmentObject,
    getDomain: (field: string) => string
  ) {
    this.domain = object.domain;

    this.environmentString = new EnvironmentString(
      getDomain(CookieEnvironment.domain)
    );
  }

  toString(options: { useColor: boolean }): string {
    this.environmentString.defaultOptions = { useColor: options.useColor };

    return [this.environmentString.field('domain', this.domain)].join('\n');
  }
}
