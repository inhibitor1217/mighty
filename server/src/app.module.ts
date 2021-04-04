import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RdbModule } from './rdb/rdb.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, RdbModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
