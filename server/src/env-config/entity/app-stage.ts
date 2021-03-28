/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

import { unreachable } from '../../utils';

export enum AppStage {
  Development = 'development',
  Beta = 'beta',
  Production = 'production',
}

export namespace AppStage {
  export const values: string[] = ['development', 'beta', 'production'];

  export function parse(value: string): AppStage {
    switch (value) {
      case 'development':
      case 'Development':
      case 'dev':
      case 'Dev':
        return AppStage.Development;
      case 'beta':
      case 'Beta':
        return AppStage.Beta;
      case 'production':
      case 'Production':
      case 'prod':
      case 'Prod':
      case 'release':
      case 'Release':
        return AppStage.Production;
      default:
        throw new Error(`${value} is not a valid AppStage`);
    }
  }

  export function toString(appStage: AppStage): string {
    switch (appStage) {
      case AppStage.Development:
        return 'development';
      case AppStage.Beta:
        return 'beta';
      case AppStage.Production:
        return 'production';
      default:
        return unreachable();
    }
  }
}
