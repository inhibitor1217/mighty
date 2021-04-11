import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RdbModule } from './rdb/rdb.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [AuthModule, RdbModule, RoomModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
