import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  search = '';
  loading = false;
  error = '';
  minStock?: number;

  constructor(private api: ApiService, public router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.error = '';
    this.api.getProducts(this.search, undefined, this.minStock)
      .subscribe({
        next: (products: Product[]) => {
          this.products = products;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = 'Failed to load products';
        }
      });
  }

  onSearchChange() {
    this.fetchProducts();
  }

  goToAdd() {
    this.router.navigate(['/products/add']);
  }

  goToDetail(product: Product) {
    this.router.navigate(['/products', product.id]);
  }
}
