import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppStage } from '../env-config/entity/app-stage';
import { EnvConfigService } from '../env-config/env-config.service';
import { User } from '../user/model/user.model';
import { unreachable } from '../utils/unreachable';
import { AuthService } from './auth.service';
import { AuthToken } from './entity/auth-token';

describe('AuthService', () => {
  let service: AuthService;
  let envConfig: EnvConfigService;
  let jwt: JwtService;

  function mockEnvConfigGet(mockValues: {
    cookieDomain: string;
    appStage: AppStage;
  }) {
    return (propertyPath: string) => {
      const { cookieDomain, appStage } = mockValues;

      switch (propertyPath) {
        case 'auth':
          return { cookie: { domain: cookieDomain } };
        case 'app':
          return { stage: appStage };
        default:
          return unreachable();
      }
    };
  }

  const mockJwtService = { signAsync: () => Promise.resolve() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        EnvConfigService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    envConfig = module.get<EnvConfigService>(EnvConfigService);
    jwt = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signAuthCookies signs cookies correctly', async () => {
    /* Given */
    jest.spyOn(envConfig, 'get').mockImplementation(
      mockEnvConfigGet({
        cookieDomain: 'example.com',
        appStage: AppStage.Development,
      })
    );
    jest
      .spyOn(jwt, 'signAsync')
      .mockImplementation(() => Promise.resolve('mock-token'));
    const setCookie = jest.fn();

    /* Run */
    await service.signAuthCookies(User.mockValue, setCookie);

    /* Expect */
    expect(setCookie).toBeCalledTimes(2);
    expect(setCookie).toBeCalledWith(
      AuthToken.toCookieKey(AuthToken.AccessToken),
      'mock-token',
      expect.anything()
    );
    expect(setCookie).toBeCalledWith(
      AuthToken.toCookieKey(AuthToken.RefreshToken),
      'mock-token',
      expect.anything()
    );
  });

  it('signToken correctly signs access token', async () => {
    /* Given */
    const signAsync = jest
      .spyOn(jwt, 'signAsync')
      .mockImplementation(() => Promise.resolve('mock-token'));
    const tokenPayload = { foo: 'foo' };

    /* Run */
    const token = await service.signToken(AuthToken.AccessToken, tokenPayload);

    /* Expect */
    expect(token).toBe('mock-token');

    expect(signAsync).toBeCalledTimes(1);
    expect(signAsync).toBeCalledWith(
      expect.objectContaining({ foo: 'foo' }),
      expect.objectContaining({
        subject: AuthToken.toJwtSubject(AuthToken.AccessToken),
        expiresIn: expect.any(String),
      })
    );
  });

  it('signToken correctly signs refresh token', async () => {
    /* Given */
    const signAsync = jest
      .spyOn(jwt, 'signAsync')
      .mockImplementation(() => Promise.resolve('mock-token'));
    const tokenPayload = { bar: 'bar' };

    /* Run */
    const token = await service.signToken(AuthToken.RefreshToken, tokenPayload);

    /* Expect */
    expect(token).toBe('mock-token');

    expect(signAsync).toBeCalledTimes(1);
    expect(signAsync).toBeCalledWith(
      expect.objectContaining({ bar: 'bar' }),
      expect.objectContaining({
        subject: AuthToken.toJwtSubject(AuthToken.RefreshToken),
        expiresIn: expect.any(String),
      })
    );
  });

  it('clearAuthCookies clears both access token and refresh token', () => {
    /* Given */
    jest.spyOn(envConfig, 'get').mockImplementation(
      mockEnvConfigGet({
        cookieDomain: 'example.com',
        appStage: AppStage.Development,
      })
    );
    const setCookie = jest.fn();

    /* Run */
    service.clearAuthCookies(setCookie);

    /* Expect */
    expect(setCookie).toBeCalledTimes(2);
    expect(setCookie).toBeCalledWith(
      AuthToken.toCookieKey(AuthToken.AccessToken),
      expect.anything(),
      expect.objectContaining({ maxAge: 0 })
    );
    expect(setCookie).toBeCalledWith(
      AuthToken.toCookieKey(AuthToken.RefreshToken),
      expect.anything(),
      expect.objectContaining({ maxAge: 0 })
    );
  });

  it('getCookieOptions should return cookie options from environment', () => {
    /* Given */
    jest.spyOn(envConfig, 'get').mockImplementation(
      mockEnvConfigGet({
        cookieDomain: 'example.com',
        appStage: AppStage.Development,
      })
    );

    /* Run */
    const accessCookieOptions = service.getCookieOptions(AuthToken.AccessToken);
    const refreshCookieOptions = service.getCookieOptions(
      AuthToken.RefreshToken
    );

    /* Expect */
    expect(accessCookieOptions.httpOnly).toBe(true);
    expect(refreshCookieOptions.httpOnly).toBe(true);

    expect(accessCookieOptions.path).toBe('/');
    expect(refreshCookieOptions.path).toBe('/');

    expect(accessCookieOptions.domain).toBe('example.com');
    expect(refreshCookieOptions.domain).toBe('example.com');
  });

  it('getCookieOptions should return secure cookie options on beta environment', () => {
    /* Given */
    jest.spyOn(envConfig, 'get').mockImplementation(
      mockEnvConfigGet({
        cookieDomain: 'other,example.com',
        appStage: AppStage.Beta,
      })
    );

    /* Run */
    const cookieOptions = service.getCookieOptions(AuthToken.AccessToken);

    /* Expect */
    expect(cookieOptions.secure).toBe(true);
  });

  it('getCookieOptions should return secure cookie options on production environment', () => {
    /* Given */
    jest.spyOn(envConfig, 'get').mockImplementation(
      mockEnvConfigGet({
        cookieDomain: 'another.example.com',
        appStage: AppStage.Production,
      })
    );

    /* Run */
    const cookieOptions = service.getCookieOptions(AuthToken.RefreshToken);

    /* Expect */
    expect(cookieOptions.secure).toBe(true);
  });

  it('getCookieOptions should clear cookie if clear option is given', () => {
    /* Given */
    jest.spyOn(envConfig, 'get').mockImplementation(
      mockEnvConfigGet({
        cookieDomain: 'example.com',
        appStage: AppStage.Development,
      })
    );

    /* Run */
    const cookieOptions = service.getCookieOptions(AuthToken.AccessToken, {
      clear: true,
    });

    /* Exepct */
    expect(cookieOptions.maxAge).toBe(0);
  });
});
