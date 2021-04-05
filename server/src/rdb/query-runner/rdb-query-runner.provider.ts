import { Provider } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { RDB_QUERY_RUNNER_PROVIDER } from './const';
import { RdbQueryRunnerFactory } from './rdb-query-runner-factory';

export const rdbQueryRunnerProvider: Provider<RdbQueryRunnerFactory> = {
  provide: RDB_QUERY_RUNNER_PROVIDER,
  inject: [getConnectionToken()],
  useFactory: (connection: Connection) => ({
    create: () => connection.createQueryRunner(),
  }),
};
