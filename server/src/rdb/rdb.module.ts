import _ from 'lodash';
import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DatabaseEnvironment } from '../env-config/entity/database-environment';
import { SingleDatabaseEnvironment } from '../env-config/entity/single-database-environment';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvConfigService } from '../env-config/env-config.service';
import { unreachable } from '../utils/unreachable';
import { RDB_ENTITIES } from './rdb-entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: (envConfig: EnvConfigService) => {
        const rdbConfiguration = envConfig.get<DatabaseEnvironment>('database')
          ?.postgres;

        if (_.isNil(rdbConfiguration)) {
          return unreachable();
        }

        return RdbModule.getTypeOrmConfiguration(rdbConfiguration);
      },
    }),
  ],
})
export class RdbModule {
  private static getTypeOrmConfiguration(
    configuration: SingleDatabaseEnvironment
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      entities: RDB_ENTITIES,
      ...configuration,
    };
  }
}
