import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ExpenseDto } from './models/expense.dto';
import { ItemDto } from './models/item.dto';
import { IndexDbService } from './services/index-db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // NgxCurrencyDirective, MatButtonModule, ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  calculatorForm!: FormGroup;
  detailsForm!: FormGroup;

  baseAmount = signal<number>(0);
  items = signal<ItemDto[]>([]);
  percentageSum = signal<number>(0);
  expense = signal<ExpenseDto>({ baseAmount: 0, details: [] });

  constructor(private indexDBService: IndexDbService) {
    this.calculatorForm = new FormGroup({
      baseAmount: new FormControl('', [Validators.required]),
      itemTitle: new FormControl('', [Validators.required]),
    });
    this.detailsForm = new FormGroup({});
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.indexDBService.getExpense();
  }

  onBaseAmountChange(event: any) {
    let money = this.retrieveAmount(event.target.value as string);
    this.baseAmount.update((b) => (b = parseFloat(money)));
  }

  addExpenseItem() {
    const title = this.calculatorForm.get('itemTitle')?.value;
    this.detailsForm.addControl(title, new FormControl(''));
    const item: ItemDto = {
      name: title,
      amount: 0,
      percentage: 0,
    };
    let d: ItemDto[] = [];
    this.indexDBService.addExpense({
      baseAmount: this.baseAmount(),
      details: [...d, item],
    });
    this.items.update((i) => [...i, item]);
  }

  calculatePercentage(event: any, item: ItemDto) {
    let money = this.retrieveAmount(event.target.value as string);
    this.items().map((i) =>
      i.name === item.name
        ? (i.percentage = +(
            (parseFloat(money) / this.baseAmount()) *
            100
          ).toFixed(2))
        : i
    );
    let sum = this.items().reduce((a, b) => a + b.percentage, 0);
    this.percentageSum.update((v) => (v = sum));
    console.log(sum);
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
