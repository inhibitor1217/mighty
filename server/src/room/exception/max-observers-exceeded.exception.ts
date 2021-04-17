import { Room } from '../model/room.model';

export class MaxObserversExceededException extends Error {
  constructor(room: Room) {
    super();

    this.name = 'MaxObserversExceededException';
    this.message = `Cannot join to room ${room.name} as observer: max allowed number of observers is ${room.maxObservers}`;
  }
}
