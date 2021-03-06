import type { Request, Response } from 'express';
import _ from 'lodash';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { authenticate } from 'passport';
import type { AuthenticateOptions } from 'passport';
import { User } from '../../user/model/user.model';
import {
  ACCESS_TOKEN_STRATEGY_NAME,
  REFRESH_TOKEN_STRATEGY_NAME,
} from '../const';
import { InvalidTokenPayloadException } from '../../user/exception/invalid-token-payload.exception';
import { AuthToken } from '../entity/auth-token';
import { unreachable } from '../../utils/unreachable';
import { UserService } from '../../user/user.service';
import { MetadataKeys } from '../../utils/metadata-keys';
import { AuthService } from '../auth.service';

type PassportAuthenticateCallbackAuthInfo = {
  message: string;
};
type PassportAuthenticateCallback<PayloadType, ReturnType> = (
  err: Error | null,
  payload: PayloadType,
  info: PassportAuthenticateCallbackAuthInfo
) => ReturnType;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private static readonly authenticateUserProperty = 'user';
  private static readonly authenticateOptions: AuthenticateOptions = {
    session: false,
    userProperty: JwtAuthGuard.authenticateUserProperty,
  };

  constructor(
    private reflector: Reflector,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const user = await this.authorizeWithTokens(req, res, context);

    req[JwtAuthGuard.authenticateUserProperty] = user;
    return true;
  }

  private async authorizeWithTokens(
    req: Request,
    res: Response,
    context: ExecutionContext
  ): Promise<User> {
    try {
      return await this.authorizeWithAccessToken(req, res, context);
    } catch (accessTokenErr) {
      try {
        const user = await this.authorizeWithRefreshToken(req, res, context);
        await this.authService.signAuthCookies(user, res.cookie.bind(res));
        return user;
      } catch (refreshTokenErr) {
        if (this.isNonExistentTokenException(refreshTokenErr)) {
          throw accessTokenErr;
        }
        throw refreshTokenErr;
      }
    }
  }

  private async authorizeWithAccessToken(
    req: Request,
    res: Response,
    context: ExecutionContext
  ): Promise<User> {
    const exceptionMessagePrefix = this.getPassportExceptionMessagePrefix(
      AuthToken.AccessToken
    );

    const accessTokenPayload = await this.getPassportFn(req, res)(
      ACCESS_TOKEN_STRATEGY_NAME,
      JwtAuthGuard.authenticateOptions,
      (err, payload, info) => {
        if (!_.isNil(err)) {
          throw err;
        }
        if (_.isBoolean(payload) && !payload) {
          this.checkPassportAuthenticateCallbackAuthInfo(
            info,
            AuthToken.AccessToken
          );

          throw new UnauthorizedException();
        }
        return payload;
      }
    );

    const { version: tokenVersion, ...payload } = accessTokenPayload;

    if (_.isNil(tokenVersion)) {
      throw new UnauthorizedException(
        `${exceptionMessagePrefix}: no version specified`
      );
    }

    try {
      const user = User.fromAccessTokenPayload(payload);
      this.filterAuthorizableUser(user, context);
      return user;
    } catch (e) {
      if (e instanceof InvalidTokenPayloadException) {
        throw new UnauthorizedException(
          `${exceptionMessagePrefix}: invalid payload`
        );
      }

      throw e;
    }
  }

  private async authorizeWithRefreshToken(
    req: Request,
    res: Response,
    context: ExecutionContext
  ): Promise<User> {
    const exceptionMessagePrefix = this.getPassportExceptionMessagePrefix(
      AuthToken.RefreshToken
    );

    const refreshTokenPayload = await this.getPassportFn(req, res)(
      REFRESH_TOKEN_STRATEGY_NAME,
      JwtAuthGuard.authenticateOptions,
      (err, payload, info) => {
        if (!_.isNil(err)) {
          throw err;
        }
        if (_.isBoolean(payload) && !payload) {
          this.checkPassportAuthenticateCallbackAuthInfo(
            info,
            AuthToken.RefreshToken
          );

          throw new UnauthorizedException();
        }
        return payload;
      }
    );

    const { version: tokenVersion, id, state } = refreshTokenPayload;

    if (_.isNil(tokenVersion)) {
      throw new UnauthorizedException(
        `${exceptionMessagePrefix}: no version specified`
      );
    }

    if (!_.isNumber(id) || !_.isString(state)) {
      throw new UnauthorizedException(
        `${exceptionMessagePrefix}: invalid payload`
      );
    }

    const user = await this.userService.findOneById(id);

    if (_.isNil(user)) {
      throw new UnauthorizedException('User not found');
    }

    this.filterAuthorizableUser(user, context);

    return user;
  }

  private getPassportFn<T extends JsonMap>(req: Request, res: Response) {
    return async function passportFn(
      strategyName: string,
      options: AuthenticateOptions,
      callback: PassportAuthenticateCallback<T, T>
    ): Promise<T> {
      return new Promise<T>((resolve, reject) =>
        authenticate(strategyName, options, (err, payload, info) => {
          try {
            return resolve(callback(err, payload, info));
          } catch (e) {
            return reject(e);
          }
        })(req, res, _.noop)
      );
    };
  }

  private checkPassportAuthenticateCallbackAuthInfo(
    authInfo: PassportAuthenticateCallbackAuthInfo,
    authToken: AuthToken
  ): void {
    const { message } = authInfo;
    const exceptionMessagePrefix = this.getPassportExceptionMessagePrefix(
      authToken
    );

    if (['No auth token'].includes(message)) {
      throw new UnauthorizedException('No auth token provided');
    }

    if (['jwt malformed', 'invalid signature'].includes(message)) {
      throw new UnauthorizedException(exceptionMessagePrefix);
    }

    if (['jwt subject invalid'].some((prefix) => message.startsWith(prefix))) {
      throw new UnauthorizedException(
        `${exceptionMessagePrefix}: wrong subject`
      );
    }

    if (['jwt issuer invalid'].some((prefix) => message.startsWith(prefix))) {
      throw new UnauthorizedException(
        `${exceptionMessagePrefix}: wrong issuer`
      );
    }

    if (['jwt expired'].includes(message)) {
      throw new UnauthorizedException(
        `${exceptionMessagePrefix}: token expired`
      );
    }
  }

  private isNonExistentTokenException(e: Error): boolean {
    return e.message.includes('No auth token provided');
  }

  private getPassportExceptionMessagePrefix(authToken: AuthToken): string {
    switch (authToken) {
      case AuthToken.AccessToken:
        return 'Invalid access token';
      case AuthToken.RefreshToken:
        return 'Invalid refresh token';
      default:
        return unreachable();
    }
  }

  private filterAuthorizableUser(user: User, context: ExecutionContext): void {
    if (user.isBanned()) {
      throw new ForbiddenException('Banned user');
    }

    if (user.isDeleted()) {
      throw new ForbiddenException('Deleted user');
    }

    const allowWaiting = this.reflector.get<boolean>(
      MetadataKeys.AllowUserWaitingForActivation,
      context.getHandler()
    );

    if (!user.canAuthorize({ allowWaiting })) {
      throw new ForbiddenException('Activation required');
    }
  }
}
