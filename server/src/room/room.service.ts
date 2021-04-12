import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import type { Repository } from 'typeorm';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import type { RdbQueryRunnerFactory } from '../rdb/query-runner/rdb-query-runner-factory';
import { CreateRoomServiceDto } from './dto/create-room.service.dto';
import { SessionType } from './entity/session-type';
import { DuplicateSessionException } from './exception/duplicate-session.exception';
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
    const { userId, name, maxPlayers, maxObservers } = dto;

    const queryRunner = this.rdbQueryRunner.create();
    const roomRepository = queryRunner.manager.getRepository(Room);
    const sessionRepository = queryRunner.manager.getRepository(Session);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const room = roomRepository.create({ name, maxPlayers, maxObservers });
        await roomRepository.save(room);

        const session = sessionRepository.create({
          type: SessionType.Player,
          roomId: room.id,
          userId,
        });
        await sessionRepository.save(session);

        room.ownerSessionId = session.id;
        await roomRepository.save(room);

        await queryRunner.commitTransaction();

        return { room, session };
      } catch (e) {
        await queryRunner.rollbackTransaction();

        if (e.code === UNIQUE_VIOLATION) {
          throw new DuplicateSessionException();
        }

        throw e;
      } finally {
        await queryRunner.release();
      }
    })();
  }
}
