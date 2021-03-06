import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import _ from 'lodash';
import type { AuthenticatedRequest } from '../auth/entity/authenticated-request';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { PaginationQuery } from '../utils/pagination-query';
import { CreateRoomDto } from './dto/create-room.dto';
import { PatchRoomDto } from './dto/patch-room.dto';
import { PatchSessionDto } from './dto/patch-session.dto';
import { DuplicateSessionException } from './exception/duplicate-session.exception';
import { NoSessionException } from './exception/no-session.exception';
import { Room } from './model/room.model';
import { Session } from './model/session.model';
import { RoomExceptionsInterceptor } from './room-exceptions.interceptor';
import { RoomService } from './room.service';

interface RoomControllerMethodReturn {
  rooms?: Room[];
  deletedRoomId?: number;
  sessions?: Session[];
  users?: User[];
}

@Controller('room')
@UseInterceptors(RoomExceptionsInterceptor)
export class RoomController {
  constructor(
    private readonly userService: UserService,
    private readonly roomService: RoomService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRoomDto
  ): Promise<RoomControllerMethodReturn> {
    const { user } = req;
    await this.ensureUserHasNoSessions(user);

    const { room, session } = await this.roomService.createAndJoin(
      dto.toServiceDto(user.id)
    );

    return { rooms: [room], sessions: [session] };
  }

  @Post(':roomId/join')
  @UseGuards(JwtAuthGuard)
  async join(
    @Req() req: AuthenticatedRequest,
    @Param('roomId', ParseIntPipe) roomId: number
  ): Promise<RoomControllerMethodReturn> {
    const { user } = req;
    await this.ensureUserHasNoSessions(user);

    const { room } = await this.roomService.join(roomId, user.id);
    const { sessions, users } = await this.roomService.getSessions(roomId);

    return { rooms: [room], sessions, users };
  }

  private async ensureUserHasNoSessions(user: User): Promise<void> {
    const hasSession = await this.userService.hasSession(user.id);
    if (hasSession) {
      throw new DuplicateSessionException();
    }
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async list(
    @Query() paginationQuery: PaginationQuery
  ): Promise<RoomControllerMethodReturn> {
    const rooms = await this.roomService.getMany(paginationQuery);

    return { rooms };
  }

  @Get(':roomId')
  @UseGuards(JwtAuthGuard)
  async getOne(
    @Param('roomId', ParseIntPipe) roomId: number
  ): Promise<RoomControllerMethodReturn> {
    const room = await this.roomService.getOne(roomId);
    const { sessions, users } = await this.roomService.getSessions(roomId);

    return { rooms: [room], sessions, users };
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async patch(
    @Req() req: AuthenticatedRequest,
    @Body() dto: PatchRoomDto
  ): Promise<RoomControllerMethodReturn> {
    const { user } = req;
    const session = await this.getUserSessionOrThrow(user);
    const room = await this.roomService.patchOne(dto.toServiceDto(session));
    const { sessions } = await this.roomService.getSessions(session.roomId);

    return { rooms: [room], sessions };
  }

  @Patch('session')
  @UseGuards(JwtAuthGuard)
  async patchSession(
    @Req() req: AuthenticatedRequest,
    @Body() dto: PatchSessionDto
  ): Promise<RoomControllerMethodReturn> {
    const { user } = req;
    const session = await this.getUserSessionOrThrow(user);
    const { room, session: newSession } = await this.roomService.patchSession(
      session,
      dto.toServiceDto()
    );

    return { rooms: [room], sessions: [newSession] };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async leave(
    @Req() req: AuthenticatedRequest
  ): Promise<RoomControllerMethodReturn> {
    const { user } = req;
    const session = await this.getUserSessionOrThrow(user);

    const { room, deletedRoomId } = await this.roomService.leave(session);

    return { rooms: _.isNil(room) ? [] : [room], deletedRoomId };
  }

  private async getUserSessionOrThrow(user: User): Promise<Session> {
    const session = await this.userService.getSession(user.id);
    if (_.isNil(session)) {
      throw new NoSessionException();
    }
    return session;
  }
}
