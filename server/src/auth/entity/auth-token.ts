/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

import { unreachable } from '../../utils/unreachable';

export enum AuthToken {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
}

export namespace AuthToken {
  export function toJwtSubject(authToken: AuthToken): string {
    switch (authToken) {
      case AuthToken.AccessToken:
        return 'access_token';
      case AuthToken.RefreshToken:
        return 'refresh_token';
      default:
        return unreachable();
    }
  }

  export function toCookieKey(authToken: AuthToken): string {
    switch (authToken) {
      case AuthToken.AccessToken:
        return 'access_token';
      case AuthToken.RefreshToken:
        return 'refresh_token';
      default:
        return unreachable();
    }
  }
}
