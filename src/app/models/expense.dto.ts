import { ItemDto } from './item.dto';

export interface ExpenseDto {
  id?:number;
  name: string;
  baseAmount: number;
  details: ItemDto[];
}
