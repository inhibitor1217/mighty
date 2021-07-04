import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { ActiveUserController } from './active-user.controller';
import { UserService } from './user.service';

describe('ActiveUserController', () => {
  let controller: ActiveUserController;

  const mockAuthService = {};
  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiveUserController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    controller = module.get<ActiveUserController>(ActiveUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
