import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import _ from 'lodash';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import type { DeepPartial, EntityTarget, Repository } from 'typeorm';
import { PostgresError } from '../rdb/error/postgres-error';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import {
  MockedRdbQueryRunnerFactory,
  rdbQueryRunnerProviderMock,
} from '../rdb/query-runner/rdb-query-runner.provider.mock';
import { createRepositoryMock } from '../rdb/rdb-repository.mock';
import { SessionType } from './entity/session-type';
import { DuplicateSessionException } from './exception/duplicate-session.exception';
import { Room } from './model/room.model';
import { Session } from './model/session.model';
import { RoomService } from './room.service';

function mockCreateRoom(params: DeepPartial<Room>): Room {
  return _.merge({}, Room.mockValue, params);
}

function mockCreateSession(params: DeepPartial<Session>): Session {
  return _.merge({}, Session.mockValue, params);
}

describe('RoomService', () => {
  let service: RoomService;
  let roomRepository: Repository<Room>;
  let sessionRepository: Repository<Session>;
  let queryRunnerFactory: MockedRdbQueryRunnerFactory;

  function mockGetRepository(target: EntityTarget<unknown>) {
    switch (target) {
      case Room:
        return roomRepository;
      case Session:
        return sessionRepository;
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
        RoomService,
        createRepositoryMock(Room),
        createRepositoryMock(Session),
        rdbQueryRunnerProviderMock,
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);

    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
    sessionRepository = module.get<Repository<Session>>(
      getRepositoryToken(Session)
    );
    queryRunnerFactory = module.get<MockedRdbQueryRunnerFactory>(
      RDB_QUERY_RUNNER_PROVIDER
    );

    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect(roomRepository).toBeDefined();
    expect(sessionRepository).toBeDefined();
    expect(queryRunnerFactory).toBeDefined();
  });

  it('createAndJoin returns room from given dto and session with given user id', async () => {
    /* Given */
    jest
      .spyOn(queryRunnerFactory, 'create')
      .mockImplementationOnce(mockCreateQueryRunner);

    jest.spyOn(roomRepository, 'create').mockImplementation(mockCreateRoom);
    jest.spyOn(roomRepository, 'save').mockImplementation(jest.fn());

    jest
      .spyOn(sessionRepository, 'create')
      .mockImplementation(mockCreateSession);
    jest.spyOn(sessionRepository, 'save').mockImplementation(jest.fn());

    /* Run */
    const { room, session } = await service.createAndJoin({
      userId: 42,
      name: 'Room #42',
      maxPlayers: 16,
    });

    /* Expect */
    expect(room).toBeTruthy();
    expect(room.name).toBe('Room #42');
    expect(room.maxPlayers).toBe(16);
    expect(room.maxObservers).toBe(Room.defaultMaxObservers);
    expect(room.ownerSessionId).toBe(session.id);

    expect(session.userId).toBe(42);
    expect(session.roomId).toBe(room.id);
    expect(session.type).toBe(SessionType.Player);

    expect(queryRunnerFactory.hasUnresolvedTransaction()).toBe(false);
  });

  it('createAndJoin throws DuplicateSessionException if userId unique constraint of session is violated', async () => {
    /* Given */
    jest
      .spyOn(queryRunnerFactory, 'create')
      .mockImplementationOnce(mockCreateQueryRunner);

    jest.spyOn(roomRepository, 'create').mockImplementation(mockCreateRoom);
    jest.spyOn(roomRepository, 'save').mockImplementation(jest.fn());

    jest
      .spyOn(sessionRepository, 'create')
      .mockImplementation(mockCreateSession);
    jest.spyOn(sessionRepository, 'save').mockImplementation(() => {
      throw new PostgresError(UNIQUE_VIOLATION);
    });

    /* Run */
    /* Expect */
    await expect(
      service.createAndJoin({ userId: 16, name: '마이티 5인팟 가실분~' })
    ).rejects.toThrow(DuplicateSessionException);

    expect(queryRunnerFactory.hasUnresolvedTransaction()).toBe(false);
  });
});
