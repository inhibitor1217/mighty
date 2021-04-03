import { ValidationError } from 'joi';

export class InvalidConfigException extends Error {
  readonly name = 'InvalidConfigException';

  constructor(validationError: ValidationError) {
    super();

    this.message = this.formatMessage(validationError);
  }

  private formatMessage(validationError: ValidationError): string {
    const message = `Invalid configuration: ${validationError.message}`;
    const details = validationError.details.map((item) => item.message);
    return [message, ...details].join('\n');
  }
}
