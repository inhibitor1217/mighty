export class FullRoomException extends Error {
  constructor(details: Error) {
    super();

    this.name = 'FullRoomException';
    this.message = details.message;
  }
}
