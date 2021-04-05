import { Provider } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { RDB_QUERY_RUNNER_PROVIDER } from './const';
import { RdbQueryRunnerFactory } from './rdb-query-runner-factory';

const queryRunnerMock = ((): jest.Mocked<QueryRunner> => {
  let transactionInProgress = false;

  const startTransaction = async () => {
    transactionInProgress = true;
  };

  const finishTransaction = async () => {
    if (!transactionInProgress) {
      throw new Error('no transaction in progress');
    }
    transactionInProgress = false;
  };

  const mock: unknown = {
    connect: jest.fn(),
    release: jest.fn(),
    manager: {},
    startTransaction: jest.fn(startTransaction),
    commitTransaction: jest.fn(finishTransaction),
    rollbackTransaction: jest.fn(finishTransaction),
  };

  return mock as jest.Mocked<QueryRunner>;
})();

const rdbQueryRunnerFactoryMock = {
  create: jest.fn(() => queryRunnerMock),
};

export const rdbQueryRunnerProviderMock: Provider<RdbQueryRunnerFactory> = {
  provide: RDB_QUERY_RUNNER_PROVIDER,
  useValue: rdbQueryRunnerFactoryMock,
};
