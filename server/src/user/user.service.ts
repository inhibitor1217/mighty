import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import { Connection, Repository } from 'typeorm';
import { AuthProvider } from '../auth/entity/auth-provider';
import { UserState } from './entity/user-state';
import { DuplicateUserProviderIdException } from './exception/duplicate-user-provider-id.exception';
import { UserProfile } from './model/user-profile.model';
import { User } from './model/user.model';

type CreateUserPayload = {
  provider: AuthProvider;
  providerId: string;
  profile: {
    displayName: string;
    username: string | null;
    email: string | null;
    photo: string | null;
  };
};

@Injectable()
export class UserService {
  constructor(
    private connection: Connection,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async findOneWithProvider(
    provider: AuthProvider,
    providerId: string
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { provider, providerId },
    });
    return user ?? null;
  }

  async createOne(payload: CreateUserPayload): Promise<User> {
    const { profile: userProfilePayload, ...userPayload } = payload;

    const queryRunner = this.connection.createQueryRunner();
    const userRepository = queryRunner.manager.getRepository(User);
    const userProfileRepository = queryRunner.manager.getRepository(
      UserProfile
    );

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const userProfile = await userProfileRepository.create(
          userProfilePayload
        );

        const user = userRepository.create({
          ...userPayload,
          state: UserState.WaitingForActivation,
          userProfileId: userProfile.id,
        });

        return user;
      } catch (e) {
        await queryRunner.rollbackTransaction();

        if (e.code === UNIQUE_VIOLATION) {
          throw new DuplicateUserProviderIdException({
            provider: userPayload.provider,
            providerId: userPayload.providerId,
          });
        }

        throw e;
      } finally {
        await queryRunner.release();
      }
    })();
  }
}
