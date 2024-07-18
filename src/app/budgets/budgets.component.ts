import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IndexDbService } from '../services/index-db.service';
import { BudgetDto } from '../models/expense.dto';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css',
})
export class BudgetsComponent implements OnInit {
  budgets: BudgetDto[] = [];
  filteredBudgets: BudgetDto[] = [];
  searchText!: string;

  constructor(
    private indexDBService: IndexDbService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.indexDBService.getAllBudgets().subscribe((values) => {
      this.filteredBudgets = values;
      this.budgets = values;
    });
    this.sharedService.newBudget.update((v) => (v = false));
  }

  onChange(event: any) {
    const value = event.target.value;
    this.filteredBudgets =
      (value as string) == ''
        ? this.budgets
        : this.budgets.filter((b) => b.name.toLowerCase().includes(value));
  }

  viewBudget(id?: number) {
    this.indexDBService.getBudget(id as number).subscribe((budget) => {
      if (budget) {
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
