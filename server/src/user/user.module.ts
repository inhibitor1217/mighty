import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { rdbQueryRunnerProvider } from '../rdb/query-runner/rdb-query-runner.provider';
import { UserProfile } from './model/user-profile.model';
import { User } from './model/user.model';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserProfile])],
  providers: [UserService, rdbQueryRunnerProvider],
  exports: [UserService],
})
export class UserModule {}