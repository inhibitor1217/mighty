import { BaseEnvironment } from './base-environment';
import {
  SingleDatabaseEnvironment,
  SingleDatabaseEnvironmentObject,
} from './single-database-environment';

type DatabaseEnvironmentObject = {
  postgres: SingleDatabaseEnvironmentObject;
};

export class DatabaseEnvironment implements BaseEnvironment {
  postgres: SingleDatabaseEnvironment;

  private static readonly domain = 'database';

  constructor(object: DatabaseEnvironmentObject) {
    this.postgres = new SingleDatabaseEnvironment(
      object.postgres,
      DatabaseEnvironment.subFieldDomain('postgres')
    );
  }

  private static subFieldDomain(field: string): string {
    return `${this.domain}.${field}`;
  }

  toString(options: { useColor: boolean }): string {
    const stringOptions = { useColor: options.useColor };

    return [this.postgres.toString(stringOptions)].join('\n');
  }
}
