import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { EnvConfigService } from '../../env-config/env-config.service';
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
      UnauthorizedException
    );
  });

  it('request with invalid access token should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService({
      secret: 'invalid-secret',
      signOptions: {
        issuer: jwtIssuer,
        subject: AuthToken.toCookieKey(AuthToken.AccessToken),
      },
    });
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
      UnauthorizedException
    );
  });

  it('request with wrong access token subject should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService({
      secret: jwtSecret,
      signOptions: { issuer: jwtIssuer, subject: 'foo.com' },
    });
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
      UnauthorizedException
    );
  });

  it('request with wrong access token issuer should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService({
      secret: jwtSecret,
      signOptions: {
        issuer: 'bar.com',
        subject: AuthToken.toJwtSubject(AuthToken.AccessToken),
      },
    });
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
      UnauthorizedException
    );
  });

  it('request with expired access token should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService({
      secret: jwtSecret,
      signOptions: {
        issuer: jwtIssuer,
        subject: AuthToken.toJwtSubject(AuthToken.AccessToken),
      },
    });
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
      UnauthorizedException
    );
  });

  it('request with invalid access token payload should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService({
      secret: jwtSecret,
      signOptions: {
        issuer: jwtIssuer,
        subject: AuthToken.toJwtSubject(AuthToken.AccessToken),
      },
    });
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
      UnauthorizedException
    );
  });

  it('request with access token payload without version should throw UnauthorizedException', async () => {
    /* Given */
    const jwtService = new JwtService({
      secret: jwtSecret,
      signOptions: {
        issuer: jwtIssuer,
        subject: AuthToken.toJwtSubject(AuthToken.AccessToken),
      },
    });
    const accessToken = await jwtService.signAsync(
      User.mockValue.toAccessTokenPayload(),
      { expiresIn: '5m' }
    );
    const context = getMockExecutionContext({ accessToken });

    /* Run */
    /* Expect */
    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException
    );
  });

  it('request with valid access token and payload should pass', async () => {
    /* Given */
    const jwtService = new JwtService({
      secret: jwtSecret,
      signOptions: {
        issuer: jwtIssuer,
        subject: AuthToken.toJwtSubject(AuthToken.AccessToken),
      },
    });
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
});
