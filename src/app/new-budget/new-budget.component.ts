import { Component, signal, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { BudgetDto } from '../models/expense.dto';
import { SharedService } from '../services/shared.service';
import { IndexDbService } from '../services/index-db.service';

@Component({
  selector: 'app-new-budget',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule],
  templateUrl: './new-budget.component.html',
  styleUrl: './new-budget.component.css',
})
export class NewBudgetComponent implements OnInit {
  createNewBudgetForm!: FormGroup;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private indexDbService: IndexDbService
  ) {
    this.createNewBudgetForm = new FormGroup({
      budgetName: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  goHome() {
    this.router.navigate(['/home']);
  }

  createBudget() {
    const name = this.createNewBudgetForm.get('budgetName')?.value;

    this.indexDbService.checkBudgetName(name).subscribe((budget) => {
      if (!budget) {
        const budget: BudgetDto = {
          name: name,
          details: [],
          baseAmount: 0,
        };
        this.sharedService.budget.next(budget);
        this.sharedService.newBudget.update((v) => (v = true));
        this.router.navigate(['/budget-detail']);
      } else alert(`Budget with name: ${name} already exists`);
    });
  }
}
