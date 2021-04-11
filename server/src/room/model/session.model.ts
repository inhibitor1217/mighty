import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from '../../user/model/user.model';
import type { SessionType } from '../entity/session-type';
import type { Room } from './room.model';

@Entity('session')
@Unique('idx_user', ['userId'])
export class Session {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('varchar')
  type!: SessionType;

  @Column('int')
  roomId!: number;

  @ManyToOne('Room', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  room!: Room;

  @Column('int')
  userId!: number;

  @OneToOne('User')
  @JoinColumn({ name: 'userId' })
  user!: User;
}
