import { Test, TestingModule } from '@nestjs/testing';
import { rdbQueryRunnerProviderMock } from '../rdb/query-runner/rdb-query-runner.provider.mock';
import { createRepositoryMock } from '../rdb/rdb-repository.mock';
import { User } from './model/user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        createRepositoryMock(User),
        rdbQueryRunnerProviderMock,
        UserService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
