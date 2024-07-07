import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExpenseDto } from './models/expense.dto';
import { ItemDto } from './models/item.dto';
import { IndexDbService } from './services/index-db.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatButtonModule, NgxCurrencyDirective, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  calculatorForm!: FormGroup;
  detailsForm!: FormGroup;

  baseAmount = signal<number>(0);
  items = signal<ItemDto[]>([]);
  percentageSum = signal<number>(0);
  amountSum = signal<number>(0);
  expense = signal<ExpenseDto>({ baseAmount: 0, details: [] });

  constructor() {
    this.calculatorForm = new FormGroup({
      baseAmount: new FormControl('', [Validators.required, Validators.min(1)]),
      itemTitle: new FormControl('', [Validators.required]),
    });
    this.detailsForm = new FormGroup({});
  }

  ngOnInit(): void {
    // this.indexDBService.getExpense();
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
      // this.indexDBService.addExpense({
      //   baseAmount: this.baseAmount(),
      //   details: [...d, item],
      // });
      this.items.update((i) => [...i, item]);
    }
  }

  calculatePercentage(event: any, item: ItemDto) {
    let money = this.retrieveAmount(event.target.value as string);

    if (parseFloat(money) <= this.baseAmount()) {
      this.items().map((i) => {
        if (i.name === item.name) {
          console.log(money);
          i.amount = +parseFloat(money).toFixed(2);
          i.percentage = +(
            (parseFloat(money) / this.baseAmount()) *
            100
          ).toFixed(2);
        }
      });
      console.log(this.items());
      let newPercentageSum = this.items().reduce((a, b) => a + b.percentage, 0);
      let newAmountSum = this.items().reduce((a, b) => a + b.amount, 0);
      console.log(newAmountSum);
      this.percentageSum.update((v) => (v = newPercentageSum));
      this.amountSum.update((v) => (v = newAmountSum));
    }
  }

  updatePercentage() {
    this.items().map(
      (i) => (i.percentage = +((i.amount / this.baseAmount()) * 100).toFixed(2))
    );
  }

  initCalculator() {
    // this.indexDBService.getExpense().then((e) => {
    //   console.log(e);
    //   // if (e) {
    //   //   this.calculatorForm.setValue({
    //   //     baseAmount: e.baseAmount,
    //   //   });
    //   //   e.details.map((v) =>
    //   //     this.detailsForm.addControl(v.name, new FormControl(v.amount))
    //   //   );
    //   // }
    // });
  }

  retrieveAmount(money: string): string {
    return money.replaceAll(',', '').replace('₦', '');
  }
}
