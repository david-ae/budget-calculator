import Dexie, { Table } from 'dexie';
import { ExpenseDto } from '../models/expense.dto';

export class AppDatabase extends Dexie {
  budgets!: Table<ExpenseDto>;
  constructor() {
    super('finance');
    this.version(1).stores({
      budgets: '++id, name, baseAmount, details',
    });
  }
}

export const db = new AppDatabase();
