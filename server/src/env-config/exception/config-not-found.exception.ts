export class ConfigNotFoundException extends Error {
  readonly name = 'ConfigNotFoundException';

  constructor(configPaths: string[]) {
    super();

    this.message = this.formatMessage(configPaths);
  }

  private formatMessage(configPaths: string[]): string {
    return `Configuration file not found. Configuration file at one of ${configPaths.join(
      ', '
    )} is needed.`;
  }
}
