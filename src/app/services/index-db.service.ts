import { Injectable, signal } from '@angular/core';
import { BudgetDto } from '../models/expense.dto';
import { liveQuery, Observable } from 'dexie';
import { db } from '../db/app-database';
import { ItemDto } from '../models/item.dto';

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {
  budgets$ = liveQuery(() => db.budgets.toArray());
  budget = signal<BudgetDto>({ baseAmount: 0, name: '', details: [] });

  constructor() {}

  getAllBudgets(): Observable<BudgetDto[]> {
    return this.budgets$;
  }

  getBudget(id: number) {
    return liveQuery(() => db.budgets.get(id));
  }

  updateBudget(id: number, budget: BudgetDto) {
    return db.budgets.update(id, {
      id: id,
      name: budget.name,
      baseAmount: budget.baseAmount,
      details: budget.details,
    });
  }

  async createBudget(record: BudgetDto) {
    await db.budgets.add(record);
  }

  deleteBudget(id: number) {
    return db.budgets.delete(id);
  }

  getExpense() {}
}
