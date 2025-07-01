import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ProductFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  error = '';
  saving = false;
  product: Partial<Product> = {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock_level: 0
  };

  // No constructor needed, remove unused parameters

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.loading = true;
      this.api.getProduct(+idParam).subscribe({
        next: (prod: Product) => {
          this.product = prod;
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load product';
          this.loading = false;
        }
      });
    }
  }

  save() {
    if (!this.product.name || this.saving) return;
    this.saving = true;
    const req = this.isEdit && this.product.id
      ? this.api.updateProduct(this.product.id, this.product)
      : this.api.addProduct(this.product);

    req.subscribe({
      next: (res: Product) => {
        this.saving = false;
        this.router.navigate(['/products', res.id]);
      },
      error: () => {
        this.error = 'Failed to save product';
        this.saving = false;
      }
    });
  }
}
