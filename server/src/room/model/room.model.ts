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

  @Column('int', { default: Room.defaultMaxObservers })
  maxObservers!: number;

  @Column('int', { nullable: true })
  ownerSessionId!: number | null;

  @OneToOne('Session')
  @JoinColumn({ name: 'ownerSessionId' })
  ownerSession!: Session | null;

  static defaultMaxPlayers: number = 6;
  static defaultMaxObservers: number = 4;

  static get mockValue(): Room {
    const room = new Room();

    room.id = -1;
    room.createdAt = new Date(0);
    room.updatedAt = new Date(0);
    room.name = 'mock-room-name';
    room.maxPlayers = Room.defaultMaxPlayers;
    room.maxObservers = Room.defaultMaxObservers;
    room.ownerSessionId = -1;

    return room;
  }
}
