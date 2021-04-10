import type { CookieOptions } from 'express';
import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvConfigService } from '../env-config/env-config.service';
import { AppEnvironment } from '../env-config/entity/app-environment';
import { AppStage } from '../env-config/entity/app-stage';
import { AuthEnvironment } from '../env-config/entity/auth-environment';
import { unreachable } from '../utils/unreachable';
import { User } from '../user/model/user.model';
import {
  CLEAR_COOKIE_OPTIONS,
  DEFAULT_COOKIE_OPTIONS,
  DEFAULT_JWT_OPTIONS,
} from './const';
import { AuthToken } from './entity/auth-token';

type SetCookieFn = (key: string, value: string, options: CookieOptions) => void;

@Injectable()
export class AuthService {
  private static readonly authTokenVersion: number = 1;

  constructor(
    private readonly envConfig: EnvConfigService,
    private readonly jwtService: JwtService
  ) {}

  async signAuthCookies(user: User, setCookie: SetCookieFn): Promise<void> {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(AuthToken.AccessToken, user.toAccessTokenPayload()),
      this.signToken(AuthToken.RefreshToken, user.toRefreshTokenPayload()),
    ]);

    setCookie(
      AuthToken.toCookieKey(AuthToken.AccessToken),
      accessToken,
      this.getCookieOptions(AuthToken.AccessToken)
    );

    setCookie(
      AuthToken.toCookieKey(AuthToken.RefreshToken),
      refreshToken,
      this.getCookieOptions(AuthToken.RefreshToken)
    );
  }

  async signToken(token: AuthToken, payload: JsonMap): Promise<string> {
    return this.jwtService.signAsync(
      { ...payload, version: AuthService.authTokenVersion },
      DEFAULT_JWT_OPTIONS[token]
    );
  }

  clearAuthCookies(setCookie: SetCookieFn): void {
    setCookie(
      AuthToken.toCookieKey(AuthToken.AccessToken),
      '',
      this.getCookieOptions(AuthToken.AccessToken, { clear: true })
    );
    setCookie(
      AuthToken.toCookieKey(AuthToken.RefreshToken),
      '',
      this.getCookieOptions(AuthToken.RefreshToken, { clear: true })
    );
  }

  getCookieOptions(
    token: AuthToken,
    options?: { clear: boolean }
  ): CookieOptions {
    const { domain } =
      this.envConfig.get<AuthEnvironment>('auth')?.cookie ?? unreachable();
    const { stage } =
      this.envConfig.get<AppEnvironment>('app') ?? unreachable();
    const forceHttps = this.forceHttpsOnCookie(stage);

    const commonOptions: CookieOptions = {
      domain,
      httpOnly: true,
      path: '/',
      secure: forceHttps,
    };
    const perTokenOptions = DEFAULT_COOKIE_OPTIONS[token];
    const clearOptions = CLEAR_COOKIE_OPTIONS;

    return _.merge(
      {},
      commonOptions,
      perTokenOptions,
      options?.clear && clearOptions
    );
  }

  private forceHttpsOnCookie(appStage: AppStage): boolean {
    return [AppStage.Beta, AppStage.Production].includes(appStage);
  }
}
