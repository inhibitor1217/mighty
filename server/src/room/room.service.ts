import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { UNIQUE_VIOLATION } from 'pg-error-constants';
import { Not, QueryRunner, Repository } from 'typeorm';
import { RDB_QUERY_RUNNER_PROVIDER } from '../rdb/query-runner/const';
import type { RdbQueryRunnerFactory } from '../rdb/query-runner/rdb-query-runner-factory';
import { User } from '../user/model/user.model';
import { PaginationQuery } from '../utils/pagination-query';
import { SortOrder } from '../utils/sort-order';
import { CreateRoomServiceDto } from './dto/create-room.service.dto';
import { PatchRoomServiceDto } from './dto/patch-room.service.dto';
import { PatchSessionServiceDto } from './dto/patch-session.service.dto';
import { SessionType } from './entity/session-type';
import { DuplicateSessionException } from './exception/duplicate-session.exception';
import { FullRoomException } from './exception/full-room.exception';
import { MaxObserversExceededException } from './exception/max-observers-exceeded.exception';
import { MaxPlayersExceededException } from './exception/max-players-exceeded.exception';
import { SessionNotAllowedActionException } from './exception/session-not-allowed-action.exception';
import { Room } from './model/room.model';
import { Session } from './model/session.model';

interface JoinReturn {
  room: Room;
  session: Session;
}

interface LeaveReturn {
  room?: Room;
  deletedRoomId?: number;
}

interface SessionReturn {
  sessions: Session[];
  users: User[];
}

interface TransactionContext {
  queryRunner: QueryRunner;
  roomRepository: Repository<Room>;
  sessionRepository: Repository<Session>;
}

@Injectable()
export class RoomService {
  constructor(
    @Inject(RDB_QUERY_RUNNER_PROVIDER)
    private rdbQueryRunner: RdbQueryRunnerFactory,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    @InjectRepository(Session) private sessionRepository: Repository<Session>
  ) {}

  async getOne(roomId: number): Promise<Room> {
    const room = await this.roomRepository.findOne(roomId);

    if (_.isNil(room)) {
      this.throwRoomNotFoundException(roomId);
    }

    return room;
  }

  async getMany(query: PaginationQuery): Promise<Room[]> {
    const { limit, cursor, order } = query;

    const rooms = await this.roomRepository
      .createQueryBuilder('room')
      .where({ createdAt: SortOrder.toComparator(order)(cursor) })
      .limit(limit)
      .orderBy('room.createdAt', SortOrder.toOrderBy(order))
      .getMany();

    return rooms;
  }

  async getSessions(roomId: number): Promise<SessionReturn> {
    const sessions = await this.sessionRepository.find({
      where: { roomId },
      relations: ['user', 'user.profile'],
    });
    const users = sessions.map(({ user }) => user);

    return { sessions, users };
  }

