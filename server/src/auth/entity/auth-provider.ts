/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

import { unreachable } from '../../utils/unreachable';

export enum AuthProvider {
  Google = 'google',
}

export namespace AuthProvider {
  export const values: string[] = ['google'];

  export function parse(value: string): AuthProvider {
    switch (value) {
      case 'google':
      case 'Google':
        return AuthProvider.Google;
      default:
        throw new Error(`${value} is not a valid AuthProvider`);
    }
  }

  export function toString(authProvider: AuthProvider): string {
    switch (authProvider) {
      case AuthProvider.Google:
        return 'google';
      default:
        return unreachable();
    }
  }
}
