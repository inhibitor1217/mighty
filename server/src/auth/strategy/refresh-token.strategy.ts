import type { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthEnvironment } from '../../env-config/entity/auth-environment';
import { EnvConfigService } from '../../env-config/env-config.service';
import { REFRESH_TOKEN_STRATEGY_NAME } from '../const';
import { AuthToken } from '../entity/auth-token';
import { unreachable } from '../../utils/unreachable';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  REFRESH_TOKEN_STRATEGY_NAME
) {
  constructor(private readonly envConfig: EnvConfigService) {
    super({
      secretOrKey:
        envConfig.get<AuthEnvironment>('auth')?.jwt.secret ?? unreachable(),
      jwtFromRequest: RefreshTokenStrategy.jwtFromRequest,
      issuer:
        envConfig.get<AuthEnvironment>('auth')?.jwt.issuer ?? unreachable(),
      jsonWebTokenOptions: {
        subject: AuthToken.toJwtSubject(AuthToken.RefreshToken),
      },
    });
  }

  validate(payload: AnyJson): AnyJson {
    return payload;
  }

  private static jwtFromRequest(req: Request): string | null {
    return req.cookies[AuthToken.toCookieKey(AuthToken.RefreshToken)];
  }
}
