import { EnvironmentString } from '../util/environment-string';
import { BaseEnvironment } from './base-environment';

export type CorsEnvironmentObject = {
  origin: string[];
};

export class CorsEnvironment implements BaseEnvironment {
  origin: string[];

  private environmentString: EnvironmentString;

  private static readonly domain = 'cors';

  constructor(object: CorsEnvironmentObject) {
    this.origin = object.origin;

    this.environmentString = new EnvironmentString(CorsEnvironment.domain);
  }

  toString(options: { useColor: boolean }): string {
    this.environmentString.defaultOptions = { useColor: options.useColor };

    return [this.environmentString.field('origin', this.origin)].join('\n');
  }
}
