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
import { SessionType } from '../entity/session-type';
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

  static get mockValue(): Session {
    const session = new Session();

    session.id = -1;
    session.createdAt = new Date(0);
    session.updatedAt = new Date(0);
    session.type = SessionType.Mock;
    session.roomId = -1;
    session.userId = -1;

    return session;
  }
}
