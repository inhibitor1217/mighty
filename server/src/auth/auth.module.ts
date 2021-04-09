import { Module } from '@nestjs/common';
import { EnvConfigModule } from '../env-config/env-config.module';
import { AuthService } from './auth.service';
import { GoogleOauthStrategy } from './strategy/google-oauth.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EnvConfigModule, UserModule],
  providers: [AuthService, GoogleOauthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
