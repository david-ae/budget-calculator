import { Injectable, signal } from '@angular/core';
import { BudgetDto } from '../models/expense.dto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  newBudgetItem!: string;
  
  hasExistingBudgets = signal<boolean>(false);

  constructor() {}
}
