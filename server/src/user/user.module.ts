import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rdbQueryRunnerProvider } from '../rdb/query-runner/rdb-query-runner.provider';
import { Session } from '../room/model/session.model';
import { UserProfile } from './model/user-profile.model';
import { User } from './model/user.model';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User, UserProfile])],
  providers: [UserService, rdbQueryRunnerProvider],
  exports: [UserService],
  controllers: [],
})
export class UserModule {}
