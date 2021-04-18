import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import { Repository } from 'typeorm';
import { AuthProvider } from '../auth/entity/auth-provider';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import { RdbQueryRunnerFactory } from '../rdb/query-runner/rdb-query-runner-factory';
import { Session } from '../room/model/session.model';
import { CreateUserServiceDto } from './dto/create-user.service.dto';
import { PatchUserServiceDto } from './dto/patch-user.service.dto';
import { UserState } from './entity/user-state';
import { DuplicateUserProviderIdException } from './exception/duplicate-user-provider-id.exception';
import { UserProfile } from './model/user-profile.model';
import { User } from './model/user.model';
@Injectable()
export class UserService {
  constructor(
    @Inject(RDB_QUERY_RUNNER_PROVIDER)
    private rdbQueryRunner: RdbQueryRunnerFactory,
    @InjectRepository(Session) private sessionRepository: Repository<Session>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async findOneById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne(id, {
      join: { alias: 'user', leftJoinAndSelect: { profile: 'user.profile' } },
    });

    return user ?? null;
  }

  async findOneWithProvider(
    provider: AuthProvider,
    providerId: string
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { provider, providerId },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          profile: 'user.profile',
        },
      },
    });

    return user ?? null;
  }

  async createOne(dto: CreateUserServiceDto): Promise<User> {
    const { profile: userProfileDto, ...userDto } = dto;

    const queryRunner = this.rdbQueryRunner.create();
    const userRepository = queryRunner.manager.getRepository(User);
    const userProfileRepository = queryRunner.manager.getRepository(
      UserProfile
    );

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const userProfile = userProfileRepository.create(userProfileDto);
        await userProfileRepository.save(userProfile);

        const user = userRepository.create({
          ...userDto,
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
            provider: userDto.provider,
            providerId: userDto.providerId,
          });
        }

        throw e;
      } finally {
        await queryRunner.release();
      }
    })();
  }

  async patchOne(userId: number, dto: PatchUserServiceDto): Promise<User> {
    const { state, profile } = dto;

    const queryRunner = this.rdbQueryRunner.create();
    const userRepository = queryRunner.manager.getRepository(User);
    const userProfileRepository = queryRunner.manager.getRepository(
      UserProfile
    );

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const user = await userRepository.findOne(userId, {
          join: {
            alias: 'user',
            leftJoinAndSelect: { profile: 'user.profile' },
          },
        });

        if (_.isNil(user)) {
          throw new NotFoundException('User not found');
        }

        user.state = state ?? user.state;
        user.profile.displayName =
          profile?.displayName ?? user.profile.displayName;

        await userRepository.save(user);
        await userProfileRepository.save(user.profile);

        await queryRunner.commitTransaction();

        return user;
      } catch (e) {
        await queryRunner.rollbackTransaction();

        throw e;
      } finally {
        await queryRunner.release();
      }
    })();
  }

  async hasSession(userId: number): Promise<boolean> {
    return !_.isNil(await this.getSession(userId));
  }

  async getSession(userId: number): Promise<Session | null> {
    const session = await this.sessionRepository.findOne({ where: { userId } });
    return session ?? null;
  }
}
