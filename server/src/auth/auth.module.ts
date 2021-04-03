import { Module } from '@nestjs/common';
import { EnvConfigModule } from '../env-config/env-config.module';
import { AuthService } from './auth.service';
import { GoogleOauthStrategy } from './strategy/google-oauth.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [EnvConfigModule],
  providers: [AuthService, GoogleOauthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
