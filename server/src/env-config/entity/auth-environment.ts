import { BaseEnvironment } from './base-environment';
import {
  CookieEnvironment,
  CookieEnvironmentObject,
} from './cookie-environment';
import { JwtEnvironment, JwtEnvironmentObject } from './jwt-environment';

export type AuthEnvironmentObject = {
  jwt: JwtEnvironmentObject;
  cookie: CookieEnvironmentObject;
};

export class AuthEnvironment implements BaseEnvironment {
  jwt: JwtEnvironment;
  cookie: CookieEnvironment;

  private static readonly domain = 'auth';

  constructor(object: AuthEnvironmentObject) {
    this.jwt = new JwtEnvironment(
      object.jwt,
      AuthEnvironment.subFieldDomain.bind(AuthEnvironment)
    );
    this.cookie = new CookieEnvironment(
      object.cookie,
      AuthEnvironment.subFieldDomain.bind(AuthEnvironment)
    );
  }

  toString(options: { useColor: boolean }): string {
    return [this.cookie.toString(options), this.jwt.toString(options)].join(
      '\n'
    );
  }

  private static subFieldDomain(field: string): string {
    return `${this.domain}.${field}`;
  }
}
