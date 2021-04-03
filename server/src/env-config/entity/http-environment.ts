import { EnvironmentString } from '../util/environment-string';
import { BaseEnvironment } from './base-environment';

type HttpEnvironmentObject = {
  port: number;
};

export class HttpEnvironment implements BaseEnvironment {
  port: number;

  private environmentString: EnvironmentString;

  private static readonly domain = 'http';

  constructor(object: HttpEnvironmentObject) {
    this.port = object.port;

    this.environmentString = new EnvironmentString(HttpEnvironment.domain);
  }

  toString(options: { useColor: boolean }): string {
    this.environmentString.defaultOptions = { useColor: options.useColor };

    return [this.environmentString.field('port', this.port)].join('\n');
  }
}
