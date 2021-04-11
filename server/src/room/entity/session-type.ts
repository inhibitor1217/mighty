/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

import { unreachable } from '../../utils/unreachable';

export enum SessionType {
  Player = 'player',
  Observer = 'observer',

  Mock = 'mock',
}

export namespace SessionType {
  export const values: string[] = ['player', 'observer'];

  export function parse(value: string) {
    switch (value) {
      case 'player':
      case 'Player':
        return SessionType.Player;
      case 'observer':
      case 'Observer':
        return SessionType.Observer;
      default:
        return unreachable();
    }
  }

  export function toString(sessionType: SessionType) {
    switch (sessionType) {
      case SessionType.Player:
        return 'player';
      case SessionType.Observer:
        return 'observer';
      case SessionType.Mock:
        return 'mock';
      default:
        return unreachable();
    }
  }
}
