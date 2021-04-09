import _ from 'lodash';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import { DeepPartial, EntityTarget, Repository } from 'typeorm';
import { AuthProvider } from '../auth/entity/auth-provider';
import { PostgresError } from '../rdb/error/postgres-error';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import {
  MockedRdbQueryRunnerFactory,
  rdbQueryRunnerProviderMock,
} from '../rdb/query-runner/rdb-query-runner.provider.mock';
import { createRepositoryMock } from '../rdb/rdb-repository.mock';
import { User } from './model/user.model';
import { UserProfile } from './model/user-profile.model';
import { UserService } from './user.service';
import { UserState } from './entity/user-state';
import { DuplicateUserProviderIdException } from './exception/duplicate-user-provider-id.exception';

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

function mockCreateUser(params: DeepPartial<User>): User {
  return _.merge({}, User.mockValue, params);
}

function mockCreateUserProfile(params: DeepPartial<UserProfile>): UserProfile {
  return _.merge({}, UserProfile.mockValue, params);
}

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;
  let userProfileRepository: Repository<UserProfile>;
  let queryRunnerFactory: MockedRdbQueryRunnerFactory;

  function mockGetRepository(target: EntityTarget<unknown>) {
    switch (target) {
      case User:
        return userRepository;
      case UserProfile:
        return userProfileRepository;
      default:
        return null;
    }
  }

  function mockCreateQueryRunner() {
    return _.merge({}, queryRunnerFactory.create(), {
      manager: {
        getRepository: mockGetRepository,
      },
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        createRepositoryMock(User),
        createRepositoryMock(UserProfile),
        rdbQueryRunnerProviderMock,
        UserService,
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userProfileRepository = module.get<Repository<UserProfile>>(
      getRepositoryToken(UserProfile)
    );
    queryRunnerFactory = module.get<MockedRdbQueryRunnerFactory>(
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
      .mockImplementationOnce(mockFindOneFrom(users));

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
      .mockImplementationOnce(mockFindOneFrom(users));

    /* Run */
    const result = await service.findOneWithProvider(
      AuthProvider.Google,
      'google-3'
    );

    /* Expect */
    expect(result).toBeNull();
  });

  it('createOne returns user with given provider and profile', async () => {
    /* Given */
    jest
      .spyOn(queryRunnerFactory, 'create')
      .mockImplementationOnce(mockCreateQueryRunner);

    jest.spyOn(userRepository, 'create').mockImplementationOnce(mockCreateUser);
    jest.spyOn(userRepository, 'save').mockImplementationOnce(jest.fn());

    jest
      .spyOn(userProfileRepository, 'create')
      .mockImplementationOnce(mockCreateUserProfile);
    jest.spyOn(userProfileRepository, 'save').mockImplementationOnce(jest.fn());

    /* Run */
    const result = await service.createOne({
      provider: AuthProvider.Google,
      providerId: 'test',
      profile: {
        displayName: 'hi',
        username: null,
        email: 'hi@example.com',
        photo: null,
      },
    });

    /* Expect */
    expect(result).toBeTruthy();

    expect(result.provider).toBe(AuthProvider.Google);
    expect(result.providerId).toBe('test');
    expect(result.state).toBe(UserState.WaitingForActivation);

    expect(result.profile.id).toBe(result.userProfileId);
    expect(result.profile.displayName).toBe('hi');
    expect(result.profile.username).toBe(null);
    expect(result.profile.email).toBe('hi@example.com');
    expect(result.profile.photo).toBe(null);

    expect(queryRunnerFactory.hasUnresolvedTransaction()).toBe(false);
  });

  it('createOne throws DuplicateUserProviderIdException if user with provider and providerId already exists', async () => {
    /* Given */
    jest
      .spyOn(queryRunnerFactory, 'create')
      .mockImplementationOnce(mockCreateQueryRunner);

    jest.spyOn(userRepository, 'create').mockImplementationOnce(mockCreateUser);
    jest.spyOn(userRepository, 'save').mockImplementationOnce(() => {
      throw new PostgresError(UNIQUE_VIOLATION);
    });

    jest
      .spyOn(userProfileRepository, 'create')
      .mockImplementationOnce(mockCreateUserProfile);
    jest.spyOn(userProfileRepository, 'save').mockImplementationOnce(jest.fn());

    /* Run */
    /* Expect */
    await expect(
      service.createOne({
        provider: AuthProvider.Google,
        providerId: 'test',
        profile: {
          displayName: 'hi',
          username: null,
          email: 'hi@example.com',
          photo: null,
        },
      })
    ).rejects.toThrowError(DuplicateUserProviderIdException);

    expect(queryRunnerFactory.hasUnresolvedTransaction()).toBe(false);
  });
});
