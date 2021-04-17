import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import type { Repository } from 'typeorm';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import type { RdbQueryRunnerFactory } from '../rdb/query-runner/rdb-query-runner-factory';
import { CreateRoomServiceDto } from './dto/create-room.service.dto';
import { SessionType } from './entity/session-type';
import { DuplicateSessionException } from './exception/duplicate-session.exception';
import { FullRoomException } from './exception/full-room.exception';
import { MaxObserversExceededException } from './exception/max-observers-exceeded.exception';
import { MaxPlayersExceededException } from './exception/max-players-exceeded.exception';
import { Room } from './model/room.model';
import { Session } from './model/session.model';

interface JoinReturn {
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

  async createAndJoin(dto: CreateRoomServiceDto): Promise<JoinReturn> {
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

        room.numPlayers = 1;
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

  async join(roomId: number, userId: number): Promise<JoinReturn> {
    const queryRunner = this.rdbQueryRunner.create();
    const roomRepository = queryRunner.manager.getRepository(Room);
    const sessionRepository = queryRunner.manager.getRepository(Session);

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const room = await roomRepository
          .createQueryBuilder()
          .setLock('pessimistic_write')
          .where({ id: roomId })
          .getOne();

        if (_.isNil(room)) {
          throw new NotFoundException({ roomId }, 'Room not found');
        }

        const session = await this.joinRoomImpl(room, userId);

        await Promise.all([
          roomRepository.save(room),
          sessionRepository.save(session),
        ]);

        await queryRunner.commitTransaction();

        return { room, session };
      } catch (e) {
        await queryRunner.rollbackTransaction();

        throw e;
      } finally {
        await queryRunner.release();
      }
    })();
  }

  private joinRoomImpl(room: Room, userId: number): Promise<Session> {
    return this.joinRoomAsPlayer(room, userId)
      .catch((e) => {
        if (e instanceof MaxPlayersExceededException) {
          return this.joinRoomAsObserver(room, userId);
        }

        throw e;
      })
      .catch((e) => {
        if (e instanceof MaxObserversExceededException) {
          throw new FullRoomException(e);
        }

        throw e;
      });
  }

  private async joinRoomAsPlayer(room: Room, userId: number): Promise<Session> {
    const { numPlayers, maxPlayers } = room;

    if (numPlayers >= maxPlayers) {
      throw new MaxPlayersExceededException(room);
    }

    const session = new Session();

    // eslint-disable-next-line no-param-reassign
    room.numPlayers = numPlayers + 1;

    session.type = SessionType.Player;
    session.roomId = room.id;
    session.userId = userId;

    return session;
  }

  private async joinRoomAsObserver(
    room: Room,
    userId: number
  ): Promise<Session> {
    const { numObservers, maxObservers } = room;

    if (numObservers >= maxObservers) {
      throw new MaxObserversExceededException(room);
    }

    const session = new Session();

    // eslint-disable-next-line no-param-reassign
    room.numObservers = numObservers + 1;

    session.type = SessionType.Observer;
    session.roomId = room.id;
    session.userId = userId;

    return session;
  }
}
