import type { CookieOptions } from 'express';
import { AuthToken } from './entity/auth-token';

export const GOOGLE_OAUTH_STRATEGY_NAME = 'GoogleOauthStrategy';

export const DEFAULT_COOKIE_OPTIONS: {
  [authToken in AuthToken]: CookieOptions;
} = {
  [AuthToken.AccessToken]: {
    maxAge: 1000 * 60 * 5 /* 5m */,
  },
  [AuthToken.RefreshToken]: {
    maxAge: 1000 * 60 * 60 * 24 * 7 /* 7d */,
  },
};

export const CLEAR_COOKIE_OPTIONS: CookieOptions = { maxAge: 0 };
