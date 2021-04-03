import { EnvironmentString } from '../util/environment-string';
import { BaseEnvironment } from './base-environment';

export type SingleDatabaseEnvironmentObject = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
};

export class SingleDatabaseEnvironment implements BaseEnvironment {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;

  private environmentString: EnvironmentString;

  constructor(object: SingleDatabaseEnvironmentObject, domain: string) {
    this.host = object.host;
    this.port = object.port;
    this.username = object.username;
    this.password = object.password;
    this.database = object.database;
    this.synchronize = object.synchronize;

    this.environmentString = new EnvironmentString(domain);
  }

  toString(options: { useColor: boolean }): string {
    const stringOptions = { useColor: options.useColor };

    return [
      this.environmentString.field('host', this.host, stringOptions),
      this.environmentString.field('port', this.port, stringOptions),
      this.environmentString.field('username', this.username, stringOptions),
      this.environmentString.field('password', this.password, {
        ...stringOptions,
        obfuscate: true,
      }),
      this.environmentString.field('database', this.database, stringOptions),
      this.environmentString.field(
        'synchronize',
        this.synchronize,
        stringOptions
      ),
    ].join('\n');
  }
}
