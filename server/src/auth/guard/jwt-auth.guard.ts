import type { Request, Response } from 'express';
import _ from 'lodash';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { authenticate } from 'passport';
import type { AuthenticateOptions } from 'passport';
import { User } from '../../user/model/user.model';
import { ACCESS_TOKEN_STRATEGY_NAME } from '../const';
import { InvalidTokenPayloadException } from '../../user/exception/invalid-token-payload.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private static readonly authenticateUserProperty = 'user';
  private static readonly authenticateOptions: AuthenticateOptions = {
    session: false,
    userProperty: JwtAuthGuard.authenticateUserProperty,
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const user = await this.authorizeWithAccessToken(
      req,
      res,
      JwtAuthGuard.authenticateOptions
    );

    req[JwtAuthGuard.authenticateUserProperty] = user;
    return true;
  }

  private async authorizeWithAccessToken(
    req: Request,
    res: Response,
    options: AuthenticateOptions
  ): Promise<User> {
    const accessTokenPayload = await this.getPassportFn(req, res)(
      ACCESS_TOKEN_STRATEGY_NAME,
      options,
      (err, payload) => {
        if (!_.isNil(err)) {
          throw err;
        }
        if (_.isBoolean(payload) && !payload) {
          throw new UnauthorizedException();
        }
        return payload;
      }
    );

    const { version: tokenVersion, ...payload } = accessTokenPayload;

    if (_.isNil(tokenVersion)) {
      throw new UnauthorizedException();
    }

    try {
      return User.fromAccessTokenPayload(payload);
    } catch (e) {
      if (e instanceof InvalidTokenPayloadException) {
        throw new UnauthorizedException();
      }

      throw e;
    }
  }

  private getPassportFn<T extends JsonMap>(req: Request, res: Response) {
    return async function passportFn(
      strategyName: string,
      options: AuthenticateOptions,
      callback: (err: Error | null, payload: T | false) => T
    ): Promise<T> {
      return new Promise<T>((resolve, reject) =>
        authenticate(
          strategyName,
          options,
          (err: Error | null, payload: T | false) => {
            try {
              return resolve(callback(err, payload));
            } catch (e) {
              return reject(e);
            }
          }
        )(req, res, (err: Error | null, payload: T | false) => {
          if (!_.isNil(err)) {
            return reject(err);
          }
          if (_.isBoolean(payload) && !payload) {
            return reject(new UnauthorizedException());
          }
          return resolve(payload);
        })
      );
    };
  }
}
