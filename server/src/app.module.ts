import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RdbModule } from './rdb/rdb.module';

@Module({
  imports: [AuthModule, RdbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
