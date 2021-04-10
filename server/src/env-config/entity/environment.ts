import { AppEnvironment } from './app-environment';
import { AuthEnvironment } from './auth-environment';
import { BaseEnvironment } from './base-environment';
import { DatabaseEnvironment } from './database-environment';
import { GoogleOauthEnvironment } from './google-oauth-environment';
import { HttpEnvironment } from './http-environment';

export class Environment implements BaseEnvironment {
  app: AppEnvironment;
  auth: AuthEnvironment;
  database: DatabaseEnvironment;
  http: HttpEnvironment;
  googleOauth: GoogleOauthEnvironment;

  constructor(configuration: any) {
    this.app = new AppEnvironment(configuration.app);
    this.auth = new AuthEnvironment(configuration.auth);
    this.database = new DatabaseEnvironment(configuration.database);
    this.googleOauth = new GoogleOauthEnvironment(configuration.googleOauth);
    this.http = new HttpEnvironment(configuration.http);
  }

  toString(options: { useColor: boolean }): string {
    return [
      this.app.toString(options),
      this.auth.toString(options),
      this.database.toString(options),
      this.googleOauth.toString(options),
      this.http.toString(options),
    ].join('\n');
  }
}
