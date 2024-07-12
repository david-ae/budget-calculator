import { Injectable } from '@angular/core';
import { BudgetDto } from '../models/expense.dto';
import { liveQuery, Observable } from 'dexie';
import { db } from '../db/app-database';

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {
  budgets$ = liveQuery(() => db.budgets.toArray());

  constructor() {}

  getAllBudgets(): Observable<BudgetDto[]> {
    return this.budgets$;
  }

  async createBudget(record: BudgetDto) {
    await db.budgets.add(record);
  }

  getExpense() {}
}
