import { Injectable } from '@angular/core';
import { BudgetDto } from '../models/expense.dto';
import { liveQuery, Observable } from 'dexie';
import { db } from '../db/app-database';
import { ItemDto } from '../models/item.dto';

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {
  budgets$ = liveQuery(() => db.budgets.toArray());

  constructor() {}

  getAllBudgets(): Observable<BudgetDto[]> {
    return this.budgets$;
  }

  getBudget(id: number) {
    return liveQuery(() => db.budgets.get(id));
  }

  updateBudgetItems(id: string, itemTitle: string) {
    this.getBudget(parseInt(id)).subscribe((budget) => {
      console.log(budget);
      if (budget) {
        var item = budget?.details.find((i) => i.name === itemTitle);

        // console.log(item);
        if (item) {
          let index = budget?.details.indexOf(item);
          budget?.details.splice(index as number, 1);
        }
      }

      console.log(budget);
      console.log(db.budgets);
      // .update(id, { details: budget?.details })
      // .then((d) => console.log(d));
    });

    this.getBudget(parseInt(id)).subscribe((b) => console.log(b));
  }

  async createBudget(record: BudgetDto) {
    await db.budgets.add(record);
  }

  getExpense() {}
}
