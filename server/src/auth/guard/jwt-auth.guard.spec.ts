import _ from 'lodash';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { EnvConfigService } from '../../env-config/env-config.service';
import { UserState } from '../../user/entity/user-state';
import { User } from '../../user/model/user.model';
import { AuthService } from '../auth.service';
import { AuthToken } from '../entity/auth-token';
import { AccessTokenStrategy } from '../strategy/access-token.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  const jwtSecret = 'jwt-secret';
  const jwtIssuer = 'example.com';

  const mockEnvConfig = {
    get: () => ({
      jwt: {
        issuer: jwtIssuer,
        secret: jwtSecret,
      },
    }),
  };

  function getMockExecutionContext(options?: {
    accessToken?: string;
    refreshToken?: string;
  }): jest.Mocked<ExecutionContext> {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies: {
            [AuthToken.toCookieKey(
              AuthToken.AccessToken
            )]: options?.accessToken,
            [AuthToken.toCookieKey(
              AuthToken.RefreshToken
            )]: options?.refreshToken,
          },
        }),
        getResponse: () => ({}),
      }),
    } as jest.Mocked<ExecutionContext>;
  }

  function getDefaultJwtOptions(authToken: AuthToken): JwtModuleOptions {
    return {
      secret: jwtSecret,
      signOptions: {
        issuer: jwtIssuer,
        subject: AuthToken.toCookieKey(authToken),
      },
    };
  }

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [
        {
          provide: EnvConfigService,
          useValue: mockEnvConfig,
        },
        AccessTokenStrategy,
      ],
    }).compile();

    guard = new JwtAuthGuard();

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('request without token should throw UnauthorizedException', async () => {
    /* Given */
    const context = getMockExecutionContext();

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('No auth token provided')
    );
  });

  it('request with invalid access token should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      _.merge({}, getDefaultJwtOptions(AuthToken.AccessToken), {
        secret: 'invalid-secret',
      })
    );
    const accessToken = await jwtService.signAsync(
      {
        ...User.mockValue.toAccessTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid access token')
    );
  });

  it('request with wrong access token subject should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      _.merge({}, getDefaultJwtOptions(AuthToken.AccessToken), {
        signOptions: { subject: 'foo' },
      })
    );
    const accessToken = await jwtService.signAsync(
      {
        ...User.mockValue.toAccessTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid access token: wrong subject')
    );
  });

  it('request with wrong access token issuer should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      _.merge({}, getDefaultJwtOptions(AuthToken.AccessToken), {
        signOptions: { issuer: 'bar.com' },
      })
    );
    const accessToken = await jwtService.signAsync(
      {
        ...User.mockValue.toAccessTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid access token: wrong issuer')
    );
  });

  it('request with expired access token should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.AccessToken)
    );
    const accessToken = await jwtService.signAsync(
      {
        ...User.mockValue.toAccessTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '-10s' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid access token: token expired')
    );
  });

  it('request with invalid access token payload should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.AccessToken)
    );
    const accessToken = await jwtService.signAsync(
      {
        id: 1,
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid access token: invalid payload')
    );
  });

  it('request with access token payload without version should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.AccessToken)
    );
    const accessToken = await jwtService.signAsync(
      User.mockValue.toAccessTokenPayload(),
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid access token: no version specified')
    );
  });

  it('request with valid access token and payload should pass', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.AccessToken)
    );
    const accessToken = await jwtService.signAsync(
      {
        ...User.mockValue.toAccessTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    const canActivate = await guard.canActivate(context);

    /* Expect */
    expect(canActivate).toBe(true);
  });

  it('request with access token of deleted user should throw ForbiddenException', async () => {
    /* Given */
    const deletedUser = User.mockValue;
    deletedUser.state = UserState.Deleted;

    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.AccessToken)
    );
    const accessToken = await jwtService.signAsync(
      {
        ...deletedUser.toAccessTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new ForbiddenException('Deleted user')
    );
  });

  it('request with access token of banned user should throw ForbiddenException', async () => {
    /* Given */
    const bannedUser = User.mockValue;
    bannedUser.state = UserState.Banned;

    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.AccessToken)
    );
    const accessToken = await jwtService.signAsync(
      {
        ...bannedUser.toAccessTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new ForbiddenException('Banned user')
    );
  });

  it('request with invalid refresh token should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      _.merge({}, getDefaultJwtOptions(AuthToken.RefreshToken), {
        secret: 'invalid-secret',
      })
    );
    const refreshToken = await jwtService.signAsync(
      {
        ...User.mockValue.toRefreshTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '7d' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid refresh token')
    );
  });

  it('request with wrong refresh token subject should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      _.merge({}, getDefaultJwtOptions(AuthToken.RefreshToken), {
        signOptions: { subject: AuthToken.toJwtSubject(AuthToken.AccessToken) },
      })
    );
    const refreshToken = await jwtService.signAsync(
      {
        ...User.mockValue.toRefreshTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '7d' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid refresh token: wrong subject')
    );
  });

  it('request with wrong refresh token issuer should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      _.merge({}, getDefaultJwtOptions(AuthToken.RefreshToken), {
        signOptions: { issuer: 'other.service.com' },
      })
    );
    const refreshToken = await jwtService.signAsync(
      {
        ...User.mockValue.toRefreshTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '7d' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid refresh token: wrong issuer')
    );
  });

  it('request with expired refresh token should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.RefreshToken)
    );
    const refreshToken = await jwtService.signAsync(
      {
        ...User.mockValue.toRefreshTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '-10m' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid refresh token: token expired')
    );
  });

  it('request with invalid refresh token payload should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.RefreshToken)
    );
    const refreshToken = await jwtService.signAsync(
      {
        uid: 1,
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '7d' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid refresh token: invalid payload')
    );
  });

  it('request with refresh token payload without version should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.RefreshToken)
    );
    const refreshToken = await jwtService.signAsync(
      {
        ...User.mockValue.toRefreshTokenPayload(),
      },
      { expiresIn: '7d' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new UnauthorizedException('Invalid refresh token: no version specified')
    );
  });

  it('request with valid refresh token and payload should pass', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.RefreshToken)
    );
    const refreshToken = await jwtService.signAsync(
      {
        ...User.mockValue.toRefreshTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '7d' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* Run */
    const canActivate = await guard.canActivate(context);

    /* Expect */
    expect(canActivate).toBe(true);
  });

  it('request with refresh token of deleted user should throw ForbiddenException', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.RefreshToken)
    );
    const refreshToken = await jwtService.signAsync(
      {
        ...User.mockValue.toRefreshTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '7d' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* TODO: mock UserService to return deleted user */

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new ForbiddenException('Deleted user')
    );
  });

  it('request with refresh token of banned user should throw ForbiddenException', async () => {
    /* Given */
    const jwtService = new JwtService(
      getDefaultJwtOptions(AuthToken.RefreshToken)
    );
    const refreshToken = await jwtService.signAsync(
      {
        ...User.mockValue.toAccessTokenPayload(),
        version: AuthService.authTokenVersion,
      },
      { expiresIn: '7d' }
    );
    const context = getMockExecutionContext({ refreshToken });

    /* TODO: mock UserService to return banned user */

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      new ForbiddenException('Banned user')
    );
  });

  it('request with access token should not refer to UserService', async () => {});

  it('request with refresh token should refer to UserService.findOneById once', async () => {});
});
