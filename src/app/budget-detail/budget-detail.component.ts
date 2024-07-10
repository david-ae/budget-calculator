import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ItemDto } from '../models/item.dto';
import { IndexDbService } from '../services/index-db.service';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [MatButtonModule, NgxCurrencyDirective, ReactiveFormsModule],
  templateUrl: './budget-detail.component.html',
  styleUrl: './budget-detail.component.css'
})
export class BudgetDetailComponent implements OnInit{
  calculatorForm!: FormGroup;
  detailsForm!: FormGroup;

  baseAmount = signal<number>(0);
  items = signal<ItemDto[]>([]);
  percentageSum = signal<number>(0);
  amountSum = signal<number>(0);
  balance = signal<number>(0);

  constructor(private indexDBService: IndexDbService) {
    this.calculatorForm = new FormGroup({
      baseAmount: new FormControl('', [Validators.required, Validators.min(1)]),
      itemTitle: new FormControl('', [Validators.required]),
    });
    this.detailsForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.indexDBService
      .getAllBudgets()
      .subscribe((items) => console.log(items));
  }

  onBaseAmountChange(event: any) {
    let money = this.retrieveAmount(event.target.value as string);
    this.baseAmount.update((b) => (b = parseFloat(money)));
    this.updatePercentage();
  }

  addExpenseItem() {
    const title = this.calculatorForm.get('itemTitle')?.value;
    this.detailsForm.addControl(
      title,
      new FormControl('', [Validators.max(this.baseAmount())])
    );
    let itemExists = this.items().find((v) => v.name == title);
    if (!itemExists) {
      const item: ItemDto = {
        name: title,
        amount: 0,
        percentage: 0,
      };
      let d: ItemDto[] = [];
      this.indexDBService.addExpense({
        name: 'monthly expense',
        baseAmount: this.baseAmount(),
        details: [...d, item],
      });
      this.items.update((i) => [...i, item]);
    }
  }

  calculatePercentage(event: any, item: ItemDto) {
    let money = this.retrieveAmount(event.target.value as string);
    console.log(money);
    if (parseFloat(money) <= this.baseAmount()) {
      this.items().map((i) => {
        if (i.name === item.name) {
          console.log(money);
          i.amount = Number.parseFloat(parseFloat(money).toFixed(2));
          i.percentage = +(
            (parseFloat(money) / this.baseAmount()) *
            100
          ).toFixed(2);
        }
      });
      let newPercentageSum = this.items().reduce((a, b) => a + b.percentage, 0);
      let newAmountSum = this.items().reduce((a, b) => a + b.amount, 0);
      this.percentageSum.update((v) => (v = newPercentageSum));
      this.amountSum.update((v) => (v = newAmountSum));
      this.balance.update((v) => (v = this.baseAmount() - newAmountSum));
    }
  }

  updatePercentage() {
    this.items().map(
      (i) => (i.percentage = +((i.amount / this.baseAmount()) * 100).toFixed(2))
    );
  }

  initCalculator() {}

  retrieveAmount(money: string): string {
    return money.replaceAll(',', '').replace('₦', '');
  }
}
