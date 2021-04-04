/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

import { unreachable } from '../../utils/unreachable';

export enum UserState {
  Active = 'active',
  Banned = 'banned',
  Deleted = 'deleted',
  WaitingForActivation = 'waiting-for-activation',
}

export namespace UserState {
  export const values: string[] = [
    'active',
    'banned',
    'deleted',
    'waiting-for-activation',
  ];

  export function parse(value: string): UserState {
    switch (value) {
      case 'active':
        return UserState.Active;
      case 'banned':
        return UserState.Banned;
      case 'deleted':
        return UserState.Deleted;
      case 'waiting-for-activation':
        return UserState.WaitingForActivation;
      default:
        return unreachable();
    }
  }

  export function toString(userState: UserState): string {
    switch (userState) {
      case UserState.Active:
        return 'active';
      case UserState.Banned:
        return 'banned';
      case UserState.Deleted:
        return 'deleted';
      case UserState.WaitingForActivation:
        return 'waiting-for-activation';
      default:
        return unreachable();
    }
  }
}