  async createAndJoin(dto: CreateRoomServiceDto): Promise<JoinReturn> {
    const { userId, name, maxPlayers, maxObservers } = dto;

    const {
      queryRunner,
      roomRepository,
      sessionRepository,
    } = this.createTransaction();

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
    const transactionContext = this.createTransaction();
    const { queryRunner } = transactionContext;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const room = await this.getRoomAndAcquireLock(
          roomId,
          transactionContext
        );

        const session = await this.joinRoomImpl(
          room,
          userId,
          transactionContext
        );

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

  private joinRoomImpl(
    room: Room,
    userId: number,
    transactionContext: TransactionContext
  ): Promise<Session> {
    return this.joinRoomAsPlayer(room, userId, transactionContext)
      .catch((e) => {
        if (e instanceof MaxPlayersExceededException) {
          return this.joinRoomAsObserver(room, userId, transactionContext);
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

  private async joinRoomAsPlayer(
    room: Room,
    userId: number,
    { roomRepository, sessionRepository }: TransactionContext
  ): Promise<Session> {
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

    await Promise.all([
      roomRepository.save(room),
      sessionRepository.save(session),
    ]);

    return session;
  }

  private async joinRoomAsObserver(
    room: Room,
    userId: number,
    { roomRepository, sessionRepository }: TransactionContext
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

    await Promise.all([
      roomRepository.save(room),
      sessionRepository.save(session),
    ]);

    return session;
  }

  async leave(session: Session): Promise<LeaveReturn> {
    const transactionContext = this.createTransaction();
    const { queryRunner } = transactionContext;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const room = await this.getRoomAndAcquireLock(
          session.roomId,
          transactionContext
        );

        const newOwnerSession = await this.getOwnerSessionCandidate(
          room,
          transactionContext
        );

        return _.isNil(newOwnerSession)
          ? await this.deleteRoomImpl(room, transactionContext)
          : await this.leaveRoomImpl(
              room,
              session,
              newOwnerSession,
              transactionContext
            );
      } catch (e) {
        await queryRunner.rollbackTransaction();

        throw e;
      } finally {
        await queryRunner.release();
      }
    })();
  }

  private async getOwnerSessionCandidate(
    room: Room,
    { sessionRepository }: TransactionContext
  ): Promise<Session | undefined> {
    const session = await sessionRepository.findOne({
      where: { id: Not(room.ownerSessionId), roomId: room.id },
      order: { createdAt: 'ASC' },
    });

    return session;
  }

  private async leaveRoomImpl(
    room: Room,
    session: Session,
    newOwnerSession: Session,
    { queryRunner, roomRepository, sessionRepository }: TransactionContext
  ): Promise<LeaveReturn> {
    const { type: sessionType } = session;

    // eslint-disable-next-line no-param-reassign
    room.ownerSessionId = newOwnerSession.id;
    await roomRepository.save(room);

    await sessionRepository.delete(session);

    switch (sessionType) {
      case SessionType.Player:
        // eslint-disable-next-line no-param-reassign
        room.numPlayers -= 1;
        break;
      case SessionType.Observer:
        // eslint-disable-next-line no-param-reassign
        room.numObservers -= 1;
        break;
      default:
        break;
    }

    await roomRepository.save(room);

    await queryRunner.commitTransaction();

    return { room };
  }

  private async deleteRoomImpl(
    room: Room,
    { queryRunner, roomRepository }: TransactionContext
  ): Promise<LeaveReturn> {
    await roomRepository.delete(room);
    await queryRunner.commitTransaction();
    return { deletedRoomId: room.id };
  }

  async patchOne(dto: PatchRoomServiceDto): Promise<Room> {
    const {
      roomId,
      sessionId,
      name,
      maxPlayers,
      maxObservers,
      ownerUserId,
    } = dto;

    const transactionContext = this.createTransaction();
    const { queryRunner, roomRepository } = transactionContext;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const room = await this.getRoomAndAcquireLock(
          roomId,
          transactionContext
        );
        const newOwnerSession = _.isNil(ownerUserId)
          ? undefined
          : await this.getSessionOfRoomByUserId(
              roomId,
              ownerUserId,
              transactionContext
            );

        room.name = name ?? room.name;
        room.maxPlayers = maxPlayers ?? room.maxPlayers;
        room.maxObservers = maxObservers ?? room.maxObservers;
        room.ownerSessionId = newOwnerSession?.id ?? room.ownerSessionId;

        this.ensureSessionOwnsRoom(room, sessionId);
        this.ensureMaxPlayerConstraint(room);
        this.ensureMaxObserverConstraint(room);

        await roomRepository.save(room);

        await queryRunner.commitTransaction();

        return room;
      } catch (e) {
        await queryRunner.rollbackTransaction();

        throw e;
      } finally {
        await queryRunner.release();
      }
    })();
  }

  async patchSession(
    session: Session,
    dto: PatchSessionServiceDto
  ): Promise<JoinReturn> {
    const { type: newSessionType } = dto;

    const transactionContext = this.createTransaction();
    const {
      queryRunner,
      roomRepository,
      sessionRepository,
    } = transactionContext;

    await queryRunner.connect();
    await queryRunner.startTransaction();

    return (async () => {
      try {
        const room = await this.getRoomAndAcquireLock(
          session.roomId,
          transactionContext
        );

        room.numPlayers += this.getNumPlayersDifference(
          session.type,
          newSessionType
        );
        room.numObservers += this.getNumObserversDifference(
          session.type,
          newSessionType
        );

        this.ensureMaxPlayerConstraint(room);
        this.ensureMaxObserverConstraint(room);

        // eslint-disable-next-line no-param-reassign
        session.type = newSessionType ?? session.type;

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

  private getNumPlayersDifference(
    sessionType: SessionType,
    newSessionType: SessionType | undefined
  ): number {
    if (_.isNil(newSessionType)) {
      return 0;
    }

    return (
      (newSessionType === SessionType.Player ? 1 : 0) +
      (sessionType === SessionType.Player ? -1 : 0)
    );
  }

  private getNumObserversDifference(
    sessionType: SessionType,
    newSessionType: SessionType | undefined
  ): number {
    if (_.isNil(newSessionType)) {
      return 0;
    }

    return (
      (newSessionType === SessionType.Observer ? 1 : 0) +
      (sessionType === SessionType.Observer ? -1 : 0)
    );
  }

  private createTransaction(): TransactionContext {
    const queryRunner = this.rdbQueryRunner.create();
    const roomRepository = queryRunner.manager.getRepository(Room);
    const sessionRepository = queryRunner.manager.getRepository(Session);

    return { queryRunner, roomRepository, sessionRepository };
  }

  private async getRoomAndAcquireLock(
    roomId: number,
    { roomRepository }: TransactionContext
  ): Promise<Room> {
    const room = await roomRepository
      .createQueryBuilder()
      .setLock('pessimistic_write')
      .where({ id: roomId })
      .getOne();

    if (_.isNil(room)) {
      this.throwRoomNotFoundException(roomId);
    }

    return room;
  }

  private async getSessionOfRoomByUserId(
    roomId: number,
    userId: number,
    { sessionRepository }: TransactionContext
  ): Promise<Session> {
    const session = await sessionRepository.findOne({
      where: { userId, roomId },
    });

    if (_.isNil(session)) {
      throw new BadRequestException();
    }

    return session;
  }

  private ensureSessionOwnsRoom(room: Room, session: Session): void;
  private ensureSessionOwnsRoom(room: Room, sessionId: number): void;
  private ensureSessionOwnsRoom(
    room: Room,
    sessionOrId: Session | number
  ): void {
    const sessionOwnsRoom = _.isNumber(sessionOrId)
      ? room.ownerSessionId === sessionOrId
      : room.ownerSessionId === sessionOrId.id;

    if (!sessionOwnsRoom) {
      this.throwSessionIsNotAnOwnerException();
    }
  }

  private throwRoomNotFoundException(roomId: number): never {
    throw new NotFoundException({ roomId }, 'Room not found');
  }

  private throwSessionIsNotAnOwnerException(): never {
    throw new SessionNotAllowedActionException(
      'session is not an owner of the room'
    );
  }

  private ensureMaxPlayerConstraint(room: Room): void {
    if (room.numPlayers > room.maxPlayers) {
      throw new BadRequestException(
        `Room violates max players constraint: max players is ${room.maxPlayers} and number of players is ${room.numPlayers}`
      );
    }
  }

  private ensureMaxObserverConstraint(room: Room): void {
    if (room.numObservers > room.maxObservers) {
      throw new BadRequestException(
        `Room violates max observers constraint: max observers is ${room.maxObservers} and number of observers is ${room.numObservers}`
      );
    }
  }
}
