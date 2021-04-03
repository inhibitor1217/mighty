import _ from 'lodash';
import { unreachable } from '../../utils/unreachable';
import { EnvironmentString } from '../util/environment-string';
import { AppStage } from './app-stage';
import { BaseEnvironment } from './base-environment';

type AppEnvironmentObject = {
  name: string;
  version: string;
  stage: string;
};

export class AppEnvironment implements BaseEnvironment {
  name: string;
  version: string;
  stage: AppStage;

  private environmentString: EnvironmentString;

  private static readonly versionDelimiter = '-';
  private static readonly domain = 'app';

  constructor(object: AppEnvironmentObject) {
    this.name = object.name;
    this.version = object.version;
    this.stage = AppStage.parse(object.stage);

    this.environmentString = new EnvironmentString(AppEnvironment.domain);
  }

  getInfo(): string {
    return `${this.name}@${this.version}-${this.stage}`;
  }

  getSemanticVersion(): string {
    return this.splitSemanticAndHotfixVersion().semantic;
  }

  getHotfixVersion(): string | undefined {
    return this.splitSemanticAndHotfixVersion().hotfix;
  }

  toString(options: { useColor: boolean }): string {
    this.environmentString.defaultOptions = { useColor: options.useColor };

    return [
      this.environmentString.field('name', this.name),
      this.environmentString.field('version', this.version),
      this.environmentString.field('stage', AppStage.toString(this.stage)),
    ].join('\n');
  }

  private splitSemanticAndHotfixVersion(): {
    semantic: string;
    hotfix?: string;
  } {
    const splitted = this.version.split(AppEnvironment.versionDelimiter);
    const semantic = _.first(splitted);
    const hotfix = _.last(splitted);

    if (_.isNil(semantic)) {
      return unreachable();
    }

    return {
      semantic,
      hotfix,
    };
  }
}
