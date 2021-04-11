/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

import { unreachable } from '../../utils/unreachable';

export enum AuthProvider {
  Google = 'google',

  Mock = 'mock',
}

export namespace AuthProvider {
  export const values: string[] = ['google'];

  export function parse(value: string): AuthProvider {
    switch (value) {
      case 'google':
      case 'Google':
        return AuthProvider.Google;
      case 'mock':
        return AuthProvider.Mock;
      default:
        throw new Error(`${value} is not a valid AuthProvider`);
    }
  }

  export function toString(authProvider: AuthProvider): string {
    switch (authProvider) {
      case AuthProvider.Google:
        return 'google';
      case AuthProvider.Mock:
        return 'mock';
      default:
        return unreachable();
    }
  }
}
