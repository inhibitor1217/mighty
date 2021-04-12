export class NoSessionException extends Error {
  constructor() {
    super();

    this.name = 'NoSessionException';
    this.message = 'User has no active session';
  }
}
