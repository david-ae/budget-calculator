import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IndexDbService } from '../services/index-db.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  hasExistingBudgets = false;

  unsubscriber$ = new Subject<void>();

  constructor(
    private indexDBService: IndexDbService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  ngOnInit(): void {
    this.indexDBService.getAllBudgets().then((budgets) => {
      if (budgets.length > 0) {
        this.sharedService.hasExistingBudgets.update((value) => (value = true));
        this.hasExistingBudgets = this.sharedService.hasExistingBudgets();
      }
    });
  }

  createNewBudget() {
    this.router.navigate(['/new-budget']);
  }

  viewBudgets() {
    this.router.navigate(['/budgets']);
  }
}
