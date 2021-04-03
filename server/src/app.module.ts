import { Module } from '@nestjs/common';
import { EnvConfigModule } from './env-config/env-config.module';

@Module({
  imports: [EnvConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
