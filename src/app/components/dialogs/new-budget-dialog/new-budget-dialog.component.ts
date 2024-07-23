import { Component, Inject, inject, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-new-budget-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatDialogTitle, MatDialogContent],
  templateUrl: './new-budget-dialog.component.html',
  styleUrl: './new-budget-dialog.component.css',
})
export class NewBudgetDialogComponent {}
