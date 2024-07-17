import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IndexDbService } from '../services/index-db.service';
import { BudgetDto } from '../models/expense.dto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css',
})
export class BudgetsComponent implements OnInit {
  budgets: BudgetDto[] = [];

  constructor(
    private indexDBService: IndexDbService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.indexDBService
      .getAllBudgets()
      .subscribe((values) => (this.budgets = values));
  }

  viewBudget(id?: number) {
    this.indexDBService.getBudget(id as number).subscribe((budget) => {
      if (budget) {
        this.sharedService.newBudget.update((v) => (v = false));
        this.router.navigate(['/budget-detail'], { queryParams: { id: id } });
      }
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  goToCreateNewBudget() {
    this.router.navigate(['/new-budget']);
  }
}
