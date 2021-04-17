import { Room } from '../model/room.model';

export class MaxPlayersExceededException extends Error {
  constructor(room: Room) {
    super();

    this.name = 'MaxPlayersExceededException';
    this.message = `Cannot join to room ${room.name} as player: max allowed number of players is ${room.maxPlayers}`;
  }
}
