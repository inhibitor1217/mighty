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
} from '@nestjs/common';
import _ from 'lodash';
import type { AuthenticatedRequest } from '../auth/entity/authenticated-request';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { PaginationQuery } from '../utils/pagination-query';
import { CreateRoomDto } from './dto/create-room.dto';
import { PatchRoomDto } from './dto/patch-room.dto';
import { DuplicateSessionException } from './exception/duplicate-session.exception';
import { NoSessionException } from './exception/no-session.exception';
import { Room } from './model/room.model';
import { Session } from './model/session.model';
import { RoomService } from './room.service';

interface RoomControllerMethodReturn {
  rooms: Room[];
  session: Session | null;
}

@Controller('room')
// TODO implement custom exception filter to intercept session exceptions
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

    const {
      room,
      session: createdSession,
    } = await this.roomService.createAndJoin(dto.toServiceDto(user.id));

    return { rooms: [room], session: createdSession };
  }

  @Post(':roomId/join')
  @UseGuards(JwtAuthGuard)
  async join(
    @Req() req: AuthenticatedRequest,
    @Param('roomId', ParseIntPipe) roomId: number
  ): Promise<RoomControllerMethodReturn> {
    const { user } = req;
    await this.ensureUserHasNoSessions(user);

    // TODO implement joining room via service
    return { rooms: [], session: null };
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
    @Req() req: AuthenticatedRequest,
    @Query() paginationQuery: PaginationQuery
  ): Promise<RoomControllerMethodReturn> {
    return { rooms: [], session: null };
  }

  @Get(':roomId')
  @UseGuards(JwtAuthGuard)
  async getOne(
    @Req() req: AuthenticatedRequest,
    @Param('roomId', ParseIntPipe) roomId: number
  ): Promise<RoomControllerMethodReturn> {
    return { rooms: [], session: null };
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async patch(
    @Req() req: AuthenticatedRequest,
    @Body() dto: PatchRoomDto
  ): Promise<RoomControllerMethodReturn> {
    const { user } = req;
    const session = await this.getUserSessionOrThrow(user);

    // NOTE: patches room of current session
    // NOTE: should be only available to the owner of the room

    return { rooms: [], session: null };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async leave(
    @Req() req: AuthenticatedRequest
  ): Promise<RoomControllerMethodReturn> {
    const { user } = req;
    const session = await this.getUserSessionOrThrow(user);

    // NOTE: leave room of current session
    // NOTE: should delete room if no sessions exist

    return { rooms: [], session: null };
  }

  private async getUserSessionOrThrow(user: User): Promise<Session> {
    const session = await this.userService.getSession(user.id);
    if (_.isNil(session)) {
      throw new NoSessionException();
    }
    return session;
  }
}
