import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/entity/authenticated-request';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { PatchRoomDto } from './dto/patch-room.dto';

interface RoomControllerMethodReturn extends JsonMap {
  rooms: JsonMap[];
  session: JsonMap | null;
}

@Controller('room')
export class RoomController {
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRoomDto
  ): Promise<RoomControllerMethodReturn> {
    // NOTE: should be only available if no session exist

    return { rooms: [], session: null };
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
    @Req() req: AuthenticatedRequest
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
