import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ActiveUserController } from './active-user.controller';
import { UserModule } from './user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [],
  exports: [],
  controllers: [ActiveUserController],
})
export class ActiveUserModule {}
