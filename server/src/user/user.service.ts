import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import { Repository } from 'typeorm';
import { AuthProvider } from '../auth/entity/auth-provider';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import { RdbQueryRunnerFactory } from '../rdb/query-runner/rdb-query-runner-factory';
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
    @Inject(RDB_QUERY_RUNNER_PROVIDER)
    private rdbQueryRunner: RdbQueryRunnerFactory,
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

    const queryRunner = this.rdbQueryRunner.create();
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
        await userProfileRepository.save(userProfile);

        const user = userRepository.create({
          ...userPayload,
          state: UserState.WaitingForActivation,
          userProfileId: userProfile.id,
          profile: userProfile,
        });
        await userRepository.save(user);

        await queryRunner.commitTransaction();

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
