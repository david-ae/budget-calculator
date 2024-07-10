import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ExpenseDto } from '../models/expense.dto';
import { WindowRef } from '../windowRef';
import Dexie, { Table } from 'dexie';
import { liveQuery } from 'dexie';
import { db } from '../db/app-database';

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {
  budgets$ = liveQuery(() => db.budgets.toArray());

  constructor() {}

  getAllBudgets() {
    return this.budgets$;
  }

  async addExpense(record: ExpenseDto) {
    await db.budgets.add(record);
  }

  getExpense() {}
}
