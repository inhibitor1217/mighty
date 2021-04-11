import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import type { RdbQueryRunnerFactory } from '../rdb/query-runner/rdb-query-runner-factory';
import { CreateRoomServiceDto } from './dto/create-room.service.dto';
import { Room } from './model/room.model';
import { Session } from './model/session.model';

interface CreateAndJoinReturn {
  room: Room;
  session: Session;
}

@Injectable()
export class RoomService {
  constructor(
    @Inject(RDB_QUERY_RUNNER_PROVIDER)
    private rdbQueryRunner: RdbQueryRunnerFactory,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>
  ) {}

  async createAndJoin(dto: CreateRoomServiceDto): Promise<CreateAndJoinReturn> {
    return { room: new Room(), session: Session.mockValue };
  }
}
