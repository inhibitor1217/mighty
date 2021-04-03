import { AppEnvironment } from './app-environment';
import { BaseEnvironment } from './base-environment';
import { GoogleOauthEnvironment } from './google-oauth-environment';
import { HttpEnvironment } from './http-environment';

export class Environment implements BaseEnvironment {
  app: AppEnvironment;
  http: HttpEnvironment;
  googleOauth: GoogleOauthEnvironment;

  constructor(configuration: any) {
    this.app = new AppEnvironment(configuration.app);
    this.http = new HttpEnvironment(configuration.http);
    this.googleOauth = new GoogleOauthEnvironment(configuration.googleOauth);
  }

  toString(options: { useColor: boolean }): string {
    return [
      this.app.toString(options),
      this.http.toString(options),
      this.googleOauth.toString(options),
    ].join('\n');
  }
}
