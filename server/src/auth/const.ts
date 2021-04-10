import { JwtSignOptions } from '@nestjs/jwt';
import type { CookieOptions } from 'express';
import { AuthToken } from './entity/auth-token';

export const ACCESS_TOKEN_STRATEGY_NAME = 'AccessTokenStrategy';
export const GOOGLE_OAUTH_STRATEGY_NAME = 'GoogleOauthStrategy';
export const REFRESH_TOKEN_STRATEGY_NAME = 'RefreshTokenStrategy';

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

export const DEFAULT_JWT_OPTIONS: {
  [authToken in AuthToken]: JwtSignOptions;
} = {
  [AuthToken.AccessToken]: {
    subject: AuthToken.toJwtSubject(AuthToken.AccessToken),
    expiresIn: '5m',
  },
  [AuthToken.RefreshToken]: {
    subject: AuthToken.toJwtSubject(AuthToken.RefreshToken),
    expiresIn: '7d',
  },
};
