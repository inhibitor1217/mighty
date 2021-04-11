import _ from 'lodash';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvalidTokenPayloadException } from '../exception/invalid-token-payload.exception';

@Entity('user_profile')
export class UserProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('varchar')
  displayName!: string;

  @Column('varchar', { nullable: true })
  username!: string | null;

  @Column('varchar', { nullable: true })
  email!: string | null;

  @Column('varchar', { nullable: true })
  photo!: string | null;

  toAccessTokenPayload(): JsonMap {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      displayName: this.displayName,
      username: this.username,
      email: this.email,
      photo: this.photo,
    };
  }

  static fromAccessTokenPayload(payload: JsonMap): UserProfile {
    const userProfile = new UserProfile();

    userProfile.id = _.isNumber(payload.id)
      ? payload.id
      : this.throwInvalidTokenPayloadException('id', payload.id, 'number');

    userProfile.createdAt = _.isString(payload.createdAt)
      ? new Date(Date.parse(payload.createdAt))
      : this.throwInvalidTokenPayloadException(
          'createdAt',
          payload.createdAt,
          'string'
        );

    userProfile.updatedAt = _.isString(payload.updatedAt)
      ? new Date(Date.parse(payload.updatedAt))
      : this.throwInvalidTokenPayloadException(
          'updatedAt',
          payload.updatedAt,
          'string'
        );

    userProfile.displayName = _.isString(payload.displayName)
      ? payload.displayName
      : this.throwInvalidTokenPayloadException(
          'displayName',
          payload.displayName,
          'string'
        );

    userProfile.username =
      _.isNil(payload.username) || _.isString(payload.username)
        ? payload.username
        : this.throwInvalidTokenPayloadException(
            'username',
            payload.username,
            'string or null'
          );

    userProfile.email =
      _.isNil(payload.email) || _.isString(payload.email)
        ? payload.email
        : this.throwInvalidTokenPayloadException(
            'email',
            payload.email,
            'string or null'
          );

    userProfile.photo =
      _.isNil(payload.photo) || _.isString(payload.photo)
        ? payload.photo
        : this.throwInvalidTokenPayloadException(
            'photo',
            payload.photo,
            'string or null'
          );

    return userProfile;
  }

  private static throwInvalidTokenPayloadException(
    field: string,
    value: any,
    expectedType: string
  ): never {
    throw new InvalidTokenPayloadException(field, value, expectedType);
  }

  static readonly mockValue: UserProfile = (() => {
    const userProfile = new UserProfile();

    userProfile.id = -1;
    userProfile.createdAt = new Date(0);
    userProfile.updatedAt = new Date(0);
    userProfile.displayName = 'mock-display-name';
    userProfile.username = null;
    userProfile.email = null;
    userProfile.photo = null;

    return userProfile;
  })();
}
