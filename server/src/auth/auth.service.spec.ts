import { Test, TestingModule } from '@nestjs/testing';
import { AppStage } from '../env-config/entity/app-stage';
import { EnvConfigService } from '../env-config/env-config.service';
import { unreachable } from '../utils/unreachable';
import { AuthService } from './auth.service';
import { AuthToken } from './entity/auth-token';

describe('AuthService', () => {
  let service: AuthService;
  let envConfig: EnvConfigService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, EnvConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    envConfig = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
