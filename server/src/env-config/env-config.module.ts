import { readFileSync } from 'fs';
import Joi from 'joi';
import { load } from 'js-yaml';
import _ from 'lodash';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import {
  RdbAllLoggingOption,
  RdbLoggingOption,
} from '../rdb/entity/rdb-logging-option';
import { AppStage } from './entity/app-stage';
import { Environment } from './entity/environment';
import { ConfigNotFoundException } from './exception/config-not-found.exception';
import { InvalidConfigException } from './exception/invalid-config.exception';
import { EnvConfigService } from './env-config.service';

const joiRequiredNonEmptyString = Joi.string().min(1).required();
const joiDatabaseSchema = Joi.object({
  host: joiRequiredNonEmptyString,
  port: Joi.number().integer().min(1024).max(65535).required(),
  username: joiRequiredNonEmptyString,
  password: joiRequiredNonEmptyString,
  database: joiRequiredNonEmptyString,
  synchronize: Joi.boolean().default(false),
  logging: Joi.alternatives(
    Joi.boolean(),
    Joi.allow(RdbAllLoggingOption),
    Joi.array().items(Joi.allow(...RdbLoggingOption.values))
  ).default([RdbLoggingOption.Error]),
}).required();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => EnvConfigModule.loadEnvironment()],
    }),
  ],
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class EnvConfigModule {
  private static logger: Logger = new Logger('EnvConfigModule');

  static loadEnvironment(): Environment {
    const appStage = AppStage.parse(process.env.APP_STAGE ?? 'development');
    this.logAppStage(appStage);

    const configurationFilePaths = [
      this.getConfigurationFileOf(appStage),
      this.defaultConfigurationFile,
    ];
    this.logConfigurationFilePaths(configurationFilePaths);

    const rawConfiguration = this.readFiles(configurationFilePaths);
    const parsedConfiguration = this.parseRawConfiguration(rawConfiguration);
    const configuration = this.validateConfiguration(parsedConfiguration);
    const environment = new Environment(configuration);
    this.logEnvironment(environment);

    return environment;
  }

  private static readonly defaultConfigurationFile = 'env.yml';

  private static getConfigurationFileOf(appStage: AppStage): string {
    return `env.${AppStage.toString(appStage)}.yml`;
  }

  private static readFiles(paths: string[]): string {
    for (let i = 0; i < paths.length; i += 1) {
      const path = paths[i];
      try {
        return this.readFile(path);
      } catch (e) {
        /* pass */
      }
    }

    throw new ConfigNotFoundException(paths);
  }

  private static readFile(path: string): string {
    return readFileSync(resolve(process.cwd(), path), 'utf-8');
  }

  private static parseRawConfiguration(raw: string): any {
    return load(raw);
  }

  private static validateConfiguration(configuration: any): any {
    const validationResult = this.schema.validate(configuration, {
      stripUnknown: true,
    });

    if (!_.isNil(validationResult.error)) {
      throw new InvalidConfigException(validationResult.error);
    }

    return validationResult.value;
  }

  private static readonly schema = Joi.object({
    app: Joi.object({
      name: joiRequiredNonEmptyString,
      version: joiRequiredNonEmptyString,
      stage: Joi.string()
        .allow(...AppStage.values)
        .default(AppStage.Development),
    }).required(),
    database: Joi.object({
      postgres: joiDatabaseSchema,
    }).required(),
    googleOauth: Joi.object({
      clientId: joiRequiredNonEmptyString,
      clientSecret: joiRequiredNonEmptyString,
      redirectUri: joiRequiredNonEmptyString,
    }).required(),
    http: Joi.object({
      port: Joi.number().integer().min(1024).max(65535).required(),
    }).required(),
  });

  private static logAppStage(appStage: AppStage): void {
    this.logger.log(`Running on APP_STAGE = ${AppStage.toString(appStage)}`);
  }

  private static logConfigurationFilePaths(paths: string[]): void {
    this.logger.verbose(
      `Finding environment configuration file in [${paths.join(', ')}]`
    );
  }

  private static logEnvironment(environment: Environment): void {
    this.logger.log(`\n${environment.toString({ useColor: true })}`);
  }
}
