/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-redeclare */

import { LessThan, MoreThan } from 'typeorm';
import { unreachable } from './unreachable';

export enum SortOrder {
  Ascending = 'asc',
  Descending = 'desc',
}

export namespace SortOrder {
  export const values: string[] = ['asc', 'desc'];

  export function toOrderBy(sortOrder: SortOrder) {
    switch (sortOrder) {
      case SortOrder.Ascending:
        return 'ASC';
      case SortOrder.Descending:
        return 'DESC';
      default:
        return unreachable();
    }
  }

  export function toComparator(sortOrder: SortOrder) {
    switch (sortOrder) {
      case SortOrder.Ascending:
        return MoreThan;
      case SortOrder.Descending:
        return LessThan;
      default:
        return unreachable();
    }
  }
}
