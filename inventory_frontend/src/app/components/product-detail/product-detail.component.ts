import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product, InventoryHistory } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  loading = true;
  error = '';
  quantityToAdd = 0;
  note = '';
  updatingStock = false;
  history: InventoryHistory[] = [];
  showHistory = false;
  deleting = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.api.getProduct(id).subscribe({
      next: (prod: Product) => {
        this.product = prod;
        this.loading = false;
      },
      error: () => {
        this.error = 'Product not found.';
        this.loading = false;
      }
    });
  }

  goToEdit() {
    this.router.navigate(['/products/edit', this.product.id]);
  }

  updateStock(change: number) {
    if (change === 0) return;
    this.updatingStock = true;
    this.api.updateStock(this.product.id, { quantity: change, note: this.note }).subscribe({
      next: (updated: Product) => {
        this.product = updated;
        this.quantityToAdd = 0;
        this.note = '';
        this.updatingStock = false;
      },
      error: () => {
        this.error = 'Failed to update stock';
        this.updatingStock = false;
      }
    });
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
    if (this.showHistory && !this.history.length) {
      this.api.getProductHistory(this.product.id).subscribe({
        next: (history: InventoryHistory[]) => (this.history = history),
        error: () => (this.error = 'Failed to fetch history')
      });
    }
  }

  deleteProduct() {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    this.deleting = true;
    this.api.deleteProduct(this.product.id).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => {
        this.error = 'Failed to delete product';
        this.deleting = false;
      }
    });
  }
}
