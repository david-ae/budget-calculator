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
  id!: string;

  percentageSum = computed(() =>
    this.budget().details.reduce((a, b) => a + b.percentage, 0)
  );
  amountSum = computed(() =>
    this.budget().details.reduce(
      (a, b) => a + parseFloat(this.retrieveAmount(b.amount)),
      0
    )
  );
  balance = computed(() => this.budget().baseAmount - this.amountSum());

  budget = signal<BudgetDto>({ name: '', baseAmount: 0, details: [] });

  constructor(private indexDBService: IndexDbService) {}

  budgetData(id: string) {
    this.indexDBService.getBudget(parseInt(id)).subscribe((budget) => {
      this.budget.update((v) => (v = budget as BudgetDto));
    });
  }

  updateBaseAmount(amount: string) {
    let money = this.retrieveAmount(amount);
    this.budget.update((b) => (b = { ...b, baseAmount: parseFloat(money) }));
    console.log(this.budget());
  }

  retrieveAmount(money: string): string {
    return money.replaceAll(',', '').replace('₦', '');
  }
}
