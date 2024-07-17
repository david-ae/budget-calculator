import { Component, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ItemDto } from '../models/item.dto';
import { IndexDbService } from '../services/index-db.service';
import { SharedService } from '../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetDto } from '../models/expense.dto';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [MatButtonModule, NgxCurrencyDirective, ReactiveFormsModule],
  templateUrl: './budget-detail.component.html',
  styleUrl: './budget-detail.component.css',
})
export class BudgetDetailComponent implements OnInit {
  calculatorForm!: FormGroup;
  detailsForm!: FormGroup;

  baseAmount = signal<number>(0);
  items = signal<ItemDto[]>([]);
  percentageSum = signal<number>(0);
  amountSum = signal<number>(0);
  balance = signal<number>(0);

  budgetName!: string;
  newBudget = false;
  id!: string;

  constructor(
    private indexDBService: IndexDbService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.calculatorForm = new FormGroup({
      baseAmount: new FormControl('', [Validators.required, Validators.min(1)]),
      itemTitle: new FormControl('', [Validators.required]),
    });
    this.detailsForm = new FormGroup({});
  }

  ngOnInit(): void {
    this.newBudget = this.sharedService.newBudget();
    this.sharedService.budget.subscribe((budget) => {
      this.budgetName = budget.name;
    });
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.budgetData(this.id);
      }
    });
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

      this.items.update((i) => [...i, item]);
    }
  }

  calculatePercentage(event: any, item: ItemDto) {
    let money = this.retrieveAmount(event.target.value as string);
    if (parseFloat(money) <= this.baseAmount()) {
      this.items().map((i) => {
        if (i.name === item.name) {
          i.amount = Number.parseFloat(parseFloat(money).toFixed(2));
          i.percentage = +(
            (parseFloat(money) / this.baseAmount()) *
            100
          ).toFixed(2);
        }
      });
      this.updatePercentages();
    }
  }

  updatePercentage() {
    this.items().map(
      (i) => (i.percentage = +((i.amount / this.baseAmount()) * 100).toFixed(2))
    );
  }

  budgetData(id: string) {
    this.indexDBService.getBudget(parseInt(id)).subscribe((budget) => {
      this.budgetName = budget?.name as string;
      this.calculatorForm.setValue({
        baseAmount: budget?.baseAmount,
        itemTitle: '',
      });
      budget?.details.forEach((item) => {
        this.detailsForm.addControl(
          item.name,
          new FormControl(item.amount, Validators.max(budget.baseAmount))
        );
      });
      this.items.update((v) => (v = budget?.details as ItemDto[]));
      this.baseAmount.update((v) => (v = budget?.baseAmount as number));
      this.updatePercentages();
    });
  }

  saveNewBudget() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Do you want to save this budget?',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.indexDBService.createBudget({
            name: this.budgetName,
            baseAmount: this.baseAmount(),
            details: [...this.items()],
          });
          this.router.navigate(['/budgets']);
        }
      });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goToViewBudgets() {
    this.router.navigate(['/budgets']);
  }

  deleteItem(itemName: string) {
    var item = this.items().find((i) => i.name === itemName);
    if (item) {
      var index = this.items().indexOf(item);
      this.items().splice(index, 1);
    }
    this.updatePercentages();
  }

  updateBudget() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Do you want to update this budget?',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          const budget: BudgetDto = {
            baseAmount: this.baseAmount(),
            name: this.budgetName,
            details: this.items(),
            id: parseInt(this.id),
          };
          this.indexDBService.updateBudget(parseInt(this.id), budget);
          this.router.navigate(['/budgets']);
        }
      });
  }

  deleteBudget() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Do you want to delete this budget?',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.indexDBService.deleteBudget(parseInt(this.id));
          this.router.navigate(['/budgets']);
        }
      });
  }

  initCalculator() {}

  updatePercentages() {
    let newPercentageSum = this.items().reduce((a, b) => a + b.percentage, 0);
    let newAmountSum = this.items().reduce((a, b) => a + b.amount, 0);
    this.percentageSum.update((v) => (v = newPercentageSum));
    this.amountSum.update((v) => (v = newAmountSum));
    this.balance.update((v) => (v = this.baseAmount() - newAmountSum));
  }

  retrieveAmount(money: string): string {
    return money.replaceAll(',', '').replace('₦', '');
  }
}
