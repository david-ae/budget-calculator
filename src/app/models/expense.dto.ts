import { ItemDto } from './item.dto';

export interface BudgetDto {
  id?: number;
  name: string;
  baseAmount: number;
  details: ItemDto[];
}
