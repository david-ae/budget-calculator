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

  async getAllBudgets() {
    return await db.budgets.toArray();
  }

  getBudget(id: number) {
    return db.budgets.where({ id: id }).first();
    // return liveQuery(() => db.budgets.get(id));
  }

  async checkBudgetName(budgetName: string) {
    return await db.budgets.where('name').equalsIgnoreCase(budgetName).first();
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
    return await db.budgets.add(record);
  }

  deleteBudget(id: number) {
    return db.budgets.delete(id);
  }

  getExpense() {}
}
