import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IndexDbService } from '../services/index-db.service';
import { BudgetDto } from '../models/expense.dto';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.css',
})
export class BudgetsComponent implements OnInit {
  budgets: BudgetDto[] = [];

  constructor(private indexDBService: IndexDbService) {}

  ngOnInit(): void {
    this.indexDBService
      .getAllBudgets()
      .subscribe((values) => (this.budgets = values));
  }
}
