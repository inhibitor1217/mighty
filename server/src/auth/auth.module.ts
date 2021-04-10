import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvConfigService } from '../env-config/env-config.service';
import { AuthEnvironment } from '../env-config/entity/auth-environment';
import { UserModule } from '../user/user.module';
import { unreachable } from '../utils/unreachable';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './strategy/access-token.strategy';
import { GoogleOauthStrategy } from './strategy/google-oauth.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';

@Module({
  imports: [
    EnvConfigModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      inject: [EnvConfigService],
      useFactory: (envConfig: EnvConfigService) =>
        envConfig.get<AuthEnvironment>('auth')?.jwt.toJwtModuleOptions() ??
        unreachable(),
    }),
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    GoogleOauthStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
