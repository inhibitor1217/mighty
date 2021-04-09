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

  static mockValue: UserProfile = {
    id: -1,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    displayName: 'mock-display-name',
    username: null,
    email: null,
    photo: null,
  };
}
