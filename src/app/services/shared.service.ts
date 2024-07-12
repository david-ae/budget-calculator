import { Injectable, signal } from '@angular/core';
import { BudgetDto } from '../models/expense.dto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  budget = new BehaviorSubject<BudgetDto>({name: '', baseAmount: 0, details: []})
  newBudget = signal<boolean>(false);

  constructor() {}
}
