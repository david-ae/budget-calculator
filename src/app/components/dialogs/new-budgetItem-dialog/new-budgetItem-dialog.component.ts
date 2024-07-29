import { Component, Inject, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { SharedService } from '../../../services/shared.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-budget-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
  ],
  templateUrl: './new-budgetItem-dialog.component.html',
  styleUrl: './new-budgetItem-dialog.component.css',
})
export class NewBudgetItemDialogComponent {
  sharedService = inject(SharedService);

  newBudgetItemForm!: FormGroup;

  constructor() {
    this.newBudgetItemForm = new FormGroup({
      budgetItemName: new FormControl('', [Validators.required]),
    });
  }

  setBudgetItemName() {
    const budgetItemName = this.newBudgetItemForm.get('budgetItemName')?.value;
    this.sharedService.newBudgetItem = budgetItemName;
  }
}
