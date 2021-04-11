import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import {
  MockedRdbQueryRunnerFactory,
  rdbQueryRunnerProviderMock,
} from '../rdb/query-runner/rdb-query-runner.provider.mock';
import { createRepositoryMock } from '../rdb/rdb-repository.mock';
import { Room } from './model/room.model';
import { Session } from './model/session.model';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;
  let roomRepository: Repository<Room>;
  let sessionRepository: Repository<Session>;
  let queryRunnerFactory: MockedRdbQueryRunnerFactory;

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();

    expect(roomRepository).toBeDefined();
    expect(sessionRepository).toBeDefined();
    expect(queryRunnerFactory).toBeDefined();
  });
});
