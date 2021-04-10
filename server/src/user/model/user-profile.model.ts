import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
