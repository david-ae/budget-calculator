import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  newBudgetItem!: string;

  hasExistingBudgets = signal<boolean>(false);

  constructor() {}
}
