import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-menu',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './common-menu.component.html',
  styleUrl: './common-menu.component.css',
})
export class CommonMenuComponent {
  @Input() hideHomeMenu = false;
  @Input() hideViewBudgetsMenu = false;
  @Input() hideCreateNewBudgetMenu = false;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }

  goToViewBudgets() {
    this.router.navigate(['/budgets']);
  }

  goToCreateNewBudget() {
    this.router.navigate(['/new-budget']);
  }
}
