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
import { UserState } from '../entity/user-state';
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

  @OneToOne(() => UserProfile)
  @JoinColumn({ name: 'userProfileId' })
  profile!: UserProfile;

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

  static readonly mockValue: User = (() => {
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
  })();
}
