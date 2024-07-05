import { ItemDto } from './item.dto';

export interface ExpenseDto {
  baseAmount: number;
  details: ItemDto[];
}
