import type { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthEnvironment } from '../../env-config/entity/auth-environment';
import { EnvConfigService } from '../../env-config/env-config.service';
import { unreachable } from '../../utils/unreachable';
import { ACCESS_TOKEN_STRATEGY_NAME } from '../const';
import { AuthToken } from '../entity/auth-token';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY_NAME
) {
  constructor(private readonly envConfig: EnvConfigService) {
    super({
      secretOrKey:
        envConfig.get<AuthEnvironment>('auth')?.jwt.secret ?? unreachable(),
      jwtFromRequest: AccessTokenStrategy.jwtFromRequest,
      issuer:
        envConfig.get<AuthEnvironment>('auth')?.jwt.issuer ?? unreachable(),
      jsonWebTokenOptions: {
        subject: AuthToken.toJwtSubject(AuthToken.AccessToken),
      },
    });
  }

  validate(payload: AnyJson): AnyJson {
    return payload;
  }

  private static jwtFromRequest(req: Request): string | null {
    return req.cookies(AuthToken.toCookieKey(AuthToken.AccessToken));
  }
}
