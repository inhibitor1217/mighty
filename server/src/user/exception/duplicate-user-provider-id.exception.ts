import { AuthProvider } from '../../auth/entity/auth-provider';

export class DuplicateUserProviderIdException extends Error {
  readonly name = 'DuplicateUserProviderIdException';

  constructor(params: { provider: AuthProvider; providerId: string }) {
    super();

    this.message = this.formatMessage(params.provider, params.providerId);
  }

  private formatMessage(provider: AuthProvider, providerId: string) {
    return `User with provider = ${AuthProvider.toString(
      provider
    )}, providerId = ${providerId} already exists`;
  }
}
