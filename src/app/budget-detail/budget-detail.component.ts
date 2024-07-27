import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgxCurrencyDirective } from 'ngx-currency';
import { ItemDto } from '../models/item.dto';
import { IndexDbService } from '../services/index-db.service';
import { SharedService } from '../services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BudgetDto } from '../models/expense.dto';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/dialogs/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { BudgetService } from '../services/budget.service';
import { NewBudgetItemDialogComponent } from '../components/dialogs/new-budgetItem-dialog/new-budgetItem-dialog.component';
import { CommonModule } from '@angular/common';
import { CustomValidators } from '../../validators/budget-usage.validator';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    NgxCurrencyDirective,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './budget-detail.component.html',
  styleUrl: './budget-detail.component.css',
})
export class BudgetDetailComponent implements OnInit {
  toastrService = inject(ToastrService);
  budgetService = inject(BudgetService);
  sharedService = inject(SharedService);

  budgetItemsForm!: FormGroup;
  baseAmountForm!: FormGroup;
  myForm!: FormGroup;

  budgetName!: string;
  newBudget!: boolean;
  id!: string;

  budget = signal<BudgetDto>({ name: '', baseAmount: 0, details: [] });
  budget2 = signal<BudgetDto | undefined>({
    name: '',
    baseAmount: 0,
    details: [],
  });

  percentageSum = computed(() =>
    this.budget().details.reduce((a, b) => a + b.percentage, 0)
  );
  amountSum = computed(() =>
    this.budget().details.reduce((a, b) => a + b.amount, 0)
  );
  balance = computed(() => this.budget().baseAmount - this.amountSum());

  items = signal<ItemDto[]>([]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.budgetItemsForm = fb.group({
      items: fb.array([]),
    });

    this.baseAmountForm = new FormGroup({
      baseAmount: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit(): void {
    this.newBudget = this.budgetService.newBudget;
    if (!this.newBudget) {
      this.route.queryParams.subscribe((params) => {
        this.id = params['id'];
        if (this.id) {
          this.budgetService.getBudget2(this.id);
          this.budgetService.getBudget(this.id).then((b) => {
            this.budgetName = b?.name as string;
            this.baseAmountForm.setValue({ baseAmount: b?.baseAmount });
            b?.details.forEach((existingBudgetItem) => {
              const item = this.fb.group({
                budgetItem: new FormControl({
                  value: existingBudgetItem.name,
                  disabled: true,
                }),
                amount: new FormControl(existingBudgetItem.amount, [
                  Validators.max(b.baseAmount),
                ]),
              });
              this.itemControls.push(item);
            });
            this.budget.update((v) => (v = b as BudgetDto));
            this.items.update((v) => (v = this.budget().details));
          });
        }
      });
    } else {
      this.budget.update(
        (v) => (v = { ...v, name: this.budgetService.budgetName })
      );
    }
  }

  onBaseAmountChange(event: any) {
    const newBaseAmount = this.budgetService.updateBaseAmount(
      event.target.value as string
    );
    this.budget.update(
      (v) => (v = { ...v, baseAmount: parseFloat(newBaseAmount) })
    );
  }

  addBudgetItem() {
    this.dialog
      .open(NewBudgetItemDialogComponent, { data: 'name' })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          const item = this.fb.group({
            budgetItem: new FormControl(
              { value: this.sharedService.newBudgetItem, disabled: true },
              Validators.required
            ),
            amount: new FormControl('', [
              Validators.max(this.budget().baseAmount),
            ]),
          });
          this.itemControls.push(item);
          const budgetItem: ItemDto = {
            name: this.sharedService.newBudgetItem,
            amount: 0,
            percentage: 0,
          };
          this.budget.update(
            (v) => (v = { ...v, details: [...v.details, budgetItem] })
          );
          this.items.update((v) => (v = this.budget().details));
        }
      });
  }

  deleteItem(itemName: string) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Do you want to delete this item from the budget?',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.itemControls.controls.forEach((control) => {
            const budgetItemValue = control.get('budgetItem')?.value;
            if (budgetItemValue === itemName) {
              var index = this.itemControls.controls.indexOf(control);
              this.itemControls.controls.splice(index, 1);
            }
          });
        }
      });
  }

  calculatePercentage(budgetItem: string) {
    const control = this.itemControls.controls.find(
      (c) => c.get('budgetItem')?.value == budgetItem
    );
    if (control) {
      const amount = control.get('amount')?.value;
      const percentage = (parseFloat(amount) / this.budget().baseAmount) * 100;
      this.items().map((i) => {
        if (i.name === budgetItem) {
          i.amount = amount;
          i.percentage = percentage;
        }
      });
      this.budget.update((b) => (b = { ...b, details: this.items() }));
      if (this.percentageSum() >= 100) {
        this.baseAmountForm.setErrors({ invalid: true });
      } else this.baseAmountForm.setErrors(null);
    }
  }

  saveNewBudget() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Do you want to save this budget?',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.budgetService.saveNewBudget(this.budget()).then((response) => {
            if (response) {
              this.toastrService.success('Budget Saved');
              this.budgetService.newBudget = false;
              this.newBudget = this.budgetService.newBudget;
              this.router.navigate(['/budgets']);
            }
          });
        }
      });
  }

  updateBudget() {
    const dialogRef = this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Do you want to update this budget?',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          this.budgetService
            .updateBudget(parseInt(this.id), this.budget())
            .then((response) => {
              if (response) {
                this.toastrService.success('Budget Updated');
                dialogRef.closed = true;
              }
            });
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
          this.budgetService
            .deleteBudget(this.budget().id as number)
            .then(() => {
              this.toastrService.success('Budget Deleted');
              this.router.navigate(['/budgets']);
            });
        }
      });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goToViewBudgets() {
    this.router.navigate(['/budgets']);
  }

  get itemControls() {
    return this.budgetItemsForm.controls['items'] as FormArray;
  }
}
