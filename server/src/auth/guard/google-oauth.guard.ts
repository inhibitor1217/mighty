import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import _ from 'lodash';
import { GOOGLE_OAUTH_STRATEGY_NAME } from '../const';

@Injectable()
export class GoogleOauthGuard extends AuthGuard(GOOGLE_OAUTH_STRATEGY_NAME) {
  getAuthenticateOptions(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    const { accountSelect } = req.query;

    if (accountSelect === 'true') {
      return { prompt: 'select_account' };
    }

    return {};
  }

  handleRequest<TUser>(err?: any, user?: TUser): TUser {
    if (!_.isNil(err) || _.isNil(user)) {
      throw new UnauthorizedException(err);
    }

    return user;
  }
}
