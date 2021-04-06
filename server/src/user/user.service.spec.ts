import _ from 'lodash';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthProvider } from '../auth/entity/auth-provider';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import { RdbQueryRunnerFactory } from '../rdb/query-runner/rdb-query-runner-factory';
import { rdbQueryRunnerProviderMock } from '../rdb/query-runner/rdb-query-runner.provider.mock';
import { createRepositoryMock } from '../rdb/rdb-repository.mock';
import { User } from './model/user.model';
import { UserService } from './user.service';

function mockFindOneFrom(
  users: User[]
): (options: any) => Promise<User | undefined> {
  return (options) =>
    Promise.resolve(
      users.find(
        (user) =>
          user.provider === options.where.provider &&
          user.providerId === options.where.providerId
      )
    );
}

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let queryRunnerFactory: RdbQueryRunnerFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        createRepositoryMock(User),
        rdbQueryRunnerProviderMock,
        UserService,
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    queryRunnerFactory = module.get<RdbQueryRunnerFactory>(
      RDB_QUERY_RUNNER_PROVIDER
    );
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(queryRunnerFactory).toBeDefined();
    expect(service).toBeDefined();
  });

  it('findOneWithProvider returns user with given provider and provider id', async () => {
    /* Given */
    const users = _.range(0, 3).map((index) => {
      const user = new User();
      user.id = index;
      user.provider = AuthProvider.Google;
      user.providerId = `google-${index}`;

      return user;
    });

    jest
      .spyOn(userRepository, 'findOne')
      .mockImplementation(mockFindOneFrom(users));

    /* Run */
    const result = await service.findOneWithProvider(
      AuthProvider.Google,
      'google-0'
    );

    /* Expect */
    expect(result).toBeTruthy();
    expect(result!.id).toBe(0);
  });

  it('findOneWithProvider returns null if no user with given provider and provider id exists', async () => {
    /* Given */
    const users = _.range(0, 3).map((index) => {
      const user = new User();
      user.id = index;
      user.provider = AuthProvider.Google;
      user.providerId = `google-${index}`;

      return user;
    });

    jest
      .spyOn(userRepository, 'findOne')
      .mockImplementation(mockFindOneFrom(users));

    /* Run */
    const result = await service.findOneWithProvider(
      AuthProvider.Google,
      'google-3'
    );

    /* Expect */
    expect(result).toBeNull();
  });
});
