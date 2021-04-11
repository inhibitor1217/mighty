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
import { UserService } from '../user/user.service';
import { PaginationQuery } from '../utils/pagination-query';
import { CreateRoomDto } from './dto/create-room.dto';
import { PatchRoomDto } from './dto/patch-room.dto';
import { DuplicateSessionException } from './exception/duplicate-session.exception';
import { Room } from './model/room.model';
import { Session } from './model/session.model';
import { RoomService } from './room.service';

interface RoomControllerMethodReturn {
  rooms: Room[];
  session: Session | null;
}

@Controller('room')
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
    const currentSession = await this.userService.getSession(user.id);

    if (!_.isNil(currentSession)) {
      throw new DuplicateSessionException();
    }

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
    // NOTE: should be only available if no session exist

    return { rooms: [], session: null };
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
    // NOTE: patches room of current session
    // NOTE: should be only available to the owner of the room

    return { rooms: [], session: null };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async leave(
    @Req() req: AuthenticatedRequest
  ): Promise<RoomControllerMethodReturn> {
    // NOTE: leave room of current seession
    // NOTE: should delete room if no sessions exist

    return { rooms: [], session: null };
  }
}
