import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BudgetDetailComponent } from './budget-detail/budget-detail.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { NewBudgetComponent } from './new-budget/new-budget.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, title: 'Budget Home' },
  {
    path: 'budget-detail',
    component: BudgetDetailComponent,
    title: 'Budget Detail',
  },
  {
    path: 'budget-detail/:id',
    component: BudgetDetailComponent,
    title: 'Budget Detail',
  },
  { path: 'budgets', component: BudgetsComponent, title: 'List of Budgets' },
  {
    path: 'new-budget',
    component: NewBudgetComponent,
    title: 'Create New Budget',
  },
];
