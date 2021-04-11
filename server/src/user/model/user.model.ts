import _ from 'lodash';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AuthProvider } from '../../auth/entity/auth-provider';
import type { Session } from '../../room/model/session.model';
import { UserState } from '../entity/user-state';
import { InvalidTokenPayloadException } from '../exception/invalid-token-payload.exception';
import { UserProfile } from './user-profile.model';

@Entity('user')
@Unique('idx_provider', ['provider', 'providerId'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('varchar')
  provider!: AuthProvider;

  @Column('varchar')
  providerId!: string;

  @Column('varchar')
  state!: UserState;

  @Column('integer')
  userProfileId!: number;

  @OneToOne('UserProfile')
  @JoinColumn({ name: 'userProfileId' })
  profile!: UserProfile;

  @OneToOne('Session')
  session!: Session | null;

  isBanned(): boolean {
    return [UserState.Banned].includes(this.state);
  }

  isDeleted(): boolean {
    return [UserState.Deleted].includes(this.state);
  }

  canAuthorize(): boolean {
    return ![UserState.Banned, UserState.Deleted].includes(this.state);
  }

  toAccessTokenPayload(): JsonMap {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      provider: AuthProvider.toString(this.provider),
      providerId: this.providerId,
      state: UserState.toString(this.state),
      userProfileId: this.userProfileId,
      profile: this.profile.toAccessTokenPayload(),
    };
  }

  toRefreshTokenPayload(): JsonMap {
    return {
      id: this.id,
      state: UserState.toString(this.state),
    };
  }

  static fromAccessTokenPayload(payload: JsonMap): User {
    const user = new User();

    user.id = _.isNumber(payload.id)
      ? payload.id
      : this.throwInvalidTokenPayloadException('id', payload.id, 'number');

    user.createdAt = _.isString(payload.createdAt)
      ? new Date(Date.parse(payload.createdAt))
      : this.throwInvalidTokenPayloadException(
          'createdAt',
          payload.createdAt,
          'string'
        );

    user.updatedAt = _.isString(payload.updatedAt)
      ? new Date(Date.parse(payload.updatedAt))
      : this.throwInvalidTokenPayloadException(
          'updatedAt',
          payload.updatedAt,
          'string'
        );

    user.provider = _.isString(payload.provider)
      ? AuthProvider.parse(payload.provider)
      : this.throwInvalidTokenPayloadException(
          'provider',
          payload.provider,
          'string'
        );

    user.providerId = _.isString(payload.providerId)
      ? payload.providerId
      : this.throwInvalidTokenPayloadException(
          'providerId',
          payload.providerId,
          'string'
        );

    user.state = _.isString(payload.state)
      ? UserState.parse(payload.state)
      : this.throwInvalidTokenPayloadException(
          'state',
          payload.state,
          'string'
        );

    user.userProfileId = _.isNumber(payload.userProfileId)
      ? payload.userProfileId
      : this.throwInvalidTokenPayloadException(
          'userProfileId',
          payload.userProfileId,
          'number'
        );

    user.profile =
      _.isObject(payload.profile) && !_.isArray(payload.profile)
        ? UserProfile.fromAccessTokenPayload(payload.profile)
        : this.throwInvalidTokenPayloadException(
            'profile',
            payload.profile,
            'object'
          );

    return user;
  }

  private static throwInvalidTokenPayloadException(
    field: string,
    value: any,
    expectedType: string
  ): never {
    throw new InvalidTokenPayloadException(field, value, expectedType);
  }

  static get mockValue(): User {
    const user = new User();

    user.id = -1;
    user.createdAt = new Date(0);
    user.updatedAt = new Date(0);
    user.provider = AuthProvider.Mock;
    user.providerId = 'mock-provider-id';
    user.state = UserState.Mock;
    user.userProfileId = UserProfile.mockValue.id;
    user.profile = UserProfile.mockValue;

    return user;
  }
}
