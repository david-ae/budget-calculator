import Dexie, { Table } from 'dexie';
import { BudgetDto } from '../models/expense.dto';

export class AppDatabase extends Dexie {
  budgets!: Table<BudgetDto>;
  constructor() {
    super('finance');
    this.version(1).stores({
      budgets: '++id, name, baseAmount, details',
    });
  }
}

export const db = new AppDatabase();
