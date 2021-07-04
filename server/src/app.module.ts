import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { RdbModule } from './rdb/rdb.module';
import { RoomModule } from './room/room.module';
import { ActiveUserModule } from './user/active-user.module';

@Module({
  imports: [ActiveUserModule, AuthModule, RdbModule, RoomModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
