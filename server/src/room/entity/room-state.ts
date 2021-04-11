/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

import { unreachable } from '../../utils/unreachable';

export enum RoomState {
  Open = 'open',
  Closed = 'closed',

  Mock = 'mock',
}

export namespace RoomState {
  export const values: string[] = ['open', 'closed'];

  export function toString(roomState: RoomState) {
    switch (roomState) {
      case RoomState.Open:
        return 'open';
      case RoomState.Closed:
        return 'closed';
      case RoomState.Mock:
        return 'mock';
      default:
        return unreachable();
    }
  }
}
