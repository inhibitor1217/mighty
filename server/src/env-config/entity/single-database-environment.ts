import _ from 'lodash';
import {
  RdbAllLoggingOption,
  RdbLoggingOption,
} from '../../rdb/entity/rdb-logging-option';
import { EnvironmentString } from '../util/environment-string';
import { BaseEnvironment } from './base-environment';

export type SingleDatabaseEnvironmentObject = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean | typeof RdbAllLoggingOption | RdbLoggingOption[];
};

export class SingleDatabaseEnvironment implements BaseEnvironment {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean | typeof RdbAllLoggingOption | RdbLoggingOption[];

  private environmentString: EnvironmentString;

  constructor(object: SingleDatabaseEnvironmentObject, domain: string) {
    this.host = object.host;
    this.port = object.port;
    this.username = object.username;
    this.password = object.password;
    this.database = object.database;
    this.synchronize = object.synchronize;
    this.logging = object.logging;

    this.environmentString = new EnvironmentString(domain);
  }

  toString(options: { useColor: boolean }): string {
    this.environmentString.defaultOptions = { useColor: options.useColor };

    return [
      this.environmentString.field('host', this.host),
      this.environmentString.field('port', this.port),
      this.environmentString.field('username', this.username),
      this.environmentString.field('password', this.password, {
        obfuscate: true,
      }),
      this.environmentString.field('database', this.database),
      this.environmentString.field('synchronize', this.synchronize),
      this.environmentString.field(
        'logging',
        _.isArray(this.logging) ? this.logging.join(', ') : this.logging
      ),
    ].join('\n');
  }
}
