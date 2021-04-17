export class SessionNotAllowedActionException extends Error {
  constructor(reason: string) {
    super();

    this.name = 'SessionNotAllowedActionException';
    this.message = `Session is not allowed to perform action: ${reason}`;
  }
}
