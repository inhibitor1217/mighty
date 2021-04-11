export class InvalidTokenPayloadException extends Error {
  constructor(field: string, value: any, expectedType: string) {
    super();

    this.name = 'InvalidTokenPayloadException';
    this.message = `Invalid value ${value} for field ${field}: expected ${expectedType}`;
  }
}
