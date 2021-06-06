import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import _ from 'lodash';
import { GOOGLE_OAUTH_STRATEGY_NAME } from '../const';

@Injectable()
export class GoogleOauthGuard extends AuthGuard(GOOGLE_OAUTH_STRATEGY_NAME) {
  handleRequest<TUser>(err?: any, user?: TUser): TUser {
    if (!_.isNil(err) || _.isNil(user)) {
      throw new UnauthorizedException(err);
    }

    return user;
  }
}
