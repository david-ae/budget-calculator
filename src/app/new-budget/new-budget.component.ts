import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-budget',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule],
  templateUrl: './new-budget.component.html',
  styleUrl: './new-budget.component.css',
})
export class NewBudgetComponent {
  createNewBudgetForm!: FormGroup;

  constructor(private router: Router) {
    this.createNewBudgetForm = new FormGroup({
      budgetName: new FormControl('', [Validators.required]),
    });
  }

  goBack(){
this.router.navigate(['/home'])
  }
}
