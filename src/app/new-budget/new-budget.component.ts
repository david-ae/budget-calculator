import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { IndexDbService } from '../services/index-db.service';
import { BudgetService } from '../services/budget.service';

@Component({
  selector: 'app-new-budget',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule],
  templateUrl: './new-budget.component.html',
  styleUrl: './new-budget.component.css',
})
export class NewBudgetComponent implements OnInit {
  sharedService = inject(SharedService);
  indexDbService = inject(IndexDbService);
  budgetService = inject(BudgetService);

  createNewBudgetForm!: FormGroup;

  constructor(private router: Router) {
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
    this.budgetService.budgetName = name;
    this.budgetService.newBudget = true;
    this.router.navigate(['/budget-detail']);
  }

  checkBudgetName(event: any) {
    const name = event.target.value;
    this.indexDbService.checkBudgetName(name).then((budget) => {
      if (budget) {
        this.createNewBudgetForm.controls['budgetName'].setErrors({
          invalid: true,
        });
        alert(`Budget with name: ${name} already exists`);
      }
    });
  }
}
