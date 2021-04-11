import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { SortOrder } from './sort-order';

export class PaginationQuery {
  @IsInt()
  @Min(1)
  @Max(64)
  readonly limit: number = 64;

  @IsOptional()
  @IsInt()
  readonly cursor?: number;

  @IsIn(SortOrder.values)
  readonly order: SortOrder = SortOrder.Descending;
}
