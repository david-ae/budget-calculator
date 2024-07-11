import { Injectable } from '@angular/core';
import { ExpenseDto } from '../models/expense.dto';
import { liveQuery, Observable } from 'dexie';
import { db } from '../db/app-database';

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {
  budgets$ = liveQuery(() => db.budgets.toArray());

  constructor() {}

  getAllBudgets(): Observable<ExpenseDto[]> {
    return this.budgets$;
  }

  async addExpense(record: ExpenseDto) {
    await db.budgets.add(record);
  }

  getExpense() {}
}
