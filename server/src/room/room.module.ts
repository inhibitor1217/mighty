import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { rdbQueryRunnerProvider } from '../rdb/query-runner/rdb-query-runner.provider';
import { UserModule } from '../user/user.module';
import { Room } from './model/room.model';
import { Session } from './model/session.model';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Room, Session]), UserModule],
  controllers: [RoomController],
  providers: [RoomService, rdbQueryRunnerProvider],
  exports: [RoomService],
})
export class RoomModule {}
