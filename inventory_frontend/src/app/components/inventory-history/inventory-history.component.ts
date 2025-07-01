import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, InventoryHistory } from '../../services/api.service';

@Component({
  selector: 'app-inventory-history',
  templateUrl: './inventory-history.component.html',
  styleUrl: './inventory-history.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class InventoryHistoryComponent implements OnInit {
  history: InventoryHistory[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loading = true;
    this.api.getHistory().subscribe({
      next: (h: InventoryHistory[]) => {
        this.history = h;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load inventory history';
        this.loading = false;
      }
    });
  }
}
