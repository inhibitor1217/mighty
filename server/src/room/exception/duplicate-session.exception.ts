export class DuplicateSessionException extends Error {
  constructor() {
    super();

    this.name = 'DuplicateSessionException';
    this.message = 'User already has an active session';
  }
}
