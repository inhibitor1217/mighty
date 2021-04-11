import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Session } from './session.model';

@Entity('room')
export class Room {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column('varchar')
  name!: string;

  @Column('int', { default: Room.defaultMaxPlayers })
  maxPlayers!: number;

  @Column('int', { default: Room.defaultMaObservers })
  maxObservers!: number;

  @Column('int')
  ownerSessionId!: number;

  @OneToOne('Session')
  @JoinColumn({ name: 'ownerSessionId' })
  ownerSession!: Session;

  static defaultMaxPlayers: number = 6;
  static defaultMaObservers: number = 4;
}
