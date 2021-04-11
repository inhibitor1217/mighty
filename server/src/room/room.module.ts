import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { RoomController } from './room.controller';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [RoomController],
})
export class RoomModule {}
