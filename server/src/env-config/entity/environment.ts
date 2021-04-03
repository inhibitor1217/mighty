import { AppEnvironment } from './app-environment';
import { BaseEnvironment } from './base-environment';
import { HttpEnvironment } from './http-environment';

export class Environment implements BaseEnvironment {
  app: AppEnvironment;
  http: HttpEnvironment;

  constructor(configuration: any) {
    this.app = new AppEnvironment(configuration.app);
    this.http = new HttpEnvironment(configuration.http);
  }

  toString(options: { useColor: boolean }): string {
    return [this.app.toString(options), this.http.toString(options)].join('\n');
  }
}
