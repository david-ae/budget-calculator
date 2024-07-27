import { Injectable, signal } from '@angular/core';
import { BudgetDto } from '../models/expense.dto';
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

  updateBudget(id: number, budget: BudgetDto) {
    return this.indexDBService.updateBudget(id, budget);
  }

  getBudget(id: string) {
    return this.indexDBService.getBudget(parseInt(id));
  }
  getBudget2(id: string) {
    this.indexDBService
      .getBudget(parseInt(id))
      .then((b) => this.budget.update((g) => (g = b as BudgetDto)));
  }

  deleteBudget(id: number) {
    return this.indexDBService.deleteBudget(id);
  }

  updateBaseAmount(amount: string) {
    return this.retrieveAmount(amount);
  }

  retrieveAmount(money: string): string {
    return money.replaceAll(',', '').replace('₦', '');
  }
}
