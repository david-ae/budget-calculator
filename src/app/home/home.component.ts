import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { IndexDbService } from '../services/index-db.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private indexDBService: IndexDbService) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
