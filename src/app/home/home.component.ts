import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IndexDbService } from '../services/index-db.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private indexDBService: IndexDbService, private router: Router) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  createNewBudget() {
    this.router.navigate(['/new-budget']);
  }
}
