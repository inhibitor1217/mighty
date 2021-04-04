/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

export enum RdbLoggingOption {
  Query = 'query',
  Schema = 'schema',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Log = 'log',
  Migration = 'migration',
}

export const RdbAllLoggingOption = 'all';

export namespace RdbLoggingOption {
  export const values: string[] = [
    'query',
    'schema',
    'error',
    'warn',
    'info',
    'log',
    'migration',
  ];
}
