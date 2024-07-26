import { computed, effect, Injectable, signal } from '@angular/core';
import { BudgetDto } from '../models/expense.dto';
import { ItemDto } from '../models/item.dto';
import { IndexDbService } from './index-db.service';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  budgetName!: string;
  newBudget = false;

  budget = signal<BudgetDto>({ name: '', baseAmount: 0, details: [] });

  id!: string;

  constructor(private indexDBService: IndexDbService) {}

  saveNewBudget(budget: BudgetDto) {
    return this.indexDBService.createBudget(budget);
  }

  updateBudget(id: string, budget: BudgetDto) {
    return this.indexDBService.updateBudget(parseInt(id), budget);
  }

  getBudget(id: string) {
    return this.indexDBService.getBudget(parseInt(id));
  }

  deleteBudget(id: string) {
    this.indexDBService.deleteBudget(parseInt(id));
  }

  updateBaseAmount(amount: string) {
    return this.retrieveAmount(amount);
  }

  retrieveAmount(money: string): string {
    return money.replaceAll(',', '').replace('₦', '');
  }
}
