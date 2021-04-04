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
}
