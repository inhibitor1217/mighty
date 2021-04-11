import { Injectable } from '@nestjs/common';
import { CreateRoomServiceDto } from './dto/create-room.service.dto';
import { Room } from './model/room.model';
import { Session } from './model/session.model';

interface CreateAndJoinReturn {
  room: Room;
  session: Session;
}

@Injectable()
export class RoomService {
  async createAndJoin(dto: CreateRoomServiceDto): Promise<CreateAndJoinReturn> {
    return { room: new Room(), session: Session.mockValue };
  }
}
