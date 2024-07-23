import { Component, computed, OnInit, signal } from '@angular/core';
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
import { NewBudgetDialogComponent } from '../components/dialogs/new-budget-dialog/new-budget-dialog.component';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [MatButtonModule, NgxCurrencyDirective, ReactiveFormsModule],
  templateUrl: './budget-detail.component.html',
  styleUrl: './budget-detail.component.css',
})
export class BudgetDetailComponent implements OnInit {
  budgetItemsForm!: FormGroup;
  baseAmountForm!: FormGroup;
  myForm!: FormGroup;

  budget!: BudgetDto;
  amountSum!: number;
  percentageSum!: number;
  balance!: number;
  newBudget!: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private budgetService: BudgetService
  ) {
    this.budgetItemsForm = fb.group({
      items: fb.array([]),
    });

    this.baseAmountForm = new FormGroup({
      baseAmount: new FormControl('', [Validators.required, Validators.min(1)]),
    });
  }

  ngOnInit(): void {
    this.amountSum = this.budgetService.amountSum();
    this.percentageSum = this.budgetService.percentageSum();
    // this.newBudget = this.sharedService.newBudget();
    // this.sharedService.budget.subscribe((budget) => {
    //   this.budgetName = budget.name;
    // });
    this.route.queryParams.subscribe((params) => {
      // this.id = params['id'];
      // if (this.id) {
      //   this.budgetData(this.id);
      // }
    });
  }

  onBaseAmountChange(event: any) {
    this.budgetService.updateBaseAmount(event.target.value as string);
    this.budget = this.budgetService.budget();
  }

  addBudgetItem() {
    this.dialog
      .open(NewBudgetDialogComponent, {data: 'name'})
      .afterClosed()
      .subscribe((result) => console.log(result));
    const item = this.fb.group({
      title: new FormControl('', Validators.required),
      amount: new FormControl('', [
        Validators.max(this.budgetService.budget().baseAmount),
      ]),
    });
    this.itemControls.push(item);
  }

  calculatePercentage(amount: string) {
    console.log(amount);
  }

  saveNewBudget() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Do you want to save this budget?',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          // this.indexDBService
          //   .createBudget({
          //     name: this.budgetName,
          //     baseAmount: this.baseAmount(),
          //     details: [...this.items()],
          //   })
          //   .then((response) => {
          //     if (response) {
          //       this.sharedService.newBudget.update((v) => (v = false));
          //       this.toastrService.success('Budget Saved', 'Success');
          //     }
          //   });
        }
      });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goToViewBudgets() {
    this.router.navigate(['/budgets']);
  }

  deleteItem(itemName: string) {}

  updateBudget() {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: 'Do you want to update this budget?',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result === 'confirm') {
          // const budget: BudgetDto = {
          //   baseAmount: this.baseAmount(),
          //   name: this.budgetName,
          //   details: this.items(),
          //   id: parseInt(this.id),
          // };
          // this.indexDBService
          //   .updateBudget(parseInt(this.id), budget)
          //   .then((response) => {
          //     if (response) {
          //       this.toastrService.success('Budget Updated', 'Success');
          //     }
          //   });
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
          // this.indexDBService.deleteBudget(parseInt(this.id)).then(() => {
          //   this.router.navigate(['/budgets']);
          // });
        }
      });
  }

  calculateItemPercentages() {}

  get itemControls() {
    return this.budgetItemsForm.controls['items'] as FormArray;
  }
}
